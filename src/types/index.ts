export interface Project {
  slug: string
  name: string
  description: string
  body: string[]
  url: string
  demo?: string
  cover?: string
  tech: string[]
  highlights?: string[]
  post?: string
}

export interface PostMeta {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
}

export interface Post extends PostMeta {
  content: string
}
