import type { Metadata } from 'next'

import { ContohHubPage } from '@/components/seo/contoh-hub-page'
import { buildPageMetadata } from '@/lib/seo/build-metadata'
import { PAGE_SEO } from '@/lib/seo-config'

export const metadata: Metadata = buildPageMetadata('contohHub')

const seo = PAGE_SEO.contohHub

export default function ContohHubRootPage() {
  return (
    <ContohHubPage
      title="Contoh surat resmi Indonesia"
      description={seo.description}
      intro="Pilih kategori untuk melihat panduan singkat dan contoh format. Setelah itu, buat versimu sendiri lewat generator Suratin."
      breadcrumbs={[
        { name: 'Beranda', path: '/' },
        { name: 'Contoh surat', path: '/contoh' },
      ]}
      links={[
        {
          href: '/contoh/lamaran-kerja',
          title: 'Lamaran kerja',
          description: 'Fresh graduate, berpengalaman, via email, tulis tangan, dan tanpa pengalaman.',
        },
        {
          href: '/contoh/resign',
          title: 'Resign / pengunduran diri',
          description: 'Resign baik-baik, via email, atau situasi mendadak dengan bahasa sopan.',
        },
        {
          href: '/contoh/izin',
          title: 'Izin tidak masuk',
          description: 'Kuliah, kerja sakit, dispensasi mahasiswa — format yang umum dipakai.',
        },
        {
          href: '/contoh/permohonan',
          title: 'Permohonan resmi',
          description: 'Beasiswa, keringanan cicilan, keringanan UKT, dan permohonan formal lainnya.',
        },
        {
          href: '/contoh/pengaduan',
          title: 'Pengaduan / komplain',
          description: 'PLN, BPJS, bank — susun fakta dan nomor referensi dengan jelas.',
        },
      ]}
    />
  )
}
