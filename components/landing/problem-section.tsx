import { LandingSection } from '@/components/landing/landing-section'
import type { IconTextItem } from '@/components/landing/data'

interface ProblemSectionProps {
  title?: string
  subtitle?: string
  items: IconTextItem[]
}

export function ProblemSection({
  title = 'Masalah yang sering dihadapi',
  subtitle = 'Jangan khawatir, Suratin hadir untuk solusinya',
  items,
}: ProblemSectionProps) {
  return (
    <LandingSection className="bg-secondary/30" innerClassName="mx-auto max-w-4xl">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-border/50 bg-card p-6 transition hover:border-primary/30"
          >
            <item.icon className="mb-4 h-8 w-8 text-primary" />
            <h3 className="mb-2 font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </LandingSection>
  )
}
