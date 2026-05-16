export interface PostMeta {
  slug: string
  title: string
  date: string
  categories: string[]
}

export interface Post extends PostMeta {
  content: string
}
