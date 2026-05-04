import { LandingSection } from '@/components/landing/landing-section'
import { StepRow, type StepRowEntry } from '@/components/landing/step-row'

interface SimpleStepsSectionProps {
  title?: string
  subtitle?: string
  steps: StepRowEntry[]
}

export function SimpleStepsSection({
  title = '3 Langkah Mudah',
  subtitle = 'Dari bingung menjadi siap dalam menit',
  steps,
}: SimpleStepsSectionProps) {
  return (
    <LandingSection innerClassName="mx-auto max-w-4xl">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      <StepRow steps={steps} />
    </LandingSection>
  )
}
