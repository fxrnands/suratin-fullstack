import type { Metadata } from 'next'

import {
  BenefitsSection,
  FinalCtaSection,
  HeroSection,
  HowItWorksSection,
  LetterCatalogSection,
  PricingSection,
  ProblemSection,
  SimpleStepsSection,
  SiteFooter,
} from '@/components/landing'
import { LandingScrollBridge } from '@/components/landing/landing-scroll-bridge'
import { HomePageJsonLd } from '@/components/seo/home-page-jsonld'
import { buildPageMetadata } from '@/lib/seo/build-metadata'
import { getHomePageContent } from '@/lib/marketing/get-home-content'

export const metadata: Metadata = buildPageMetadata('homepage')

export default async function Home() {
  const content = await getHomePageContent()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HomePageJsonLd />
      <LandingScrollBridge />
      <HeroSection
        badge={content.hero.badge}
        subtitle={content.hero.subtitle}
        footnote={content.hero.footnote}
        primaryCta={content.hero.primaryCta}
      />
      <ProblemSection items={content.problemItems} />
      <SimpleStepsSection steps={content.simpleSteps} />
      <LetterCatalogSection items={content.letterTypes} />
      <BenefitsSection items={content.benefitItems} />
      <HowItWorksSection steps={content.howItWorksSteps} />
      <PricingSection plans={content.pricingPlans} />
      <FinalCtaSection ctaLabel={content.hero.primaryCta} />
      <SiteFooter />
    </div>
  )
}
