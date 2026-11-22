import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPostDate, getAllPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: '文章',
  description: '记录做项目时想清楚的事，以及一些还没想明白的问题。',
}

export default function WritingPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto w-full max-w-[720px] px-6 pb-20 pt-16">
      <h1 className="font-serif text-[clamp(2rem,5vw,2.6rem)] font-semibold leading-tight tracking-[-0.02em] text-text-primary">
        文章
      </h1>

      <p className="mt-4 max-w-[560px] text-[15px] leading-8 text-text-secondary">
        记录做项目时想清楚的事，以及一些还没想明白的问题。
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 border-t border-border-light pt-6 text-[14px] text-text-secondary">
          还没写。
        </p>
      ) : (
        <div className="mt-10 border-t border-border-light">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}/`}
              className="group block border-b border-border-light py-6"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h2 className="font-serif text-[1.2rem] leading-snug text-text-primary transition-colors group-hover:text-accent">
                  {post.title}
                </h2>
                <time className="shrink-0 font-mono text-[11px] text-text-faint">
                  {formatPostDate(post.date)}
                </time>
              </div>
              {post.summary && (
                <p className="mt-2 max-w-[600px] text-[14px] leading-7 text-text-secondary">
                  {post.summary}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
