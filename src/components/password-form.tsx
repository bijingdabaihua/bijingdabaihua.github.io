'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function PasswordForm({ slug }: { slug: string }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/verify-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.refresh()
    } else {
      setError('Incorrect password')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[rgba(0,0,0,0.04)] p-10 max-w-md mx-auto mt-12 text-center">
      <div className="text-4xl mb-4">🔒</div>
      <h2 className="text-xl font-bold text-text-dark mb-2">Protected Content</h2>
      <p className="text-sm text-text-secondary mb-6">
        This post is password protected. Please enter the password to view it.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full px-4 py-2.5 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
          autoFocus
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 bg-brand text-white rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Unlock'}
        </button>
      </form>
    </div>
  )
}
