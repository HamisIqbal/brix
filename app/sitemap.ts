import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
import { projects } from '@/content/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const routes = ['', '/work', '/services', '/about', '/contact'].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const details = projects.map((p) => ({
    url: `${site.url}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  return [...routes, ...details]
}
