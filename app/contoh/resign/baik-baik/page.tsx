import type { Metadata } from 'next'

import { ContohArticlePage } from '@/components/seo/contoh-article-page'
import { buildPageMetadata } from '@/lib/seo/build-metadata'

export const metadata: Metadata = buildPageMetadata('contohResignBaikBaik', { ogType: 'article' })

export default function ContohResignBaikBaikPage() {
  return <ContohArticlePage articleKey="contohResignBaikBaik" />
}
