import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Note, NoteMeta } from '@/types'

const OBSIDIAN_DIR = path.join(process.cwd(), 'obsidian')

const WIKI_LINK_RE = /\[\[([^\]|]+)(?:\|([^\]|]+))?\]\]/g

const VAULT_IGNORE = new Set(['.obsidian'])

// ─── Vault listing ───

export function listVaults(): string[] {
  if (!fs.existsSync(OBSIDIAN_DIR)) return []

  return fs.readdirSync(OBSIDIAN_DIR).filter(entry => {
    const full = path.join(OBSIDIAN_DIR, entry)
    if (entry.startsWith('.') || VAULT_IGNORE.has(entry)) return false
    if (!fs.statSync(full).isDirectory()) return false
    // must contain at least one .md file
    const entries = fs.readdirSync(full)
    return entries.some(e => e.endsWith('.md'))
  })
}

function vaultDir(vault: string): string {
  return path.join(OBSIDIAN_DIR, vault)
}

// ─── Helpers ───

function extractWikiLinks(content: string): string[] {
  const slugs = new Set<string>()
  let match: RegExpExecArray | null
  while ((match = WIKI_LINK_RE.exec(content)) !== null) {
    slugs.add(match[1].trim().toLowerCase().replace(/\s+/g, '-'))
  }
  return Array.from(slugs)
}

export function convertWikiLinks(content: string, _existingSlugs: Set<string>): string {
  return content.replace(WIKI_LINK_RE, (_, slug: string, text?: string) => {
    const normalizedSlug = slug.trim().toLowerCase().replace(/\s+/g, '-')
    const display = text?.trim() || slug.trim()
    return `[${display}](${normalizedSlug})`
  })
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '').normalize('NFC')
}

function parseNoteFile(vault: string, file: string): { slug: string; data: Record<string, unknown>; content: string } | null {
  const filepath = path.join(vaultDir(vault), file)
  if (!fs.existsSync(filepath)) return null
  const raw = fs.readFileSync(filepath, 'utf-8').trim()
  if (!raw) return null
  const { data, content } = matter(raw)
  const slug = slugFromFilename(file)
  return { slug, data, content }
}

function noteFiles(vault: string): string[] {
  const dir = vaultDir(vault)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(f => {
    if (!f.endsWith('.md')) return false
    const stats = fs.statSync(path.join(dir, f))
    return stats.size > 0
  })
}

// ─── Public API ───

export function getAllNotes(vault: string): NoteMeta[] {
  const files = noteFiles(vault)
  const notes: NoteMeta[] = []

  for (const file of files) {
    const parsed = parseNoteFile(vault, file)
    if (!parsed) continue
    notes.push({
      slug: parsed.slug,
      title: (parsed.data.title as string) || parsed.slug,
      date: parsed.data.date ? new Date(parsed.data.date as string).toISOString() : '',
      tags: (parsed.data.tags as string[]) || [],
    })
  }

  return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getNoteBySlug(vault: string, slug: string): Note | null {
  const normalizedSlug = slug.normalize('NFC')
  const files = noteFiles(vault)
  const file = files.find(f => slugFromFilename(f) === normalizedSlug)
  if (!file) return null

  const parsed = parseNoteFile(vault, file)
  if (!parsed) return null

  const links = extractWikiLinks(parsed.content)
  const allSlugs = new Set(files.map(slugFromFilename))

  return {
    slug: parsed.slug,
    title: (parsed.data.title as string) || parsed.slug,
    date: parsed.data.date ? new Date(parsed.data.date as string).toISOString() : '',
    tags: (parsed.data.tags as string[]) || [],
    content: convertWikiLinks(parsed.content, allSlugs),
    links: links.filter(l => allSlugs.has(l)),
  }
}

export function getBacklinks(vault: string, slug: string): NoteMeta[] {
  const normalizedSlug = slug.normalize('NFC')
  const files = noteFiles(vault)
  const linking: NoteMeta[] = []

  for (const file of files) {
    const parsed = parseNoteFile(vault, file)
    if (!parsed || slugFromFilename(file) === normalizedSlug) continue

    const links = extractWikiLinks(parsed.content)
    if (links.includes(normalizedSlug)) {
      linking.push({
        slug: parsed.slug,
        title: (parsed.data.title as string) || parsed.slug,
        date: parsed.data.date ? new Date(parsed.data.date as string).toISOString() : '',
        tags: (parsed.data.tags as string[]) || [],
      })
    }
  }

  return linking
}

export function getNoteSlugs(vault: string): string[] {
  return noteFiles(vault).map(slugFromFilename)
}

