export function schemaWebApp(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Suratin',
    url: baseUrl,
    description: 'Generator surat resmi berbasis web untuk pengguna Indonesia',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    inLanguage: 'id',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
      description: 'Mulai gratis — fitur lanjutan sesuai paket',
    },
  } as const
}

export function schemaOrganization(input: { url: string; logoUrl: string; sameAs?: string[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Suratin',
    url: input.url,
    logo: input.logoUrl,
    ...(input.sameAs && input.sameAs.length > 0 ? { sameAs: input.sameAs } : {}),
  } as const
}

export function schemaHowTo(
  name: string,
  description: string,
  steps: { name: string; text: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    inLanguage: 'id',
    tool: {
      '@type': 'HowToTool',
      name: 'Suratin — generator surat',
    },
    totalTime: 'PT2M',
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  } as const
}

export function schemaFaq(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  } as const
}

export function schemaBreadcrumb(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  } as const
}
