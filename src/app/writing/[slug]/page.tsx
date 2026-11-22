import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PostBody from '@/components/post-body'
import { formatPostDate, getAllPosts, getPost } from '@/lib/posts'

type PageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) return {}

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) notFound()

  return (
    <article className="mx-auto w-full max-w-[760px] px-6 pb-24 pt-10 sm:px-8">
      <Link
        href="/writing/"
        className="font-mono text-[11px] text-text-secondary no-underline transition-colors hover:text-text-primary"
      >
        ← 全部文章
      </Link>

      <header className="mt-12 border-b border-border-light pb-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text-faint">
          <time>{formatPostDate(post.date)}</time>
          {post.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>

        <h1 className="mt-5 text-balance text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-text-primary">
          {post.title}
        </h1>

        {post.summary && (
          <p className="mt-5 text-[16px] leading-7 text-text-secondary">
            {post.summary}
          </p>
        )}
      </header>

      <div className="mt-10">
        <PostBody content={post.content} />
      </div>

      <div className="mt-16 flex items-center justify-between border-t border-border-light pt-6">
        <Link
          href="/writing/"
          className="font-mono text-[11px] text-text-secondary no-underline transition-colors hover:text-text-primary"
        >
          ← 全部文章
        </Link>
        <Link
          href="/#work"
          className="font-mono text-[11px] text-text-secondary no-underline transition-colors hover:text-text-primary"
        >
          作品 →
        </Link>
      </div>
    </article>
  )
}
