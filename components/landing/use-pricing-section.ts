'use client'

import { useMemo, useState } from 'react'

import { useAuth } from '@/components/auth/auth-provider'
import type { PlanId, PricingPlanDefinition } from '@/components/landing/data'
import { landingIconOrFallback } from '@/lib/marketing/icon-registry'
import type { SerializedPricingPlan } from '@/lib/marketing/serialized-home'

function toPricingPlanDefinition(plan: SerializedPricingPlan): PricingPlanDefinition {
  return {
    ...plan,
    icon: landingIconOrFallback(plan.iconKey),
  }
}

export function usePricingSection(plans: SerializedPricingPlan[], defaultPlan: PlanId) {
  const { user, hydrated } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(defaultPlan)
  const resolvedPlans = useMemo(
    () => plans.map(toPricingPlanDefinition),
    [plans],
  )
  const isActiveProSubscriber = hydrated && user?.tier === 'pro'

  return {
    selectedPlan,
    setSelectedPlan,
    resolvedPlans,
    isActiveProSubscriber,
  }
}
