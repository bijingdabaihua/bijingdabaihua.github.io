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

// ─── Book types ───

export type BookStatus = 'reading' | 'completed' | 'wishlist' | 'recommended'

// ─── Resume types ───

export interface ResumePersonalInfo {
  name: string
  title: string
  email: string
  phone?: string
  location?: string
  website?: string
  github?: string
  linkedin?: string
}

export interface ResumeSkillCategory {
  category: string
  items: string[]
}

export interface ResumeExperience {
  company: string
  position: string
  startDate: string
  endDate?: string
  highlights: string[]
}

export interface ResumeEducation {
  school: string
  degree: string
  major?: string
  startDate: string
  endDate?: string
}

export interface ResumeProject {
  name: string
  description: string
  tech: string[]
  url?: string
}

export interface ResumeData {
  personalInfo: ResumePersonalInfo
  summary: string
  skills: ResumeSkillCategory[]
  experience: ResumeExperience[]
  education: ResumeEducation[]
  projects: ResumeProject[]
}

// ─── Book types ───

export interface Book {
  // identity
  id: string

  // basic info (required)
  title: string
  authors: string[]

  // basic info (optional)
  subtitle?: string
  cover?: string
  publisher?: string
  publishYear?: number
  isbn?: string
  doubanId?: string
  pageCount?: number

  // reading status
  status: BookStatus
  rating?: number
  progress?: number
  currentPage?: number

  // timeline
  startDate?: string
  finishDate?: string
  addedAt: string

  // categorization
  categories?: string[]
  tags?: string[]

  // personal notes
  comment?: string
  quote?: string
  notesUrl?: string
  pdfUrl?: string
}
