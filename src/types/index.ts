export interface PostMeta {
  slug: string
  title: string
  date: string
  categories: string[]
  private: boolean
}

export interface Post extends PostMeta {
  content: string
}
