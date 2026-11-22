import { siteConfig } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border-light">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-2 px-6 py-8 font-mono text-[11px] text-text-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {siteConfig.handle}
        </p>
        <p>Next.js · Static export · GitHub Pages</p>
      </div>
    </footer>
  )
}
