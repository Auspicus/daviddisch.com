import { GetStaticProps } from 'next'
import React from 'react'
import got from 'got'
import kebabCase from 'lodash/kebabCase'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function BlogListing({ blogs }) {
  return (
    <Layout title="Blog">
      <h1 className="page-title">Blog</h1>

      <ul className="reset-list">
        {blogs.map(blog => (
          <li key={blog.id}>
            <Link href={`/blog/${kebabCase(blog.attributes.title)}`}>
              <a className="reset-link blog-teaser">
                <h2 className="blog-teaser__title">{blog.attributes.title}</h2>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await got.get('https://cms.desarol.com/jsonapi/node/blog?filter[field_author.id]=8675eb72-5125-4369-aa14-b53b20e6b0a5')
  const data = JSON.parse(response.body)
  const blogs = data.data

  return {
    props: {
      blogs
    }
  }
}