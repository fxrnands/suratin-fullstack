import type { PlanId, PricingFeature } from '@/components/landing/data'

export interface SerializedHero {
  badge: string
  subtitle: string
  footnote: string
  primaryCta: string
}

export interface SerializedIconTextItem {
  iconKey: string
  title: string
  description: string
}

export interface SerializedLetterCatalogItem {
  iconKey: string
  title: string
  description: string
}

export interface SerializedStepNumbered {
  variant: 'numbered'
  num: string
  title: string
  description: string
}

export interface SerializedStepIcon {
  variant: 'icon'
  iconKey: string
  title: string
  description: string
}

export type SerializedStepRow = SerializedStepNumbered | SerializedStepIcon

export interface SerializedPricingPlan {
  id: PlanId
  name: string
  price: string
  period: string
  iconKey: string
  popularBadge?: string
  features: PricingFeature[]
  ctaLabel: string
  ctaPrimary: boolean
}

export interface SerializedHomeBundle {
  hero: SerializedHero
  problem_items: SerializedIconTextItem[]
  simple_steps: SerializedStepNumbered[]
  letter_types: SerializedLetterCatalogItem[]
  benefit_items: SerializedIconTextItem[]
  how_it_works_steps: SerializedStepIcon[]
  pricing_plans: SerializedPricingPlan[]
}

export const MARKETING_SECTION_KEYS = [
  'hero',
  'problem_items',
  'simple_steps',
  'letter_types',
  'benefit_items',
  'how_it_works_steps',
  'pricing_plans',
] as const

export type MarketingSectionKey = (typeof MARKETING_SECTION_KEYS)[number]

/** JSON-friendly defaults (icons as `iconKey` for DB + hydration). */
export const DEFAULT_SERIALIZED_HOME: SerializedHomeBundle = {
  hero: {
    badge: '🎉 Dipercaya oleh ribuan pengguna di Indonesia',
    subtitle:
      'Buat surat lamaran, resign, izin, dan pengaduan resmi tanpa bingung format. Cukup isi, AI yang susun.',
    footnote: 'Digunakan oleh mahasiswa, fresh graduate, dan pekerja di Indonesia',
    primaryCta: 'Buat Surat Sekarang',
  },
  problem_items: [
    {
      iconKey: 'AlertCircle',
      title: 'Tidak tahu format surat formal',
      description: 'Bingung dengan struktur dan tata cara penulisan',
    },
    {
      iconKey: 'FileText',
      title: 'Takut salah bahasa',
      description: 'Khawatir menggunakan ejaan dan tata bahasa yang tidak tepat',
    },
    {
      iconKey: 'Clock',
      title: 'Bingung dengan struktur',
      description: 'Tidak tahu bagaimana membuka dan menutup surat yang baik',
    },
    {
      iconKey: 'Zap',
      title: 'Butuh cepat tapi profesional',
      description: 'Surat penting tidak boleh asal-asalan',
    },
  ],
  simple_steps: [
    {
      variant: 'numbered',
      num: '1',
      title: 'Pilih jenis surat',
      description: 'Lamaran, resign, izin, atau pengaduan',
    },
    {
      variant: 'numbered',
      num: '2',
      title: 'Isi data singkat',
      description: 'Jawab beberapa pertanyaan sederhana tentang data Anda',
    },
    {
      variant: 'numbered',
      num: '3',
      title: 'Download surat siap pakai',
      description: 'Surat PDF profesional langsung bisa digunakan',
    },
  ],
  letter_types: [
    {
      iconKey: 'Briefcase',
      title: 'Surat Lamaran Kerja',
      description: 'Untuk melamar pekerjaan impian Anda',
    },
    {
      iconKey: 'LogOut',
      title: 'Surat Resign',
      description: 'Mengundurkan diri dengan profesional',
    },
    {
      iconKey: 'CalendarCheck',
      title: 'Surat Izin',
      description: 'Izin & dispensasi dari institusi',
    },
    {
      iconKey: 'AlertTriangle',
      title: 'Surat Pengaduan',
      description: 'Laporkan masalah dengan formal',
    },
  ],
  benefit_items: [
    {
      iconKey: 'FileCheck',
      title: 'Format sudah sesuai standar',
      description: 'Sudah sesuai dengan standar formal Indonesia yang berlaku',
    },
    {
      iconKey: 'Lock',
      title: 'Tidak perlu mikir struktur',
      description: 'AI kami mengurus semua detail penulisan untuk Anda',
    },
    {
      iconKey: 'Download',
      title: 'Langsung bisa dipakai',
      description: 'Surat PDF siap cetak tanpa perlu edit tambahan',
    },
    {
      iconKey: 'Zap',
      title: 'Hemat waktu',
      description: 'Apa yang biasanya butuh 1 jam, sekarang cukup 1 menit',
    },
  ],
  how_it_works_steps: [
    {
      variant: 'icon',
      iconKey: 'ClipboardList',
      title: 'Jawab pertanyaan singkat',
      description:
        'Pilih jenis surat, lalu lengkapi data penting seperti identitas dan tujuan—tanpa harus menyusun paragraf dari nol.',
    },
    {
      variant: 'icon',
      iconKey: 'Sparkles',
      title: 'Disusun mengikuti format formal',
      description:
        'Kop surat, pembuka, isi, dan penutup disusun mengikuti pola surat resmi yang lazim dipakai di Indonesia.',
    },
    {
      variant: 'icon',
      iconKey: 'Download',
      title: 'Unduh sebagai PDF',
      description:
        'Terima berkas siap cetak atau siap dikirim. Periksa sekali lagi, lalu gunakan seperti surat pada umumnya.',
    },
  ],
  pricing_plans: [
    {
      id: 'free',
      name: 'Gratis',
      price: 'Rp 0',
      period: '/selamanya',
      iconKey: 'Gift',
      features: [
        { label: '2 surat / bulan', included: true },
        { label: 'Tanpa watermark', included: true },
        { label: 'Edit tone', included: false },
      ],
      ctaLabel: 'Mulai Gratis',
      ctaPrimary: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'Rp 19.000',
      period: '/bulan',
      iconKey: 'Crown',
      popularBadge: 'Terpopuler',
      features: [
        { label: 'Unlimited surat', included: true },
        { label: 'Tanpa watermark', included: true },
        { label: 'Edit tone (formal, tegas, persuasif)', included: true },
        { label: 'Riwayat surat', included: true },
      ],
      ctaLabel: 'Langganan Sekarang',
      ctaPrimary: true,
    },
    {
      id: 'pay',
      name: 'Bayar Per Surat',
      price: 'Rp 4.999',
      period: '/surat',
      iconKey: 'ShoppingCart',
      features: [
        { label: 'Bayar sesuai kebutuhan', included: true },
        { label: 'Tanpa komitmen', included: true },
        { label: 'Akses semua fitur', included: true },
        { label: 'Riwayat surat', included: false },
      ],
      ctaLabel: 'Mulai Bayar Per Surat',
      ctaPrimary: false,
    },
  ],
}
