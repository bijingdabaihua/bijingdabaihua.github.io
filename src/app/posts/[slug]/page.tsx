import { notFound } from 'next/navigation'
import { getPostBySlug, getAllSlugs } from '@/lib/posts'
import { isAuthenticated } from '@/lib/auth'
import PostBody from '@/components/post-body'
import PasswordForm from '@/components/password-form'
import { siteConfig } from '@/lib/constants'

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Not Found' }
  return { title: post.title }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const authenticated = post.private ? await isAuthenticated() : true

  return (
    <article className="max-w-[860px] mx-auto">
      <header className="mb-8 pb-6 border-b border-border-light">
        {post.private && (
          <span className="inline-block mb-3 text-sm text-text-secondary" title="Password protected">🔒 Protected</span>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold text-text-dark leading-tight mb-3">
          {post.title}
        </h1>
        <time className="text-sm text-text-secondary">{date}</time>
        {post.categories.length > 0 && (
          <div className="flex gap-2 mt-3">
            {post.categories.map(cat => (
              <span key={cat} className="text-xs bg-gray-100 text-text-secondary px-2.5 py-0.5 rounded">
                {cat}
              </span>
            ))}
          </div>
        )}
      </header>

      {authenticated ? (
        <PostBody content={post.content} />
      ) : (
        <PasswordForm slug={slug} />
      )}
    </article>
  )
}
