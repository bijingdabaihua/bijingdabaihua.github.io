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
