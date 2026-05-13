import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-white rounded-xl p-10 sm:p-16 shadow-sm border border-[rgba(0,0,0,0.04)] text-center max-w-lg mx-auto mt-12">
      <h1 className="text-6xl font-bold text-text-dark mb-4">404</h1>
      <p className="text-text-secondary mb-8">
        Page not found. The requested page could not be found.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-medium hover:opacity-90 transition no-underline"
      >
        Back to Home
      </Link>
    </div>
  )
}
