import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPostDate, getAllPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Writing',
  description: '记录做项目时真正想清楚的事：图形渲染、前端工程和工具开发。',
}

export default function WritingPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto w-full max-w-[920px] px-6 pb-24 pt-16 sm:px-8 sm:pt-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
        Writing
      </p>

      <h1 className="mt-5 text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-[1] tracking-[-0.04em] text-text-primary">
        技术笔记
      </h1>

      <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-text-secondary">
        记录做项目时真正想清楚的事：图形渲染、前端工程和工具开发。尽量写清楚「为什么」，而不只是「怎么做」。
      </p>

      {posts.length === 0 ? (
        <p className="mt-12 border-t border-border-light pt-8 text-sm text-text-secondary">
          文章整理中。
        </p>
      ) : (
        <div className="mt-12 border-y border-border-light">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}/`}
              className="group grid gap-2 border-b border-border-light py-6 no-underline last:border-b-0 sm:grid-cols-[110px_1fr_24px] sm:items-baseline"
            >
              <time className="font-mono text-[11px] text-text-faint">
                {formatPostDate(post.date)}
              </time>

              <div>
                <h2 className="text-lg font-medium tracking-tight text-text-primary transition-colors group-hover:text-accent">
                  {post.title}
                </h2>
                {post.summary && (
                  <p className="mt-1.5 max-w-[640px] text-sm leading-6 text-text-secondary">
                    {post.summary}
                  </p>
                )}
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border-light px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <span className="hidden text-right font-mono text-[12px] text-text-faint transition-transform group-hover:translate-x-0.5 sm:block">
                →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
