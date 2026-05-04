import type { Metadata } from 'next'

import { ContohHubPage } from '@/components/seo/contoh-hub-page'
import { buildPageMetadata } from '@/lib/seo/build-metadata'
import { PAGE_SEO } from '@/lib/seo-config'

export const metadata: Metadata = buildPageMetadata('contohLamaran', { ogType: 'article' })

const seo = PAGE_SEO.contohLamaran

export default function ContohLamaranHubPage() {
  return (
    <ContohHubPage
      title="Contoh surat lamaran kerja"
      description={seo.description}
      breadcrumbs={[
        { name: 'Beranda', path: '/' },
        { name: 'Contoh surat', path: '/contoh' },
        { name: 'Lamaran kerja', path: '/contoh/lamaran-kerja' },
      ]}
      links={[
        {
          href: '/contoh/lamaran-kerja/fresh-graduate',
          title: 'Fresh graduate',
          description: 'Tonjolkan pendidikan, organisasi, dan proyek bila belum berpengalaman kerja.',
        },
        {
          href: '/contoh/lamaran-kerja/pengalaman-kerja',
          title: 'Dengan pengalaman kerja',
          description: 'Pencapaian terukur dan relevansi dengan posisi baru.',
        },
        {
          href: '/contoh/lamaran-kerja/via-email',
          title: 'Via email',
          description: 'Subjek, isi email, dan lampiran yang rapi.',
        },
        {
          href: '/contoh/lamaran-kerja/tulis-tangan',
          title: 'Tulis tangan',
          description: 'Struktur dan bagian wajib agar tetap formal.',
        },
        {
          href: '/contoh/lamaran-kerja/tanpa-pengalaman',
          title: 'Tanpa pengalaman',
          description: 'Fokus soft skill, magang, dan semangat belajar.',
        },
      ]}
    />
  )
}
