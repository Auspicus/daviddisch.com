import React from 'react'
import Head from 'next/head'
import { Meta } from '../../types'

const SEO: React.FC<{ title: string, meta?: Meta[] }> = ({ title, meta }) => {
  if (!meta.some(m => m.name === 'description')) {
    meta.push({ name: 'description', content: 'Software engineer, surfer, climber, photographer.' })
  }

  return (
    <Head>
      <title>{`${title} - David Disch | Software Engineer`}</title>
      {meta.map(m => <meta key={m.name} name={m.name} content={m.content} />)}
      <link rel="icon" href="/img/favicon.ico" type="image/x-icon" />
    </Head>
  )
}

export default SEO