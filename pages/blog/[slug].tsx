import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React from 'react'
import { Client, isFullBlock, isFullPage } from '@notionhq/client'
import kebabCase from 'lodash/kebabCase'
import hljs from 'highlight.js'
import axios from 'axios'
import 'highlight.js/styles/a11y-light.css'

import Layout from '../../components/Layout'
import { ChildPageBlockObjectResponse, GetPageResponse, ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints'

const BlogDetail: NextPage<{
  title: string,
  body: string
}> = ({ title, body }) => {
  return (
    <Layout title={title}>
      <article>
        <h1>{title}</h1>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </article>
    </Layout>
  )
}

export default BlogDetail

export const getStaticPaths: GetStaticPaths = async () => {
  const notion = new Client({
    auth: process.env.NOTION_API_TOKEN
  });
  const response = await notion.blocks.children.list({ block_id: 'ee9ad62cac2347d7b54a7b76760b33d5' });
  const childPages = response.results.filter(b => {
    if (!isFullBlock(b)) {
      return false
    }

    return b.type === 'child_page'
  }) as ChildPageBlockObjectResponse[]

  return {
    paths: childPages.map(p => ({
      params: { slug: kebabCase(p.child_page.title) }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  if (Array.isArray(context.params.slug)) {
    return { notFound: true }
  }

  const notion = new Client({
    auth: process.env.NOTION_API_TOKEN
  })

  const allBlogs = await notion.blocks.children.list({ block_id: 'ee9ad62cac2347d7b54a7b76760b33d5' });
  const childPages = allBlogs.results.filter(b => {
    if (!isFullBlock(b)) {
      return false
    }

    return b.type === 'child_page'
  }) as ChildPageBlockObjectResponse[]
  const currentPage = childPages.find(p => kebabCase(p.child_page.title) === context.params.slug)
  if (!currentPage) {
    return { notFound: true }
  }

  const [page, blocks] = await Promise.all([
    notion.pages.retrieve({ page_id: currentPage.id }),
    notion.blocks.children.list({ block_id: currentPage.id }),
  ])

  if (!isFullPage(page)) {
    return { notFound: true }
  }

  let body = ''
  for (let b of blocks.results) {
    if (!isFullBlock(b)) continue

    switch (b.type) {
      case 'image':
        if (b.image.type === 'file') {
          const r = await axios.get(b.image.file.url, {
            responseType: 'arraybuffer'
          })
          body += `<img src="${`data:${r.headers['content-type']};base64,${r.data.toString('base64')}`}" />`
        }
        if (b.image.type === 'external') {
          const r = await axios.get(b.image.external.url, {
            responseType: 'arraybuffer'
          })
          body += `<img src="${`data:${r.headers['content-type']};base64,${r.data.toString('base64')}`}}" />`
        }
        break

      case 'heading_1':
        body += `<h1>${b.heading_1.rich_text.map(r => r.plain_text).join('')}</h1>`
        break

      case 'heading_2':
        body += `<h2>${b.heading_2.rich_text.map(r => r.plain_text).join('')}</h2>`
        break

      case 'heading_3':
        body += `<h3>${b.heading_3.rich_text.map(r => r.plain_text).join('')}</h3>`
        break

      case 'paragraph':
        body += `<p>
          ${b.paragraph.rich_text.map(r => {
            if (r.annotations.code === true) {
              return `<code>${r.plain_text}</code>`
            } else {
              return r.plain_text
            }
          }).join('\r\n')}
        </p>`
        break

      case 'code':
        body += `<pre class="code-block" data-language="${b.code.language}"><code class="language-${b.code.language}">${
          hljs.highlight(b.code.rich_text.map(t => t.plain_text).join(''), { language: b.code.language }).value
        }</code></pre>`
        break
    }
  }

  let title = ''
  if (page.properties.title.type === 'title') {
    title = page.properties.title.title?.[0]?.plain_text
  }
  
  return {
    props: {
      title,
      body,
    }
  }
}