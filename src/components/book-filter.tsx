'use client'

import { useState } from 'react'
import type { BookStatus } from '@/types'

type FilterStatus = BookStatus | 'all'

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'reading', label: '正在阅读' },
  { value: 'completed', label: '已读完' },
  { value: 'recommended', label: '推荐' },
  { value: 'wishlist', label: '想读' },
]

interface BookFilterProps {
  counts: Record<FilterStatus, number>
  onFilterChange: (status: FilterStatus, query: string) => void
}

export default function BookFilter({ counts, onFilterChange }: BookFilterProps) {
  const [activeStatus, setActiveStatus] = useState<FilterStatus>('all')
  const [query, setQuery] = useState('')

  const handleStatusClick = (status: FilterStatus) => {
    setActiveStatus(status)
    onFilterChange(status, query)
  }

  const handleQueryChange = (value: string) => {
    setQuery(value)
    onFilterChange(activeStatus, value)
  }

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleStatusClick(option.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeStatus === option.value
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-white text-text-secondary hover:text-brand hover:bg-brand/5 border border-border-light'
              }`}
            >
              {option.label}
              <span className={`ml-1 text-xs ${activeStatus === option.value ? 'text-white/80' : 'text-text-secondary/60'}`}>
                {counts[option.value] || 0}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="搜索书名、作者..."
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            className="w-full sm:w-52 pl-8 pr-8 py-1.5 text-sm rounded-full border border-border-light bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all"
          />
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/40 hover:text-text-secondary"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
