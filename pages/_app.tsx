import React from 'react'
import '../styles/globals.css'

function Root({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default Root
