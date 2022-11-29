import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React from 'react'
import { Client, isFullBlock, isFullPage } from '@notionhq/client'
import { ChildPageBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import kebabCase from 'lodash/kebabCase'
import hljs from 'highlight.js'
import axios from 'axios'
import { load as loadHtml } from 'cheerio'
import 'highlight.js/styles/a11y-light.css'

import { Meta } from '../../types'
import Layout from '../../components/Layout'

const BlogDetail: NextPage<{
  title: string,
  body: string,
  meta: Meta[]
}> = ({ title, body, meta }) => {
  return (
    <Layout title={title} meta={meta}>
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

  // Find the matching page referenced under the root page
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

  // Fetch the matching page and all of its blocks
  const [page, blocks] = await Promise.all([
    notion.pages.retrieve({ page_id: currentPage.id }),
    notion.blocks.children.list({ block_id: currentPage.id }),
  ])

  if (!isFullPage(page)) {
    return { notFound: true }
  }

  // Generate body from blocks
  let body = ''
  for (let b of blocks.results) {
    if (!isFullBlock(b)) continue

    switch (b.type) {
      case 'image':
        if (b.image.type === 'file') {
          // Download the image
          const r = await axios.get(b.image.file.url, {
            responseType: 'arraybuffer'
          })

          // Determine where to save the image
          const cipher = crypto.createHash('md5')
          const filename = cipher.update(b.image.file.url).digest('base64url')
          const ext = r.headers['content-type'].replace('image/', '')
          const filepath = `/img/blog/${filename}.${ext}`
          await fs.promises.writeFile(path.join(process.cwd(), 'public', filepath), r.data)

          // Add a reference to this image in the body
          body += `<img src="${filepath}" />`
        }
        if (b.image.type === 'external') {
          // Download the image
          const r = await axios.get(b.image.external.url, {
            responseType: 'arraybuffer'
          })

          // Determine where to save the image
          const cipher = crypto.createHash('md5')
          const filename = cipher.update(b.image.external.url).digest('base64url')
          const ext = r.headers['content-type'].replace('image/', '')
          const filepath = `/img/blog/${filename}.${ext}`
          await fs.promises.writeFile(path.join(process.cwd(), '../../public', filepath), r.data)

          // Add a reference to this image in the body
          body += `<img src="${filepath}" />`
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
            } else if (r.type === 'text') {
              if (r.text.link) {
                return `<a class="reset-link" style="text-decoration: underline;" href="${r.text.link.url}">${r.text.content}</a>`
              } else {
                return r.text.content
              }
            } else {
              return r.plain_text
            }
          }).join('\r\n')}
        </p>`
        break

      case 'code':
        body += `<pre class="code-block" data-language="${b.code.language}"><code class="language-${b.code.language}">${
          b.code.language === 'plain text'
            ? b.code.rich_text.map(t => t.plain_text).join('')
            : hljs.highlight(b.code.rich_text.map(t => t.plain_text).join(''), { language: b.code.language }).value
        }</code></pre>`
        break
    }
  }

  let title = ''
  if (page.properties.title.type === 'title') {
    title = page.properties.title.title?.[0]?.plain_text?.trim() ?? ''
  }

  const meta: Meta[] = []
  const $ = loadHtml(body, {}, false)

  const firstParagraph = $('p:first').text().trim()
  meta.push({ name: 'description', content: firstParagraph })

  // Add OG tags
  meta.push({ name: 'og:title', content: title })
  meta.push({ name: 'og:description', content: firstParagraph })
  
  // Download cover image to use for OG image
  let coverImage: string | null = null
  if (page?.cover?.type === 'external') {
    coverImage = page.cover.external.url
  }

  if (coverImage !== null) {
    // Download the image
    const r = await axios.get(coverImage, {
      responseType: 'arraybuffer'
    })

    // Determine where to save the image
    const cipher = crypto.createHash('md5')
    const filename = cipher.update(coverImage).digest('base64url')
    const ext = r.headers['content-type'].replace('image/', '')
    const filepath = `/img/blog/${filename}.${ext}`
    await fs.promises.writeFile(path.join(process.cwd(), '../../public', filepath), r.data)
    meta.push({ name: 'og:image', content: filepath })
  }

  return {
    props: {
      title,
      body,
      meta,
    }
  }
}
