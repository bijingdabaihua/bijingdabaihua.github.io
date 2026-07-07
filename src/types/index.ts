export interface PostMeta {
  slug: string
  title: string
  date: string
  categories: string[]
}

export interface Post extends PostMeta {
  content: string
}

// Note / Digital Garden types

export interface NoteMeta {
  slug: string
  title: string
  date: string
  tags: string[]
}

export interface Note extends NoteMeta {
  content: string
  links: string[] // slugs of linked notes
}

// ─── Book types ───

export type BookStatus = 'reading' | 'completed' | 'wishlist' | 'recommended'

export interface Book {
  // identity
  id: string

  // basic info (required)
  title: string
  authors: string[]

  // basic info (optional)
  subtitle?: string
  cover?: string
  publisher?: string
  publishYear?: number
  isbn?: string
  doubanId?: string
  pageCount?: number

  // reading status
  status: BookStatus
  rating?: number
  progress?: number
  currentPage?: number

  // timeline
  startDate?: string
  finishDate?: string
  addedAt: string

  // categorization
  categories?: string[]
  tags?: string[]

  // personal notes
  comment?: string
  quote?: string
  notesUrl?: string
  pdfUrl?: string
}
