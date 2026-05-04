import Link from 'next/link'

import { ContohSuratCard } from '@/components/seo/contoh-surat-card'
import { SchemaMarkup } from '@/components/seo/schema-markup'
import { getSiteDomain } from '@/lib/seo-config'
import { schemaBreadcrumb } from '@/lib/schema-templates'

export interface ContohHubLink {
  href: string
  title: string
  description: string
}

interface ContohHubPageProps {
  title: string
  description: string
  intro?: string
  links: ContohHubLink[]
  breadcrumbs: { name: string; path: string }[]
}

export function ContohHubPage({ title, description, intro, links, breadcrumbs }: ContohHubPageProps) {
  const domain = getSiteDomain()
  const schema = schemaBreadcrumb(
    breadcrumbs.map((b) => ({
      name: b.name,
      url: b.path === '/' ? domain : `${domain}${b.path}`,
    })),
  )

  return (
    <>
      <SchemaMarkup schema={schema} />
      <main className="mx-auto max-w-4xl px-4 py-12 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          {breadcrumbs.map((b, index) => (
            <span key={b.path}>
              {index > 0 ? <span className="mx-1.5 text-border">/</span> : null}
              {index < breadcrumbs.length - 1 ? (
                <Link href={b.path} className="hover:text-foreground hover:underline">
                  {b.name}
                </Link>
              ) : (
                <span className="text-foreground">{b.name}</span>
              )}
            </span>
          ))}
        </nav>

        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>
        {intro ? <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p> : null}

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {links.map((link) => (
            <ContohSuratCard key={link.href} href={link.href} title={link.title} description={link.description} />
          ))}
        </div>
      </main>
    </>
  )
}
