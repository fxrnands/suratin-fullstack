'use client'

import { CheckCircle2 } from 'lucide-react'

import type { PlanId } from '@/components/landing/data'
import { LandingSection } from '@/components/landing/landing-section'
import { usePricingSection } from '@/components/landing/use-pricing-section'
import {
  DEFAULT_SERIALIZED_HOME,
  type SerializedPricingPlan,
} from '@/lib/marketing/serialized-home'
import { cn } from '@/lib/utils'

interface PricingSectionProps {
  title?: string
  subtitle?: string
  plans?: SerializedPricingPlan[]
  defaultPlan?: PlanId
}

export function PricingSection({
  title = 'Harga Terjangkau',
  subtitle = 'Pilih paket yang sesuai dengan kebutuhan Anda',
  plans = DEFAULT_SERIALIZED_HOME.pricing_plans,
  defaultPlan = 'pro',
}: PricingSectionProps) {
  const {
    selectedPlan,
    setSelectedPlan,
    resolvedPlans,
    isActiveProSubscriber,
  } = usePricingSection(plans, defaultPlan)

  return (
    <LandingSection
      id="harga"
      className="scroll-mt-24 bg-secondary/30"
      innerClassName="mx-auto max-w-5xl"
    >
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 md:items-stretch">
        {resolvedPlans.map((plan) => {
          const isSelected = selectedPlan === plan.id
          const showProSubscribed = plan.id === 'pro' && isActiveProSubscriber
          return (
            <div
              key={plan.id}
              className={cn(
                'relative flex h-full min-h-0 cursor-pointer flex-col rounded-lg border p-8 pb-10 transition-all md:p-10',
                isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-border/70',
                plan.popularBadge && isSelected && 'shadow-lg',
              )}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popularBadge ? (
                <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {plan.popularBadge}
                </div>
              ) : null}

              <plan.icon className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="flex shrink-0 flex-col gap-3 text-sm">
                {plan.features.map((feature) => (
                  <li
                    key={feature.label}
                    className={cn('flex items-center gap-2', !feature.included && 'text-muted-foreground')}
                  >
                    {feature.included ? (
                      <CheckCircle2 size={16} className="shrink-0 text-primary" />
                    ) : (
                      <div className="h-4 w-4 shrink-0 rounded-full border-2 border-muted-foreground" aria-hidden />
                    )}
                    {feature.label}
                  </li>
                ))}
              </ul>

              <div className="mt-8 min-h-4 flex-1" aria-hidden />

              <button
                type="button"
                disabled={showProSubscribed}
                className={cn(
                  'inline-flex shrink-0 w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition disabled:cursor-default disabled:opacity-100',
                  showProSubscribed
                    ? 'border border-green-600/35 bg-green-50 text-green-900 dark:border-green-500/40 dark:bg-green-950/45 dark:text-green-50'
                    : plan.ctaPrimary
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'border border-border hover:bg-secondary',
                )}
              >
                {showProSubscribed ? (
                  <>
                    Sudah Berlangganan
                    <CheckCircle2
                      aria-hidden
                      className="size-4 shrink-0 text-green-600 dark:text-green-400"
                    />
                  </>
                ) : (
                  plan.ctaLabel
                )}
              </button>
            </div>
          )
        })}
      </div>
    </LandingSection>
  )
}
