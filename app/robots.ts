import type { MetadataRoute } from 'next'

import { getSiteDomain } from '@/lib/seo-config'

export default function robots(): MetadataRoute.Robots {
  const base = getSiteDomain()
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/api/', '/surat-saya'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: new URL(base).host,
  }
}
