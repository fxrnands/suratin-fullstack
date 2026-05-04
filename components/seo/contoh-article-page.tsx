import Link from 'next/link'

import { CtaBanner } from '@/components/seo/cta-banner'
import { FaqSection } from '@/components/seo/faq-section'
import { RelatedPages } from '@/components/seo/related-pages'
import { SchemaMarkup } from '@/components/seo/schema-markup'
import type { ContohArticleSeoKey } from '@/lib/seo/contoh-articles-data'
import { getContohArticle } from '@/lib/seo/contoh-articles-data'
import { getSiteDomain } from '@/lib/seo-config'
import { schemaBreadcrumb, schemaFaq, schemaHowTo } from '@/lib/schema-templates'

interface ContohArticlePageProps {
  articleKey: ContohArticleSeoKey
}

export function ContohArticlePage({ articleKey }: ContohArticlePageProps) {
  const data = getContohArticle(articleKey)
  const domain = getSiteDomain()

  const schemas = [
    schemaHowTo(data.h1, data.intro[0] ?? '', data.howToSteps),
    schemaFaq(data.faq),
    schemaBreadcrumb(
      data.breadcrumbs.map((b) => ({
        name: b.name,
        url: b.path === '/' ? domain : `${domain}${b.path}`,
      })),
    ),
  ]

  return (
    <>
      <SchemaMarkup schema={schemas} />
      <main className="mx-auto max-w-3xl px-4 py-12 text-foreground lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          {data.breadcrumbs.map((b, index) => (
            <span key={b.path}>
              {index > 0 ? <span className="mx-1.5 text-border">/</span> : null}
              {index < data.breadcrumbs.length - 1 ? (
                <Link href={b.path} className="hover:text-foreground hover:underline">
                  {b.name}
                </Link>
              ) : (
                <span className="text-foreground">{b.name}</span>
              )}
            </span>
          ))}
        </nav>

        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{data.h1}</h1>

        <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
          {data.intro.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <CtaBanner
          title={data.ctaTop.title}
          description={data.ctaTop.description}
          ctaText={data.ctaTop.ctaText}
          ctaUrl={data.ctaTop.ctaUrl}
        />

        {data.exampleBlocks.map((block) => (
          <section key={block.title} className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{block.title}</h2>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-border/60 bg-muted/30 p-4 text-sm leading-relaxed text-foreground">
              {block.pre}
            </pre>
          </section>
        ))}

        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{data.tipsTitle}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            {data.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <RelatedPages links={data.related} />

        <FaqSection items={data.faq} />

        <CtaBanner
          title={data.ctaBottom.title}
          description={data.ctaBottom.description}
          ctaText={data.ctaBottom.ctaText}
          ctaUrl={data.ctaBottom.ctaUrl}
          variant={data.ctaBottom.variant ?? 'dark'}
        />
      </main>
    </>
  )
}
