import type { Metadata } from 'next'

import { ContohHubPage } from '@/components/seo/contoh-hub-page'
import { buildPageMetadata } from '@/lib/seo/build-metadata'
import { PAGE_SEO } from '@/lib/seo-config'

export const metadata: Metadata = buildPageMetadata('contohIzin', { ogType: 'article' })

const seo = PAGE_SEO.contohIzin

export default function ContohIzinHubPage() {
  return (
    <ContohHubPage
      title="Contoh surat izin"
      description={seo.description}
      breadcrumbs={[
        { name: 'Beranda', path: '/' },
        { name: 'Contoh surat', path: '/contoh' },
        { name: 'Izin', path: '/contoh/izin' },
      ]}
      links={[
        {
          href: '/contoh/izin/tidak-masuk-kuliah',
          title: 'Tidak masuk kuliah',
          description: 'Format ke dosen atau bagian akademik.',
        },
        {
          href: '/contoh/izin/sakit-kerja',
          title: 'Sakit kerja',
          description: 'Singkat, jujur, dan estimasi kembali kerja.',
        },
        {
          href: '/contoh/izin/dispensasi-mahasiswa',
          title: 'Dispensasi mahasiswa',
          description: 'Ujian, kegiatan, atau administrasi kampus.',
        },
      ]}
    />
  )
}
