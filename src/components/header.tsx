import Link from 'next/link'
import { siteConfig } from '@/lib/constants'

export default function Header() {
  return (
    <header className="border-b border-border-light">
      <div className="mx-auto flex h-16 w-full max-w-[720px] items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-[17px] tracking-tight text-text-primary no-underline"
        >
          {siteConfig.handle}
        </Link>

        <nav className="flex items-center gap-5 text-[13px]">
          <Link href="/writing/" className="nav-link no-underline">
            文章
          </Link>
          <Link href="/#projects" className="nav-link no-underline">
            项目
          </Link>
          <Link
            href="/#about"
            className="nav-link hidden no-underline min-[360px]:inline"
          >
            关于
          </Link>
          <a
            href={`https://github.com/${siteConfig.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link no-underline"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
