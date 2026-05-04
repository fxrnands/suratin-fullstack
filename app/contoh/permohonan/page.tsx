import type { Metadata } from 'next'

import { ContohHubPage } from '@/components/seo/contoh-hub-page'
import { buildPageMetadata } from '@/lib/seo/build-metadata'
import { PAGE_SEO } from '@/lib/seo-config'

export const metadata: Metadata = buildPageMetadata('contohPermohonan', { ogType: 'article' })

const seo = PAGE_SEO.contohPermohonan

export default function ContohPermohonanHubPage() {
  return (
    <ContohHubPage
      title="Contoh surat permohonan"
      description={seo.description}
      breadcrumbs={[
        { name: 'Beranda', path: '/' },
        { name: 'Contoh surat', path: '/contoh' },
        { name: 'Permohonan', path: '/contoh/permohonan' },
      ]}
      links={[
        {
          href: '/contoh/permohonan/beasiswa',
          title: 'Beasiswa',
          description: 'Kebutuhan, prestasi, dan rencana studi dengan bahasa formal.',
        },
        {
          href: '/contoh/permohonan/keringanan-cicilan',
          title: 'Keringanan cicilan',
          description: 'Situasi keuangan dan skema yang realistis.',
        },
        {
          href: '/contoh/permohonan/keringanan-ukt',
          title: 'Keringanan UKT',
          description: 'Identitas mahasiswa, semester, dan permohonan ke kampus.',
        },
      ]}
    />
  )
}
