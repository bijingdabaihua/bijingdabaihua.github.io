import type { Book, BookStatus } from '@/types'

const STATUS_CONFIG: Record<BookStatus, { label: string; bg: string; text: string }> = {
  reading: { label: '正在阅读', bg: 'bg-brand', text: 'text-white' },
  completed: { label: '已读完', bg: 'bg-[#28a745]', text: 'text-white' },
  recommended: { label: '推荐', bg: 'bg-[#ffc107]', text: 'text-text-dark' },
  wishlist: { label: '想读', bg: 'bg-text-secondary', text: 'text-white' },
}

function StarRating({ rating }: { rating?: number }) {
  if (rating === undefined) return null
  const rounded = Math.round(rating)
  return (
    <div className="flex items-center gap-1">
      <span className="text-amber-400 text-sm tracking-tight">
        {'★'.repeat(rounded)}{'☆'.repeat(5 - rounded)}
      </span>
      <span className="text-xs text-text-secondary">{rating}</span>
    </div>
  )
}

function ProgressBar({ progress }: { progress?: number }) {
  if (progress === undefined) return null
  const pct = Math.min(100, Math.max(0, progress))
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-text-secondary">阅读进度</span>
        <span className="text-xs font-medium text-brand">{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function BookCover({ cover, title }: { cover?: string; title: string }) {
  if (cover) {
    return (
      <img
        src={cover}
        alt={title}
        className="w-[100px] aspect-[2/3] rounded-lg object-cover shadow-sm flex-shrink-0"
        loading="lazy"
      />
    )
  }
  return (
    <div className="w-[100px] aspect-[2/3] rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
      <span className="text-3xl">📖</span>
    </div>
  )
}

export default function BookCard({ book }: { book: Book }) {
  const status = STATUS_CONFIG[book.status]

  return (
    <article className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-[rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        <BookCover cover={book.cover} title={book.title} />

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base sm:text-lg font-semibold text-text-dark leading-snug">
              {book.title}
            </h3>
            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>

          {book.subtitle && (
            <p className="text-xs text-text-secondary mb-1 truncate">{book.subtitle}</p>
          )}

          <p className="text-sm text-text-secondary mb-2">
            {book.authors.join(', ')}
          </p>

          <StarRating rating={book.rating} />

          {book.status === 'reading' && book.progress !== undefined && (
            <div className="mt-2">
              <ProgressBar progress={book.progress} />
              {book.currentPage !== undefined && book.pageCount && (
                <p className="text-xs text-text-secondary mt-1.5">
                  读到第 {book.currentPage} 页 / 共 {book.pageCount} 页
                </p>
              )}
            </div>
          )}

          {book.status === 'completed' && book.finishDate && (
            <p className="text-xs text-text-secondary mt-2">
              读完于 {book.finishDate}
            </p>
          )}

          {book.status === 'recommended' && book.quote && (
            <blockquote className="text-sm text-text-secondary italic border-l-2 border-brand/30 pl-3 mt-2 bg-brand/[0.02] py-1.5 rounded-r">
              &ldquo;{book.quote}&rdquo;
            </blockquote>
          )}

          {book.categories && book.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
              {book.categories.map(cat => (
                <span key={cat} className="text-xs px-2 py-0.5 bg-brand/5 text-brand rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          )}

          {book.pdfUrl && (
            <a
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand/80 font-medium transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {book.pdfUrl.startsWith('http') ? '在线阅读' : '阅读 PDF'}
            </a>
          )}

          {book.comment && (
            <p className="text-sm text-text-secondary mt-2 leading-relaxed line-clamp-2">
              {book.comment}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
