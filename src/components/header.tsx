import Link from 'next/link'
import { featuredProject, siteConfig } from '@/lib/constants'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-light bg-page/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-6 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 no-underline"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
          <span className="font-mono text-[13px] tracking-tight text-text-primary">
            {siteConfig.handle}
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint sm:inline">
            Graphics / Web
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-[12px] text-text-secondary sm:gap-7 sm:text-[13px]">
          <Link
            href="/#work"
            className="hidden no-underline transition-colors hover:text-text-primary sm:inline"
          >
            Work
          </Link>
          <Link
            href="/writing/"
            className="hidden no-underline transition-colors hover:text-text-primary min-[360px]:inline"
          >
            Writing
          </Link>
          {featuredProject.demo && (
            <a
              href={featuredProject.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent no-underline transition-colors hover:text-text-primary"
            >
              Demo ↗
            </a>
          )}
          <a
            href={`https://github.com/${siteConfig.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline transition-colors hover:text-text-primary"
          >
            GitHub
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="hidden no-underline transition-colors hover:text-text-primary sm:inline"
          >
            Email
          </a>
        </nav>
      </div>
    </header>
  )
}
