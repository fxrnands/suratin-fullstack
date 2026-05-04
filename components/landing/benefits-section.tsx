import { LandingSection } from '@/components/landing/landing-section'
import type { IconTextItem } from '@/components/landing/data'

interface BenefitsSectionProps {
  title?: string
  items: IconTextItem[]
}

export function BenefitsSection({ title = 'Mengapa Suratin?', items }: BenefitsSectionProps) {
  return (
    <LandingSection innerClassName="mx-auto max-w-4xl">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{title}</h2>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.title} className="flex gap-4">
            <item.icon className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <h3 className="font-semibold leading-snug">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </LandingSection>
  )
}
