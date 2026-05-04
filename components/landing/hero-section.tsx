import type { ReactNode } from 'react'

import { CreateLetterCtaButton } from '@/components/landing/create-letter-cta-button'

const DEFAULT_TITLE = (
  <>
    Surat formal yang benar.
    <span className="block text-primary">Dalam hitungan detik.</span>
  </>
)

interface HeroSectionProps {
  badge?: string
  title?: ReactNode
  subtitle?: string
  footnote?: string
  primaryCta?: string
}

export function HeroSection({
  badge = '🎉 Dipercaya oleh ribuan pengguna di Indonesia',
  title = DEFAULT_TITLE,
  subtitle = 'Buat surat lamaran, resign, izin, dan pengaduan resmi tanpa bingung format. Cukup isi, AI yang susun.',
  footnote = 'Digunakan oleh mahasiswa, fresh graduate, dan pekerja di Indonesia',
  primaryCta = 'Buat Surat Sekarang',
}: HeroSectionProps) {
  const centerGridStyle = {
    backgroundImage:
      'linear-gradient(to right, rgba(148, 163, 184, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.2) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
    WebkitMaskImage:
      'radial-gradient(ellipse 80% 56% at 50% 36%, black 0%, black 28%, transparent 74%)',
    maskImage:
      'radial-gradient(ellipse 80% 56% at 50% 36%, black 0%, black 28%, transparent 74%)',
  } as const

  return (
    <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[560px] bg-[radial-gradient(ellipse_55%_40%_at_50%_32%,rgba(99,102,241,0.16),transparent_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={centerGridStyle}
      />
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="space-y-8 text-center">
          <div className="inline-block">
            <span className="rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-primary">
              {badge}
            </span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>

          <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">{subtitle}</p>

          <div className="flex justify-center pt-8">
            <CreateLetterCtaButton label={primaryCta} />
          </div>

          <div className="pt-8 text-sm text-muted-foreground">{footnote}</div>
        </div>
      </div>
    </section>
  )
}
