mod notion;

use anyhow::{Context, Result};
use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine};
use notion::{Block, NotionClient};
use std::path::Path;

const ROOT_BLOCK: &str = "ee9ad62cac2347d7b54a7b76760b33d5";

#[tokio::main]
async fn main() -> Result<()> {
    let api_key = std::env::var("NOTION_API_KEY")
        .context("NOTION_API_KEY not set")?;

    let notion = NotionClient::new(api_key);

    // Ensure output dirs exist (relative to fetcher/, running from zola/fetcher/)
    tokio::fs::create_dir_all("../content/blog").await?;
    tokio::fs::create_dir_all("../static/img/blog").await?;
    tokio::fs::create_dir_all("../static/img/og").await?;

    println!("Fetching blog list from Notion...");
    let blocks = notion.list_blocks(ROOT_BLOCK).await?;

    let child_pages: Vec<_> = blocks
        .into_iter()
        .filter_map(|b| match b {
            Block::ChildPage { id, child_page } => Some((id, child_page.title)),
            _ => None,
        })
        .collect();

    println!("Found {} posts", child_pages.len());

    for (page_id, title) in child_pages {
        let post_slug = slug::slugify(&title);
        println!("Processing: {}", title);

        let (page, blocks) =
            tokio::try_join!(notion.get_page(&page_id), notion.list_blocks(&page_id))?;

        // Build markdown body
        let mut md = String::new();
        let mut description = String::new();
        let mut in_bullet_list = false;

        for (i, block) in blocks.iter().enumerate() {
            match block {
                Block::Heading1 { heading_1, .. } => {
                    if in_bullet_list {
                        md.push('\n');
                        in_bullet_list = false;
                    }
                    let text = rich_text_to_plain(&heading_1.rich_text);
                    md.push_str(&format!("\n# {}\n\n", text));
                }
                Block::Heading2 { heading_2, .. } => {
                    if in_bullet_list {
                        md.push('\n');
                        in_bullet_list = false;
                    }
                    let text = rich_text_to_plain(&heading_2.rich_text);
                    md.push_str(&format!("\n## {}\n\n", text));
                }
                Block::Heading3 { heading_3, .. } => {
                    if in_bullet_list {
                        md.push('\n');
                        in_bullet_list = false;
                    }
                    let text = rich_text_to_plain(&heading_3.rich_text);
                    md.push_str(&format!("\n### {}\n\n", text));
                }
                Block::Paragraph { paragraph, .. } => {
                    if in_bullet_list {
                        md.push('\n');
                        in_bullet_list = false;
                    }
                    let text = rich_text_to_inline_html(&paragraph.rich_text);
                    if description.is_empty() && !text.trim().is_empty() {
                        description = strip_html(&text);
                    }
                    md.push_str(&format!("{}\n\n", text));
                }
                Block::BulletedListItem {
                    bulleted_list_item, ..
                } => {
                    in_bullet_list = true;
                    let text = rich_text_to_plain(&bulleted_list_item.rich_text);
                    md.push_str(&format!("- {}\n", text));
                    // Close list if next block is not a bullet
                    let next_is_bullet = blocks.get(i + 1).map_or(false, |b| {
                        matches!(b, Block::BulletedListItem { .. })
                    });
                    if !next_is_bullet {
                        md.push('\n');
                        in_bullet_list = false;
                    }
                }
                Block::Code { code, .. } => {
                    if in_bullet_list {
                        md.push('\n');
                        in_bullet_list = false;
                    }
                    let lang = if code.language == "plain text" {
                        "text"
                    } else {
                        &code.language
                    };
                    let text = rich_text_to_plain(&code.rich_text);
                    md.push_str(&format!("```{}\n{}\n```\n\n", lang, text));
                }
                Block::Image { image, .. } => {
                    if in_bullet_list {
                        md.push('\n');
                        in_bullet_list = false;
                    }
                    let url = image.url();
                    match download_image(url, "../static/img/blog").await {
                        Ok(filename) => {
                            md.push_str(&format!("![](/img/blog/{})\n\n", filename));
                        }
                        Err(e) => {
                            eprintln!("  Failed to download image {}: {}", url, e);
                        }
                    }
                }
                Block::ChildPage { .. } | Block::Unknown => {}
            }
        }

        // Download cover image for OG
        let og_image = if let Some(cover) = &page.cover {
            let url = cover.url();
            match download_image(url, "../static/img/og").await {
                Ok(_) => {
                    // Use slug-based name for OG images
                    let ext = url_ext(url);
                    let og_path = format!("../static/img/og/{}.{}", post_slug, ext);
                    // Re-download with predictable name
                    if let Ok(bytes) = reqwest::get(url).await.and_then(|r| Ok(r)) {
                        let bytes = bytes.bytes().await.unwrap_or_default();
                        let _ = tokio::fs::write(&og_path, &bytes).await;
                    }
                    Some(format!("/img/og/{}.{}", post_slug, ext))
                }
                Err(e) => {
                    eprintln!("  Failed to download cover: {}", e);
                    None
                }
            }
        } else {
            None
        };

        // Get page title from properties
        let page_title = page
            .properties
            .title
            .title
            .first()
            .map(|r| r.plain_text.trim().to_string())
            .unwrap_or_else(|| title.clone());

        // Get date from page (fall back to epoch if not available)
        let date = "1970-01-01";

        // Write markdown file
        let mut frontmatter = format!(
            "+++\ntitle = {}\ndate = {}\n",
            toml_string(&page_title),
            date
        );
        if !description.is_empty() {
            frontmatter.push_str(&format!("description = {}\n", toml_string(&description)));
        }
        if let Some(ref og) = og_image {
            frontmatter.push_str(&format!("[extra]\nog_image = \"{}\"\n", og));
        }
        frontmatter.push_str("+++\n");

        let content = format!("{}{}", frontmatter, md);
        let out_path = format!("../content/blog/{}.md", post_slug);
        tokio::fs::write(&out_path, content).await?;
        println!("  Wrote {}", out_path);
    }

    println!("Done.");
    Ok(())
}

fn rich_text_to_plain(rich: &[notion::RichText]) -> String {
    rich.iter().map(|r| r.plain_text.as_str()).collect()
}

fn rich_text_to_inline_html(rich: &[notion::RichText]) -> String {
    rich.iter()
        .map(|r| {
            if r.annotations.code {
                format!("<code>{}</code>", html_escape(&r.plain_text))
            } else if let Some(text) = &r.text {
                if let Some(link) = &text.link {
                    format!(
                        r#"<a class="reset-link" style="text-decoration: underline;" href="{}">{}</a>"#,
                        link.url,
                        html_escape(&text.content)
                    )
                } else {
                    html_escape(&text.content)
                }
            } else {
                html_escape(&r.plain_text)
            }
        })
        .collect()
}

fn html_escape(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
}

fn strip_html(s: &str) -> String {
    let mut out = String::new();
    let mut in_tag = false;
    for c in s.chars() {
        match c {
            '<' => in_tag = true,
            '>' => in_tag = false,
            _ if !in_tag => out.push(c),
            _ => {}
        }
    }
    out
}

fn toml_string(s: &str) -> String {
    format!("\"{}\"", s.replace('\\', "\\\\").replace('"', "\\\""))
}

fn url_ext(url: &str) -> &str {
    url.split('?')
        .next()
        .and_then(|u| u.rsplit('.').next())
        .unwrap_or("png")
}

async fn download_image(url: &str, dest_dir: &str) -> Result<String> {
    let digest = md5::compute(url.as_bytes());
    let encoded = URL_SAFE_NO_PAD.encode(digest.0);

    let resp = reqwest::get(url).await?.error_for_status()?;
    let content_type = resp
        .headers()
        .get("content-type")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("image/png")
        .to_string();
    let ext = content_type
        .split('/')
        .nth(1)
        .and_then(|e| e.split(';').next())
        .unwrap_or("png");

    let filename = format!("{}.{}", encoded, ext);
    let dest = Path::new(dest_dir).join(&filename);

    if !dest.exists() {
        let bytes = resp.bytes().await?;
        tokio::fs::write(&dest, &bytes).await?;
    }

    Ok(filename)
}
