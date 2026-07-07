import fs from 'fs'
import path from 'path'
import type { Book, BookStatus } from '@/types'

const BOOKS_DATA_PATH = path.join(process.cwd(), 'data', 'books.json')

// ─── Status priority for sorting ───
// lower number = higher priority (appears first)
const STATUS_PRIORITY: Record<BookStatus, number> = {
  reading: 0,
  completed: 1,
  recommended: 2,
  wishlist: 3,
}

// ─── Internal helpers ───

function readBooksData(): Book[] {
  if (!fs.existsSync(BOOKS_DATA_PATH)) return []

  try {
    const raw = fs.readFileSync(BOOKS_DATA_PATH, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed.books) ? parsed.books : []
  } catch {
    return []
  }
}

function sortBooks(books: Book[]): Book[] {
  return [...books].sort((a, b) => {
    const pa = STATUS_PRIORITY[a.status]
    const pb = STATUS_PRIORITY[b.status]

    if (pa !== pb) return pa - pb

    // same status: use tie-breakers
    switch (a.status) {
      case 'reading':
        // reading: higher progress first
        return (b.progress || 0) - (a.progress || 0)

      case 'completed':
        // completed: later finish date first
        return (b.finishDate || '').localeCompare(a.finishDate || '')

      case 'recommended':
        // recommended: higher rating first
        return (b.rating || 0) - (a.rating || 0)

      case 'wishlist':
        // wishlist: earlier addedAt first
        return (a.addedAt || '').localeCompare(b.addedAt || '')

      default:
        return 0
    }
  })
}

// ─── Public API ───

export function getAllBooks(): Book[] {
  return sortBooks(readBooksData())
}

export function getSortedBooks(): Book[] {
  return getAllBooks()
}

export function getBooksByStatus(status: BookStatus): Book[] {
  return sortBooks(readBooksData().filter(b => b.status === status))
}

export function getBooksByCategory(category: string): Book[] {
  return sortBooks(
    readBooksData().filter(
      b => b.categories?.some(c => c.toLowerCase() === category.toLowerCase())
    )
  )
}

export function getBooksByTag(tag: string): Book[] {
  return sortBooks(
    readBooksData().filter(
      b => b.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
    )
  )
}

export function searchBooks(query: string): Book[] {
  const q = query.trim().toLowerCase()
  if (!q) return getAllBooks()

  return sortBooks(
    readBooksData().filter(b => {
      return (
        b.title.toLowerCase().includes(q) ||
        b.authors.some(a => a.toLowerCase().includes(q)) ||
        b.subtitle?.toLowerCase().includes(q) ||
        b.publisher?.toLowerCase().includes(q) ||
        b.comment?.toLowerCase().includes(q) ||
        b.categories?.some(c => c.toLowerCase().includes(q)) ||
        b.tags?.some(t => t.toLowerCase().includes(q))
      )
    })
  )
}

export function getBookById(id: string): Book | null {
  return readBooksData().find(b => b.id === id) || null
}

export function getAllCategories(): string[] {
  const cats = new Set<string>()
  for (const book of readBooksData()) {
    book.categories?.forEach(c => cats.add(c))
  }
  return Array.from(cats).sort()
}

export function getAllTags(): string[] {
  const tags = new Set<string>()
  for (const book of readBooksData()) {
    book.tags?.forEach(t => tags.add(t))
  }
  return Array.from(tags).sort()
}

export function getStatusCounts(): Record<BookStatus, number> {
  const counts: Record<BookStatus, number> = {
    reading: 0,
    completed: 0,
    recommended: 0,
    wishlist: 0,
  }
  for (const book of readBooksData()) {
    counts[book.status]++
  }
  return counts
}
