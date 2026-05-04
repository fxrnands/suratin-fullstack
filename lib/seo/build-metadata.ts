import type { Metadata } from 'next'

import { SITE_CONFIG, type PageSeoKey, PAGE_SEO } from '@/lib/seo-config'

function ogImageUrl(title: string, subtitle?: string): string {
  const params = new URLSearchParams({ title })
  if (subtitle) params.set('subtitle', subtitle)
  return `${SITE_CONFIG.domain}/og?${params.toString()}`
}

export function buildPageMetadata(
  key: PageSeoKey,
  options?: { ogSubtitle?: string; ogType?: 'website' | 'article' },
): Metadata {
  const seo = PAGE_SEO[key]
  const ogImage = ogImageUrl(seo.title, options?.ogSubtitle)

  return {
    title: seo.title,
    description: seo.description,
    keywords: [...seo.keywords],
    alternates: { canonical: seo.canonical },
    openGraph: {
      type: options?.ogType ?? 'website',
      locale: SITE_CONFIG.locale,
      url: seo.canonical,
      siteName: SITE_CONFIG.name,
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: seo.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [ogImage],
      creator: SITE_CONFIG.twitterHandle,
    },
  }
}

export function buildRootMetadata(): Metadata {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

  return {
    metadataBase: new URL(SITE_CONFIG.domain),
    title: {
      default: PAGE_SEO.homepage.title,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    keywords: [
      'buat surat online',
      'generator surat resmi',
      'surat otomatis AI indonesia',
      'surat formal',
      'surat resmi',
    ],
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.domain }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      url: SITE_CONFIG.domain,
      siteName: SITE_CONFIG.name,
      title: PAGE_SEO.homepage.title,
      description: SITE_CONFIG.description,
      images: [
        {
          url: SITE_CONFIG.ogImageDefault,
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} — generator surat resmi`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: PAGE_SEO.homepage.title,
      description: SITE_CONFIG.description,
      images: [SITE_CONFIG.ogImageDefault],
      creator: SITE_CONFIG.twitterHandle,
    },
    alternates: { canonical: PAGE_SEO.homepage.canonical },
    ...(google ? { verification: { google } } : {}),
  }
}
