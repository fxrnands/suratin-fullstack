import type { Metadata } from 'next'

import { ContohHubPage } from '@/components/seo/contoh-hub-page'
import { buildPageMetadata } from '@/lib/seo/build-metadata'
import { PAGE_SEO } from '@/lib/seo-config'

export const metadata: Metadata = buildPageMetadata('contohResign', { ogType: 'article' })

const seo = PAGE_SEO.contohResign

export default function ContohResignHubPage() {
  return (
    <ContohHubPage
      title="Contoh surat resign"
      description={seo.description}
      breadcrumbs={[
        { name: 'Beranda', path: '/' },
        { name: 'Contoh surat', path: '/contoh' },
        { name: 'Resign', path: '/contoh/resign' },
      ]}
      links={[
        {
          href: '/contoh/resign/baik-baik',
          title: 'Resign baik-baik',
          description: 'Bahasa positif, jelas, dan menjaga hubungan profesional.',
        },
        {
          href: '/contoh/resign/via-email',
          title: 'Resign via email',
          description: 'Subjek, isi singkat, dan lampiran PDF bila perlu.',
        },
        {
          href: '/contoh/resign/mendadak',
          title: 'Resign mendadak',
          description: 'Tetap sopan saat notice period terbatas.',
        },
      ]}
    />
  )
}
