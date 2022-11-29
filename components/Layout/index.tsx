import Link from 'next/link'
import { useRouter } from 'next/router'
import { Meta } from '../../types'
import SEO from '../SEO'
import Github from './github.svg'
import Twitter from './twitter.svg'

const pages = [
  {title: 'whois', url: '/'},
  {title: 'ls -la', url: '/blog'},
  {title: 'git log', url: '/open-source'},
  {title: 'cv', url: '/cv'},
]

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

const Layout: React.FC<React.PropsWithChildren<{ title: string, meta?: Meta[] }>> = ({ children, title, meta }) => {
  const router = useRouter()

  return (
    <>
      <SEO title={title} meta={meta} />

      <header className="max-w-header">
        <nav className="nav">
          <ul className="nav-item-list reset-list">
            {pages.map(p => (
              <li key={p.url} className={`nav-item ${router.pathname === p.url ? 'nav-item-active' : ''}`}>
                <Link href={p.url}>
                  <a className="reset-link">{p.title}</a>
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

      <main className="max-w-main">
        {children}
      </main>

      <footer className="max-w-footer"></footer>
    </>
  )
}

export default Layout