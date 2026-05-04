import type { MetadataRoute } from 'next'

import { getSiteDomain } from '@/lib/seo-config'

type ChangeFreq = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>

const ROUTES: { path: string; changeFrequency: ChangeFreq; priority: number }[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/buat-surat', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/buat-surat/lamaran-kerja', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/buat-surat/resign', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/buat-surat/izin', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/buat-surat/permohonan', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/buat-surat/pengaduan', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/contoh', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/contoh/lamaran-kerja', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/contoh/lamaran-kerja/fresh-graduate', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contoh/lamaran-kerja/pengalaman-kerja', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contoh/lamaran-kerja/via-email', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contoh/lamaran-kerja/tulis-tangan', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contoh/lamaran-kerja/tanpa-pengalaman', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contoh/resign', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/contoh/resign/baik-baik', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contoh/resign/via-email', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contoh/resign/mendadak', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/contoh/izin', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/contoh/izin/tidak-masuk-kuliah', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/contoh/izin/sakit-kerja', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contoh/izin/dispensasi-mahasiswa', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contoh/permohonan', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/contoh/permohonan/beasiswa', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/contoh/permohonan/keringanan-cicilan', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contoh/permohonan/keringanan-ukt', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contoh/pengaduan', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/contoh/pengaduan/pln', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/contoh/pengaduan/bpjs', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/contoh/pengaduan/bank', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/login', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/register', changeFrequency: 'monthly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteDomain()
  const lastModified = new Date()
  return ROUTES.map((route) => ({
    url: `${base}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
