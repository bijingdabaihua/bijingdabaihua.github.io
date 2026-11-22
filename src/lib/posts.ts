import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { Post, PostMeta } from '@/types'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value ?? '').slice(0, 10)
}

function readPost(filename: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8')
  const { data, content } = matter(raw)
  const slug = slugFromFilename(filename)

  return {
    slug,
    title: String(data.title || slug),
    date: toDateString(data.date),
    summary: String(data.summary || ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    content,
  }
}

function toMeta(post: Post): PostMeta {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    summary: post.summary,
    tags: post.tags,
  }
}

export function formatPostDate(date: string): string {
  return date ? date.replaceAll('-', '.') : ''
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter((filename) => filename.endsWith('.md'))
    .map(readPost)
    .map(toMeta)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPost(slug: string): Post | null {
  if (!fs.existsSync(POSTS_DIR)) return null

  const filename = fs
    .readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith('.md'))
    .find((name) => slugFromFilename(name) === slug)

  return filename ? readPost(filename) : null
}
