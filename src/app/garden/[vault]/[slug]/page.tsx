import { notFound } from 'next/navigation'
import { listVaults, getNoteBySlug, getNoteSlugs, getBacklinks } from '@/lib/notes'
import NoteBody from '@/components/note-body'
import NoteCard from '@/components/note-card'
import Link from 'next/link'

export async function generateStaticParams() {
  const vaults = listVaults()
  const params: { vault: string; slug: string }[] = []

  for (const vault of vaults) {
    const slugs = getNoteSlugs(vault)
    for (const slug of slugs) {
      params.push({ vault, slug })
    }
  }

  return params
}

export async function generateMetadata({ params }: { params: Promise<{ vault: string; slug: string }> }) {
  const { vault, slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const note = getNoteBySlug(vault, slug)
  if (!note) return { title: 'Not Found' }
  return { title: `${note.title} | ${vault}` }
}

export default async function NotePage({ params }: { params: Promise<{ vault: string; slug: string }> }) {
  const { vault, slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const vaults = listVaults()
  if (!vaults.includes(vault)) notFound()

  const note = getNoteBySlug(vault, slug)
  if (!note) notFound()

  const backlinks = getBacklinks(vault, slug)

  const date = note.date
    ? new Date(note.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div>
      {/* breadcrumb */}
      <nav className="text-sm text-text-secondary mb-6">
        <Link href="/garden" className="hover:text-brand transition-colors no-underline text-text-secondary">
          Garden
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/garden/${encodeURIComponent(vault)}`}
          className="hover:text-brand transition-colors no-underline text-text-secondary"
        >
          {vault}
        </Link>
      </nav>

      <article className="bg-white rounded-xl p-8 sm:p-10 shadow-sm border border-[rgba(0,0,0,0.04)]">
        <header className="mb-8 pb-6 border-b border-border-light">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-dark leading-tight mb-3">
            {note.title}
          </h1>
          {note.tags.length > 0 && (
            <div className="flex gap-2 mt-3">
              {note.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-text-secondary px-2.5 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {date && (
            <time className="text-sm text-text-secondary block mt-2">{date}</time>
          )}
        </header>

        <NoteBody content={note.content} />
      </article>

      {/* backlinks */}
      {backlinks.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-text-dark mb-4">
            被引用自 ({backlinks.length})
          </h2>
          <div className="space-y-3">
            {backlinks.map(n => (
              <NoteCard key={n.slug} note={n} vault={vault} />
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
