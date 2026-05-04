import type { Metadata } from 'next'

import { LetterBuilderPage } from '@/components/letter-builder/letter-builder-page'
import { buildPageMetadata } from '@/lib/seo/build-metadata'

export const metadata: Metadata = buildPageMetadata('generatorPengaduan')

export default function BuatSuratPengaduanPage() {
  return <LetterBuilderPage initialKind="pengaduan" />
}
