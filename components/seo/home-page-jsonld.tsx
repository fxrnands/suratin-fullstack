import { SchemaMarkup } from '@/components/seo/schema-markup'
import { SITE_CONFIG } from '@/lib/seo-config'
import { schemaOrganization, schemaWebApp } from '@/lib/schema-templates'

function optionalSameAs(): string[] {
  const urls = [
    process.env.NEXT_PUBLIC_SURATIN_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_SURATIN_TIKTOK_URL,
    process.env.NEXT_PUBLIC_SURATIN_X_URL,
  ].filter((value): value is string => Boolean(value && value.length > 0))
  return urls
}

export function HomePageJsonLd() {
  const base = SITE_CONFIG.domain
  const sameAs = optionalSameAs()

  return (
    <SchemaMarkup
      schema={[
        schemaWebApp(base),
        schemaOrganization({
          url: base,
          logoUrl: `${base}/icon.svg`,
          ...(sameAs.length > 0 ? { sameAs } : {}),
        }),
      ]}
    />
  )
}
