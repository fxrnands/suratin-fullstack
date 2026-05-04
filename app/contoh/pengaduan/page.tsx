import type { Metadata } from 'next'

import { ContohHubPage } from '@/components/seo/contoh-hub-page'
import { buildPageMetadata } from '@/lib/seo/build-metadata'
import { PAGE_SEO } from '@/lib/seo-config'

export const metadata: Metadata = buildPageMetadata('contohPengaduan', { ogType: 'article' })

const seo = PAGE_SEO.contohPengaduan

export default function ContohPengaduanHubPage() {
  return (
    <ContohHubPage
      title="Contoh surat pengaduan"
      description={seo.description}
      breadcrumbs={[
        { name: 'Beranda', path: '/' },
        { name: 'Contoh surat', path: '/contoh' },
        { name: 'Pengaduan', path: '/contoh/pengaduan' },
      ]}
      links={[
        {
          href: '/contoh/pengaduan/pln',
          title: 'PLN',
          description: 'ID pelanggan, periode tagihan, dan kronologi gangguan.',
        },
        {
          href: '/contoh/pengaduan/bpjs',
          title: 'BPJS Kesehatan',
          description: 'Nomor kartu, kronologi klaim, dan permintaan penjelasan.',
        },
        {
          href: '/contoh/pengaduan/bank',
          title: 'Bank',
          description: 'Rekening, referensi transaksi, dan tuntutan penyelesaian.',
        },
      ]}
    />
  )
}
