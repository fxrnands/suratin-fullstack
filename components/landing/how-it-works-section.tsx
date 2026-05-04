import { LandingSection } from '@/components/landing/landing-section'
import { StepRow, type StepRowEntry } from '@/components/landing/step-row'

interface HowItWorksSectionProps {
  title?: string
  subtitle?: string
  steps: StepRowEntry[]
}

export function HowItWorksSection({
  title = 'Bagaimana Cara Kerjanya?',
  subtitle = 'Yang Anda lakukan hanya mengisi ringkas; Suratin yang merapikan bentuk surat resminya sampai siap dipakai.',
  steps,
}: HowItWorksSectionProps) {
  return (
    <LandingSection
      id="cara-kerja"
      className="scroll-mt-[4.5rem] bg-linear-to-br from-primary/5 to-accent/5"
      innerClassName="mx-auto max-w-5xl"
    >
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mt-4 text-muted-foreground">{subtitle}</p>
      </div>

      <StepRow steps={steps} />
    </LandingSection>
  )
}
