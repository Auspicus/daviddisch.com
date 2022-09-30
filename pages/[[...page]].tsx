import React from 'react';
import { useRouter } from 'next/router';
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react';
import DefaultErrorPage from 'next/error';

// Replace with your Public API Key
builder.init('ab324e46ee9241588f83dfb68bc0c3ec');

export async function getStaticProps({ params }) {
  // Fetch the builder content
  const [page, menu] = await Promise.all([builder
    .get('page', {
      userAttributes: {
        urlPath: '/' + (params?.page?.join('/') || ''),
      },
    })
    .toPromise(),
    builder.getAll('header-navigation-link', {
      userAttributes: {
        urlPath: '/' + (params?.page?.join('/') || ''),
      }
    })
  ]);

  return {
    props: {
      page: page || null,
      menu: menu || [],
    },
    revalidate: 5
  };
}

export async function getStaticPaths() {
  // Get a list of all pages in builder
  const pages = await builder.getAll('page', {
    // We only need the URL field
    fields: 'data.url', 
    options: { noTargeting: true },
  });

  return {
    paths: pages.map(page => `${page.data?.url}`),
    fallback: true,
  };
}

export default function Page({ page }) {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();

  if (router.isFallback) {
    return <h1>Loading...</h1>
  }

  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />
  }

  return (
    <>
      <BuilderComponent model="page" content={page} />
    </>
  );
}