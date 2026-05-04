import type { Metadata } from 'next'

import { LetterBuilderPage } from '@/components/letter-builder/letter-builder-page'
import { buildPageMetadata } from '@/lib/seo/build-metadata'

export const metadata: Metadata = buildPageMetadata('generatorResign')

export default function BuatSuratResignPage() {
  return <LetterBuilderPage initialKind="resign" />
}
