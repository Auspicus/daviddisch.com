import React from 'react'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout title="About">
      <h1 className="page-title">David Disch</h1>
      <h2 className="page-subtitle">Software Engineer</h2>
      <img className="avatar" src="/img/me.jpeg" alt="" />
    </Layout>
  )
}
