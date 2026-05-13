import { siteConfig } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border-light mt-16 py-10">
      <div className="max-w-[860px] mx-auto px-6 text-center text-sm text-text-secondary">
        <p>&copy; {new Date().getFullYear()} {siteConfig.title}. All rights reserved.</p>
      </div>
    </footer>
  )
}
