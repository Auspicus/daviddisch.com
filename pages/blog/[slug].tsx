import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'
import got from 'got'
import kebabCase from 'lodash/kebabCase'
import Layout from '../../components/Layout'

export default function BlogDetail(blog) {
  return (
    <Layout title={blog.attributes.title}>
      <article>
        <h1>{blog.attributes.title}</h1>
        <div className="content" dangerouslySetInnerHTML={{ __html: blog?.attributes?.body?.value ?? '' }} />
      </article>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await got.get('https://cms.desarol.com/jsonapi/node/blog?filter[field_author.id]=8675eb72-5125-4369-aa14-b53b20e6b0a5')
  const data = JSON.parse(response.body)

  return {
    paths: data.data.map(b => ({
      params: { slug: kebabCase(b.attributes.title) }
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const response = await got.get('https://cms.desarol.com/jsonapi/node/blog?filter[field_author.id]=8675eb72-5125-4369-aa14-b53b20e6b0a5')
  const data = JSON.parse(response.body)
  const blogs = data.data

  const blog = blogs.find(b => kebabCase(b.attributes.title) === context.params.slug)
  if (!blog) {
    return { notFound: true }
  }

  return {
    props: blog
  }
}