'use client'

import { useState, useMemo } from 'react'
import type { Book, BookStatus } from '@/types'
import BookFilter from './book-filter'
import BookCard from './book-card'

type FilterStatus = BookStatus | 'all'

function filterBooks(books: Book[], status: FilterStatus, query: string): Book[] {
  let result = books
  if (status !== 'all') {
    result = result.filter(b => b.status === status)
  }
  const q = query.trim().toLowerCase()
  if (q) {
    result = result.filter(
      b =>
        b.title.toLowerCase().includes(q) ||
        b.authors.some(a => a.toLowerCase().includes(q)) ||
        b.categories?.some(c => c.toLowerCase().includes(q)) ||
        b.tags?.some(t => t.toLowerCase().includes(q)) ||
        b.comment?.toLowerCase().includes(q)
    )
  }
  return result
}

interface BooksClientProps {
  books: Book[]
}

export default function BooksClient({ books }: BooksClientProps) {
  const [status, setStatus] = useState<FilterStatus>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => filterBooks(books, status, query), [books, status, query])

  const counts = useMemo(() => {
    const c: Record<FilterStatus, number> = {
      all: books.length,
      reading: 0,
      completed: 0,
      recommended: 0,
      wishlist: 0,
    }
    for (const b of books) {
      c[b.status] = (c[b.status] || 0) + 1
    }
    return c
  }, [books])

  return (
    <div>
      <BookFilter
        counts={counts}
        onFilterChange={(s, q) => {
          setStatus(s)
          setQuery(q)
        }}
      />
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-text-secondary">没有找到匹配的书籍。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}
