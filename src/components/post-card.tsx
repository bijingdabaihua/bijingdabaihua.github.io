import Link from 'next/link'
import type { PostMeta } from '@/types'

export default function PostCard({ post }: { post: PostMeta }) {
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="bg-white rounded-xl p-6 sm:p-7 shadow-sm border border-[rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <time className="text-sm text-text-secondary block mb-1.5">{date}</time>
      <h3 className="mb-2">
        <Link
          href={`/posts/${post.slug}`}
          className="text-lg font-semibold text-text-primary no-underline hover:text-brand transition-colors"
        >
          {post.private && <span className="mr-1.5" title="Password protected">🔒</span>}
          {post.title}
        </Link>
      </h3>
      {post.private && (
        <span className="inline-block text-xs text-text-secondary bg-gray-100 px-2 py-0.5 rounded mt-1">
          Password protected
        </span>
      )}
    </article>
  )
}
