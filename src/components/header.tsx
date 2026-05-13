import { siteConfig } from '@/lib/constants'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border-light shadow-sm">
      <div className="max-w-[860px] mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg text-text-dark no-underline">
          <img
            src={siteConfig.avatar}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover border-2 border-brand"
          />
          {siteConfig.title}
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-text-secondary hover:text-brand transition-colors text-sm font-medium no-underline">
            Home
          </Link>
          <Link href="/about" className="text-text-secondary hover:text-brand transition-colors text-sm font-medium no-underline">
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}
