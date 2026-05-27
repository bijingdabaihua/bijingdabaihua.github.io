import { listVaults, getAllNotes } from '@/lib/notes'
import Link from 'next/link'

export const metadata = {
  title: 'Garden',
}

export default function GardenPage() {
  const vaults = listVaults()

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-dark mb-2 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-1 after:bg-brand after:rounded">
        数字花园
      </h1>
      <p className="text-text-secondary text-sm mb-8">
        Obsidian 知识库集合
      </p>

      {vaults.length === 0 ? (
        <div className="bg-white rounded-xl p-10 shadow-sm border border-[rgba(0,0,0,0.04)] text-center">
          <p className="text-text-secondary">还没有创建任何知识库。</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {vaults.map(vault => {
            const notes = getAllNotes(vault)
            return (
              <Link
                key={vault}
                href={`/garden/${encodeURIComponent(vault)}`}
                className="bg-white rounded-xl shadow-sm border border-[rgba(0,0,0,0.04)] no-underline transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-text-dark mb-1">{vault}</h2>
                  <p className="text-sm text-text-secondary">
                    {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
