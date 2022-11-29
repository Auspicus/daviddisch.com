import { useRouter } from 'next/router'
import Script from 'next/script'
import React, { useEffect } from 'react'
import '../styles/globals.css'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

function Root({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_path: url,
      })
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  
  return <>
    <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=UA-104421109-1" />
    <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-104421109-1');
      `
    }} />
    <Component {...pageProps} />
  </>
}

export default Root
