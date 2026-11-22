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
    <article className="mx-auto w-full max-w-[680px] px-6 pb-20 pt-10">
      <Link href="/writing/" className="link-muted text-[12px] no-underline">
        ← 文章
      </Link>

      <header className="mt-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-text-faint">
          <time>{formatPostDate(post.date)}</time>
          {post.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>

        <h1 className="mt-4 text-balance font-serif text-[clamp(2rem,5vw,2.8rem)] font-semibold leading-[1.25] tracking-[-0.02em] text-text-primary">
          {post.title}
        </h1>

        {post.summary && (
          <p className="mt-4 text-[16px] leading-8 text-text-secondary">
            {post.summary}
          </p>
        )}
      </header>

      <div className="mt-10 border-t border-border-light pt-8">
        <PostBody content={post.content} />
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-border-light pt-6 text-[13px]">
        <Link href="/writing/" className="link-muted no-underline">
          ← 文章
        </Link>
        <Link href="/#projects" className="link-muted no-underline">
          项目
        </Link>
      </div>
    </article>
  )
}
