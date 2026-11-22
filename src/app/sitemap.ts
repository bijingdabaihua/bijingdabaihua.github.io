import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/constants'
import { getAllPosts } from '@/lib/posts'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  return [
    {
      url: `${siteConfig.url}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/writing/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...siteConfig.projects.map((project) => ({
      url: `${siteConfig.url}/projects/${project.slug}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: `${siteConfig.url}/writing/${post.slug}/`,
      lastModified: post.date ? new Date(post.date) : undefined,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
