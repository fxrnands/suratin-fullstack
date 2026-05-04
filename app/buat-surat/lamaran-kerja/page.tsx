import type { Metadata } from 'next'

import { LetterBuilderPage } from '@/components/letter-builder/letter-builder-page'
import { buildPageMetadata } from '@/lib/seo/build-metadata'

export const metadata: Metadata = buildPageMetadata('generatorLamaran')

export default function BuatSuratLamaranKerjaPage() {
  return <LetterBuilderPage initialKind="lamaran" />
}
