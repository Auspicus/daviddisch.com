import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import Github from './github.svg'
import Twitter from './twitter.svg'

const socials = [
  {
    "icon": Github,
    "link": "https://github.com/auspicus"
  },
  {
    "icon": Twitter,
    "link": "https://twitter.com/auspicus"
  }
]

const menu = []

const Header = () => {
  const router = useRouter()

  return (
    <header className="max-w-header">
      <nav className="nav">
        <ul className="nav-item-list reset-list">
          {menu.map(m => (
            <li key={m.data.path} className={`nav-item ${router.asPath === m.data.path ? 'nav-item-active' : ''}`}>
              <Link href={m.data.path}>
                <a className="reset-link">{m.name}</a>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="nav-social-list reset-list">
          {socials.map(social => (
            <li key={social.link} className="nav-item">
              <a className="reset-link" href={social.link}>
                <social.icon className="social-icon" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header