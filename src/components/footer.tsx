import { siteConfig } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-border-light">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-1 px-6 py-8 text-[11px] text-text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.handle}
        </p>
        <p>用 Next.js 写的</p>
      </div>
    </footer>
  )
}
