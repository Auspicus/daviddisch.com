import React from 'react'
import Head from 'next/head'

const SEO = ({ title }) => {
  return (
    <Head>
      <title>{`${title} - David Disch | Software Engineer`}</title>
      <meta name="description" content="Software engineer, surfer, climber, photographer." />
      <link rel="icon" href="/img/favicon.ico" type="image/x-icon" />
    </Head>
  )
}

export default SEO