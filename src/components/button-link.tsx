import Link from 'next/link'
import type { ReactNode } from 'react'

const styles = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-full bg-text-primary px-5 py-2.5 text-[13px] font-medium text-page no-underline transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-full border border-border-light px-5 py-2.5 text-[13px] font-medium text-text-primary no-underline transition-colors hover:border-text-secondary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
}

export default function ButtonLink({
  href,
  children,
  variant = 'secondary',
}: {
  href: string
  children: ReactNode
  variant?: keyof typeof styles
}) {
  const className = styles[variant]

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      className={className}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}
