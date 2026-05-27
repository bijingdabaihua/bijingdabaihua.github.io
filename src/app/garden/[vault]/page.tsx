import { notFound } from 'next/navigation'
import { listVaults, getAllNotes } from '@/lib/notes'
import NoteCard from '@/components/note-card'

export async function generateStaticParams() {
  const vaults = listVaults()
  return vaults.map(vault => ({ vault }))
}

export async function generateMetadata({ params }: { params: Promise<{ vault: string }> }) {
  const { vault } = await params
  return { title: `Garden / ${vault}` }
}

export default async function VaultPage({ params }: { params: Promise<{ vault: string }> }) {
  const { vault } = await params
  const vaults = listVaults()
  if (!vaults.includes(vault)) notFound()

  const notes = getAllNotes(vault)

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-dark mb-1">
        {vault}
      </h1>
      <p className="text-text-secondary text-sm mb-8">
        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
      </p>

      {notes.length === 0 ? (
        <div className="bg-white rounded-xl p-10 shadow-sm border border-[rgba(0,0,0,0.04)] text-center">
          <p className="text-text-secondary">这个知识库还没有笔记。</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {notes.map(note => (
              <NoteCard key={note.slug} note={note} vault={vault} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
