import type { LucideIcon } from 'lucide-react'
import {
  AlertCircle,
  AlertTriangle,
  Briefcase,
  CalendarCheck,
  ClipboardList,
  Clock,
  Crown,
  Download,
  FileCheck,
  FileText,
  Gift,
  Lock,
  LogOut,
  ShoppingCart,
  Sparkles,
  Zap,
} from 'lucide-react'

import type { StepRowEntry } from '@/components/landing/step-row'

export interface IconTextItem {
  icon: LucideIcon
  title: string
  description: string
}

export interface LetterTypeItem {
  icon: LucideIcon
  title: string
  description: string
}

export type PlanId = 'free' | 'pro' | 'pay'

export interface PricingFeature {
  label: string
  included: boolean
}

export interface PricingPlanDefinition {
  id: PlanId
  name: string
  price: string
  period: string
  icon: LucideIcon
  popularBadge?: string
  features: PricingFeature[]
  ctaLabel: string
  ctaPrimary: boolean
}

export const PROBLEM_ITEMS: IconTextItem[] = [
  {
    icon: AlertCircle,
    title: 'Tidak tahu format surat formal',
    description: 'Bingung dengan struktur dan tata cara penulisan',
  },
  {
    icon: FileText,
    title: 'Takut salah bahasa',
    description: 'Khawatir menggunakan ejaan dan tata bahasa yang tidak tepat',
  },
  {
    icon: Clock,
    title: 'Bingung dengan struktur',
    description: 'Tidak tahu bagaimana membuka dan menutup surat yang baik',
  },
  {
    icon: Zap,
    title: 'Butuh cepat tapi profesional',
    description: 'Surat penting tidak boleh asal-asalan',
  },
]

export const SIMPLE_STEPS: StepRowEntry[] = [
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
]

export const LETTER_TYPES: LetterTypeItem[] = [
  { icon: Briefcase, title: 'Surat Lamaran Kerja', description: 'Untuk melamar pekerjaan impian Anda' },
  { icon: LogOut, title: 'Surat Resign', description: 'Mengundurkan diri dengan profesional' },
  { icon: CalendarCheck, title: 'Surat Izin', description: 'Izin & dispensasi dari institusi' },
  { icon: AlertTriangle, title: 'Surat Pengaduan', description: 'Laporkan masalah dengan formal' },
]

export const BENEFIT_ITEMS: IconTextItem[] = [
  {
    icon: FileCheck,
    title: 'Format sudah sesuai standar',
    description: 'Sudah sesuai dengan standar formal Indonesia yang berlaku',
  },
  {
    icon: Lock,
    title: 'Tidak perlu mikir struktur',
    description: 'AI kami mengurus semua detail penulisan untuk Anda',
  },
  {
    icon: Download,
    title: 'Langsung bisa dipakai',
    description: 'Surat PDF siap cetak tanpa perlu edit tambahan',
  },
  {
    icon: Zap,
    title: 'Hemat waktu',
    description: 'Apa yang biasanya butuh 1 jam, sekarang cukup 1 menit',
  },
]

export const HOW_IT_WORKS_STEPS: StepRowEntry[] = [
  {
    variant: 'icon',
    icon: ClipboardList,
    title: 'Jawab pertanyaan singkat',
    description:
      'Pilih jenis surat, lalu lengkapi data penting seperti identitas dan tujuan—tanpa harus menyusun paragraf dari nol.',
  },
  {
    variant: 'icon',
    icon: Sparkles,
    title: 'Disusun mengikuti format formal',
    description:
      'Kop surat, pembuka, isi, dan penutup disusun mengikuti pola surat resmi yang lazim dipakai di Indonesia.',
  },
  {
    variant: 'icon',
    icon: Download,
    title: 'Unduh sebagai PDF',
    description:
      'Terima berkas siap cetak atau siap dikirim. Periksa sekali lagi, lalu gunakan seperti surat pada umumnya.',
  },
]

export const PRICING_PLANS: PricingPlanDefinition[] = [
  {
    id: 'free',
    name: 'Gratis',
    price: 'Rp 0',
    period: '/selamanya',
    icon: Gift,
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
    icon: Crown,
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
    icon: ShoppingCart,
    features: [
      { label: 'Bayar sesuai kebutuhan', included: true },
      { label: 'Tanpa komitmen', included: true },
      { label: 'Akses semua fitur', included: true },
      { label: 'Riwayat surat', included: false },
    ],
    ctaLabel: 'Mulai Bayar Per Surat',
    ctaPrimary: false,
  },
]
