import { GetStaticProps, NextPage } from 'next'
import React from 'react'
import Link from 'next/link'
import { Client, isFullBlock } from '@notionhq/client'
import kebabCase from 'lodash/kebabCase'

import Layout from '../components/Layout'

const BlogListing: NextPage<{ blogs: BlogListingItem[] }> = ({ blogs }) => {
  return (
    <Layout title="Blog">
      <h1 className="page-title">Blog</h1>

      <ul className="reset-list">
        {blogs.map(blog => (
          <li key={blog.id}>
            <Link href={`/blog/${kebabCase(blog.title)}`}>
              <a className="reset-link blog-teaser">
                <h2 className="blog-teaser__title">{blog.title}</h2>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default BlogListing

type BlogListingItem = { title: string, id: string };

export const getStaticProps: GetStaticProps = async () => {
  const notion = new Client({
    auth: process.env.NOTION_API_TOKEN
  });
  const response = await notion.blocks.children.list({ block_id: 'ee9ad62cac2347d7b54a7b76760b33d5' });
  const childPages = response.results.filter(b => {
    if (!isFullBlock(b)) {
      return false
    }

    return b.type === 'child_page'
  })

  const blogListingItems: BlogListingItem[] = childPages.map(p => {
    if (!isFullBlock(p)) {
      return
    }

    if (p.type !== 'child_page') {
      return
    }

    return {
      id: p.id,
      title: p.child_page.title
    }
  })

  return {
    props: {
      blogs: blogListingItems
    }
  }
}