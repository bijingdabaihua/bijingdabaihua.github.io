import Link from 'next/link'
import type { NoteMeta } from '@/types'

export default function NoteCard({
  note,
  vault,
}: {
  note: NoteMeta
  vault: string
}) {
  const date = note.date
    ? new Date(note.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <article className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-[rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      {date && <time className="text-sm text-text-secondary block mb-1">{date}</time>}
      <h3 className="mb-2">
        <Link
          href={`/garden/${vault}/${encodeURIComponent(note.slug)}`}
          className="text-lg font-semibold text-text-primary no-underline hover:text-brand transition-colors"
        >
          {note.title}
        </Link>
      </h3>
      {note.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mt-2">
          {note.tags.map(tag => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-text-secondary px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
