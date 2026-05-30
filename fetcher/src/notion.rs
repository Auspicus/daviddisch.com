use anyhow::Result;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct BlocksResponse {
    pub results: Vec<Block>,
    pub has_more: bool,
    pub next_cursor: Option<String>,
}

#[derive(Debug, Deserialize, Clone)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum Block {
    ChildPage {
        id: String,
        child_page: ChildPage,
    },
    Image {
        id: String,
        image: ImageBlock,
    },
    BulletedListItem {
        id: String,
        bulleted_list_item: RichTextContainer,
    },
    Heading1 {
        id: String,
        heading_1: RichTextContainer,
    },
    Heading2 {
        id: String,
        heading_2: RichTextContainer,
    },
    Heading3 {
        id: String,
        heading_3: RichTextContainer,
    },
    Paragraph {
        id: String,
        paragraph: ParagraphContainer,
    },
    Code {
        id: String,
        code: CodeContainer,
    },
    #[serde(other)]
    Unknown,
}

#[derive(Debug, Deserialize, Clone)]
pub struct ChildPage {
    pub title: String,
}

#[derive(Debug, Deserialize, Clone)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum ImageBlock {
    File { file: UrlContainer },
    External { external: UrlContainer },
}

impl ImageBlock {
    pub fn url(&self) -> &str {
        match self {
            ImageBlock::File { file } => &file.url,
            ImageBlock::External { external } => &external.url,
        }
    }
}

#[derive(Debug, Deserialize, Clone)]
pub struct UrlContainer {
    pub url: String,
}

#[derive(Debug, Deserialize, Clone)]
pub struct RichTextContainer {
    pub rich_text: Vec<RichText>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct ParagraphContainer {
    pub rich_text: Vec<RichText>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct CodeContainer {
    pub language: String,
    pub rich_text: Vec<RichText>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct RichText {
    pub plain_text: String,
    #[serde(rename = "type")]
    pub kind: String,
    pub annotations: Annotations,
    pub text: Option<TextContent>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Annotations {
    pub code: bool,
}

#[derive(Debug, Deserialize, Clone)]
pub struct TextContent {
    pub content: String,
    pub link: Option<Link>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Link {
    pub url: String,
}

#[derive(Debug, Deserialize)]
pub struct Page {
    pub properties: PageProperties,
    pub cover: Option<Cover>,
}

#[derive(Debug, Deserialize)]
pub struct PageProperties {
    pub title: TitleProperty,
}

#[derive(Debug, Deserialize)]
pub struct TitleProperty {
    pub title: Vec<RichText>,
}

#[derive(Debug, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum Cover {
    External { external: UrlContainer },
    File { file: UrlContainer },
}

impl Cover {
    pub fn url(&self) -> &str {
        match self {
            Cover::External { external } => &external.url,
            Cover::File { file } => &file.url,
        }
    }
}

pub struct NotionClient {
    client: reqwest::Client,
    api_key: String,
}

impl NotionClient {
    pub fn new(api_key: String) -> Self {
        Self {
            client: reqwest::Client::new(),
            api_key,
        }
    }

    pub async fn list_blocks(&self, block_id: &str) -> Result<Vec<Block>> {
        let mut all_blocks = Vec::new();
        let mut cursor: Option<String> = None;

        loop {
            let mut req = self
                .client
                .get(format!(
                    "https://api.notion.com/v1/blocks/{}/children",
                    block_id
                ))
                .header("Authorization", format!("Bearer {}", self.api_key))
                .header("Notion-Version", "2022-06-28")
                .query(&[("page_size", "100")]);

            if let Some(ref c) = cursor {
                req = req.query(&[("start_cursor", c.as_str())]);
            }

            let resp: BlocksResponse = req.send().await?.error_for_status()?.json().await?;
            let has_more = resp.has_more;
            cursor = resp.next_cursor.clone();
            all_blocks.extend(resp.results);

            if !has_more {
                break;
            }
        }

        Ok(all_blocks)
    }

    pub async fn get_page(&self, page_id: &str) -> Result<Page> {
        let page: Page = self
            .client
            .get(format!("https://api.notion.com/v1/pages/{}", page_id))
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Notion-Version", "2022-06-28")
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;
        Ok(page)
    }
}
