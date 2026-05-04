import type { IconTextItem, LetterTypeItem } from '@/components/landing/data'
import type { StepRowEntry } from '@/components/landing/step-row'

import { landingIconOrFallback } from '@/lib/marketing/icon-registry'
import {
  DEFAULT_SERIALIZED_HOME,
  type SerializedHomeBundle,
} from '@/lib/marketing/serialized-home'

/** Surat permohonan sementara tidak dijual — sembunyikan dari katalog meski masih ada di JSON marketing DB. */
function letterTypesActiveOnly(items: SerializedHomeBundle['letter_types']): SerializedHomeBundle['letter_types'] {
  return items.filter((item) => !/permohonan/i.test(item.title))
}

export interface HydratedHomeContent {
  hero: SerializedHomeBundle['hero']
  problemItems: IconTextItem[]
  simpleSteps: StepRowEntry[]
  letterTypes: LetterTypeItem[]
  benefitItems: IconTextItem[]
  howItWorksSteps: StepRowEntry[]
  /** JSON-safe — icons resolved inside client `PricingSection`. */
  pricingPlans: SerializedHomeBundle['pricing_plans']
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function coerceIconItems(raw: unknown, fallback: SerializedHomeBundle['problem_items']) {
  if (!Array.isArray(raw)) return fallback
  const out: { iconKey: string; title: string; description: string }[] = []
  for (const item of raw) {
    if (!isRecord(item)) continue
    const iconKey = typeof item.iconKey === 'string' ? item.iconKey : ''
    const title = typeof item.title === 'string' ? item.title : ''
    const description = typeof item.description === 'string' ? item.description : ''
    if (!title) continue
    out.push({ iconKey, title, description })
  }
  return out.length ? out : fallback
}

function coerceStepsNumbered(raw: unknown, fallback: SerializedHomeBundle['simple_steps']) {
  if (!Array.isArray(raw)) return fallback
  const out = []
  for (const item of raw) {
    if (!isRecord(item) || item.variant !== 'numbered') continue
    const num = typeof item.num === 'string' ? item.num : ''
    const title = typeof item.title === 'string' ? item.title : ''
    const description = typeof item.description === 'string' ? item.description : ''
    if (!title) continue
    out.push({ variant: 'numbered' as const, num, title, description })
  }
  return out.length ? out : fallback
}

function coerceStepsIcon(raw: unknown, fallback: SerializedHomeBundle['how_it_works_steps']) {
  if (!Array.isArray(raw)) return fallback
  const out = []
  for (const item of raw) {
    if (!isRecord(item) || item.variant !== 'icon') continue
    const iconKey = typeof item.iconKey === 'string' ? item.iconKey : ''
    const title = typeof item.title === 'string' ? item.title : ''
    const description = typeof item.description === 'string' ? item.description : ''
    if (!title) continue
    out.push({ variant: 'icon' as const, iconKey, title, description })
  }
  return out.length ? out : fallback
}

function coercePricing(raw: unknown, fallback: SerializedHomeBundle['pricing_plans']) {
  if (!Array.isArray(raw)) return fallback
  const out: SerializedHomeBundle['pricing_plans'] = []
  for (const item of raw) {
    if (!isRecord(item)) continue
    const id = item.id
    if (id !== 'free' && id !== 'pro' && id !== 'pay') continue
    const name = typeof item.name === 'string' ? item.name : ''
    const price = typeof item.price === 'string' ? item.price : ''
    const period = typeof item.period === 'string' ? item.period : ''
    const iconKey = typeof item.iconKey === 'string' ? item.iconKey : 'Gift'
    const popularBadge =
      typeof item.popularBadge === 'string' ? item.popularBadge : undefined
    const features = Array.isArray(item.features) ? item.features : []
    const cleanedFeatures = features
      .filter((f): f is { label: string; included: boolean } =>
        isRecord(f) && typeof f.label === 'string' && typeof f.included === 'boolean',
      )
    const ctaLabel = typeof item.ctaLabel === 'string' ? item.ctaLabel : ''
    const ctaPrimary = typeof item.ctaPrimary === 'boolean' ? item.ctaPrimary : false
    if (!name || !price || cleanedFeatures.length === 0) continue
    out.push({
      id,
      name,
      price,
      period,
      iconKey,
      popularBadge,
      features: cleanedFeatures,
      ctaLabel,
      ctaPrimary,
    })
  }
  return out.length === fallback.length ? out : fallback
}

function coerceHero(raw: unknown, fallback: SerializedHomeBundle['hero']) {
  if (!isRecord(raw)) return fallback
  return {
    badge: typeof raw.badge === 'string' ? raw.badge : fallback.badge,
    subtitle: typeof raw.subtitle === 'string' ? raw.subtitle : fallback.subtitle,
    footnote: typeof raw.footnote === 'string' ? raw.footnote : fallback.footnote,
    primaryCta: typeof raw.primaryCta === 'string' ? raw.primaryCta : fallback.primaryCta,
  }
}

export function mergeSerializedHome(
  overrides: Partial<Record<keyof SerializedHomeBundle, unknown>>,
): SerializedHomeBundle {
  const d = DEFAULT_SERIALIZED_HOME
  return {
    hero: coerceHero(overrides.hero, d.hero),
    problem_items: coerceIconItems(overrides.problem_items, d.problem_items),
    simple_steps: coerceStepsNumbered(overrides.simple_steps, d.simple_steps),
    letter_types: (() => {
      const merged = letterTypesActiveOnly(coerceIconItems(overrides.letter_types, d.letter_types))
      return merged.length > 0 ? merged : letterTypesActiveOnly(d.letter_types)
    })(),
    benefit_items: coerceIconItems(overrides.benefit_items, d.benefit_items),
    how_it_works_steps: coerceStepsIcon(overrides.how_it_works_steps, d.how_it_works_steps),
    pricing_plans: coercePricing(overrides.pricing_plans, d.pricing_plans),
  }
}

export function hydrateHomeMarketing(bundle: SerializedHomeBundle): HydratedHomeContent {
  return {
    hero: bundle.hero,
    problemItems: bundle.problem_items.map((item) => ({
      icon: landingIconOrFallback(item.iconKey),
      title: item.title,
      description: item.description,
    })),
    simpleSteps: bundle.simple_steps,
    letterTypes: bundle.letter_types.map((item) => ({
      icon: landingIconOrFallback(item.iconKey),
      title: item.title,
      description: item.description,
    })),
    benefitItems: bundle.benefit_items.map((item) => ({
      icon: landingIconOrFallback(item.iconKey),
      title: item.title,
      description: item.description,
    })),
    howItWorksSteps: bundle.how_it_works_steps.map((step) => ({
      variant: 'icon',
      icon: landingIconOrFallback(step.iconKey),
      title: step.title,
      description: step.description,
    })),
    pricingPlans: bundle.pricing_plans,
  }
}
