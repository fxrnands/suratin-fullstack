import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export type StepRowEntry =
  | {
      variant: 'numbered'
      num: string
      title: string
      description: string
    }
  | {
      variant: 'icon'
      icon: LucideIcon
      title: string
      description: string
    }

const numberedConnector =
  'top-6 left-[calc(-50%-0.5rem)] w-[calc(100%+2rem-3rem)] -translate-y-1/2'
const iconConnector = 'top-7 left-[calc(-50%-0.25rem)] w-[calc(100%+2rem-3.5rem)]'

interface StepRowProps {
  steps: StepRowEntry[]
  className?: string
}

export function StepRow({ steps, className }: StepRowProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-0', className)}>
      {steps.map((step, index) => (
        <div key={step.title} className="relative z-10 text-center">
          {index > 0 ? (
            <div
              className={cn(
                'pointer-events-none absolute z-0 hidden h-0 border-t-2 border-dashed border-primary/35 sm:block',
                step.variant === 'numbered' ? numberedConnector : iconConnector,
              )}
              aria-hidden
            />
          ) : null}
          {step.variant === 'numbered' ? (
            <>
              <div className="relative z-10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {step.num}
              </div>
              <h3 className="relative z-10 mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="relative z-10 text-sm text-muted-foreground">{step.description}</p>
            </>
          ) : (
            <>
              <div className="relative z-10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                <step.icon className="h-7 w-7 text-primary" strokeWidth={2} aria-hidden />
              </div>
              <h3 className="relative z-10 mb-2 text-lg font-semibold leading-snug">{step.title}</h3>
              <p className="relative z-10 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
