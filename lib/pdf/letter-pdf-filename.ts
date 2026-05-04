import type { LetterKind } from '@/components/letter-builder/types'

/** Label file unduhan — konsisten dengan jenis surat di aplikasi */
export const LETTER_KIND_FILENAME_LABEL: Record<LetterKind, string> = {
  lamaran: 'Surat Lamaran',
  resign: 'Surat Pengunduran Diri',
  permohonan: 'Surat Permohonan',
  izin: 'Surat Izin',
  pengaduan: 'Surat Pengaduan',
}

export function sanitizeFilenamePart(value: string): string {
  const t = value.trim().replace(/[/\\?%*:|"<>]/g, '').replace(/\s+/g, ' ')
  return t.slice(0, 80) || 'Tanpa Nama'
}

/** `{kategori} - {nama lengkap}.pdf` */
export function buildLetterPdfFilename(kind: LetterKind, fullName: string): string {
  const category = LETTER_KIND_FILENAME_LABEL[kind]
  const name = sanitizeFilenamePart(fullName)
  return `${category} - ${name}.pdf`
}

/** Header `Content-Disposition` dengan dukungan nama Unicode (RFC 5987). */
export function pdfAttachmentContentDisposition(filename: string): string {
  const asciiFallback = filename.replace(/[^\x20-\x7E]/g, '_')
  const encoded = encodeURIComponent(filename)
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`
}
