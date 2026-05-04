'use client'

import { CreateLetterCtaButton } from '@/components/landing/create-letter-cta-button'
import { LandingSection } from '@/components/landing/landing-section'

interface FinalCtaSectionProps {
  title?: string
  subtitle?: string
  ctaLabel?: string
}

export function FinalCtaSection({
  title = 'Surat penting tidak boleh salah.',
  subtitle = 'Mulai buat surat formal Anda sekarang dengan bantuan AI yang terpercaya.',
  ctaLabel = 'Buat Surat Sekarang',
}: FinalCtaSectionProps) {
  return (
    <LandingSection innerClassName="mx-auto max-w-3xl text-center">
      <h2 className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h2>
      <p className="mb-8 text-lg text-muted-foreground">{subtitle}</p>
      <div className="flex justify-center">
        <CreateLetterCtaButton label={ctaLabel} className="py-4" />
      </div>
    </LandingSection>
  )
}
