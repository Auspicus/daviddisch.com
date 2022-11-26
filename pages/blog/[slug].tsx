import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React from 'react'
import { Client, isFullBlock, isFullPage } from '@notionhq/client'
import kebabCase from 'lodash/kebabCase'

import Layout from '../../components/Layout'
import { ChildPageBlockObjectResponse, GetPageResponse, ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints'

const BlogDetail: NextPage<{
  page: GetPageResponse,
  blocks: ListBlockChildrenResponse
}> = ({ page, blocks }) => {
  if (!isFullPage(page)) {
    return null
  }

  let title = ''
  if (page.properties.title.type === 'title') {
    title = page.properties.title.title?.[0]?.plain_text
  }

  let body = ''
  blocks.results.forEach(b => {
    if (!isFullBlock(b)) return
    switch (b.type) {
      case 'paragraph':
        body += `<p style="${b.paragraph.color}">
          ${b.paragraph.rich_text.map(r => r.plain_text).join('\r\n')}
        </p>`
        break

      case 'code':
        body += `<pre><code data-language="${b.code.language}">${
          b.code.rich_text.map(t => t.plain_text).join('')
        }</code></pre>`
        break
    }
  })

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

  return {
    props: {
      page,
      blocks,
    }
  }
}