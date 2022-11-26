import { NextPage } from 'next'
import React from 'react'

import Layout from '../components/Layout'
import contributions from '../contributions.json'

const BlogListing: NextPage = () => {
  return (
    <Layout title="Blog">
      <h1 className="page-title">
        <a className="reset-link" href="https://github.com/pulls?q=is%3Apr+author%3AAuspicus+archived%3Afalse+-org%3Aivcmedia+-org%3Aredlion-rlhc+-org%3AAuspicus+-org%3ATraktek+-org%3AAccruent+-org%3AValerioageno+-org%3ADesarol+-org%3Aif-else-co+-org%3AMMCore+-org%3AJordanDDisch+-org%3AViveelsueno+is%3Apublic+-org%3Arcaracaus+">
          Open Source Contributions
        </a>
      </h1>

      <ul className="reset-list">
        {contributions
        .map(c => ({
          ...c,
          date: new Date(c.date),
        }))
        .sort((a, b) => b.date > a.date ? 1 : -1)
        .map(c => (
          <li className="open-source-link" key={c.link}>
            <a className="reset-link" style={{ color: c.project.color, fontWeight: 'bold' }} href={c.project.link}>{c.project.name}</a>
            <span style={{ fontSize: '.8rem', color: 'rgba(0, 0, 0, .6)', marginLeft: '1rem' }}>{c.date.toLocaleDateString()}</span>
            <a className="reset-link" href={c.link}>
              <h2 className="open-source-link__title">{c.title}</h2>
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default BlogListing
