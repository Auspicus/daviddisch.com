import { Builder } from '@builder.io/react'
import dynamic from 'next/dynamic'

Builder.registerComponent(
  dynamic(() => import('./components/Header')),
  {
    name: 'Header',
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/id-badge.png',
  }
)