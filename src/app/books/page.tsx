import { getSortedBooks } from '@/lib/books'
import BooksClient from '@/components/books-client'

export const metadata = {
  title: 'Bookshelf',
}

export default function BooksPage() {
  const books = getSortedBooks()

  return (
    <div className="pt-4">
      <h1 className="text-2xl font-bold text-text-dark mb-2">📚 My Bookshelf</h1>
      <p className="text-text-secondary text-sm mb-8">记录阅读，分享感悟。</p>

      <BooksClient books={books} />
    </div>
  )
}
