import type { LetterKind } from '@/components/letter-builder/types'

import {
  formatLetterHeaderDateLocalized,
  LETTER_HEADER_CITY_DEFAULT,
  type LetterOutputLocale,
} from '@/lib/letter/indonesian-templates'

/** Tanggal pada baris kop surat Indonesia / Inggris sederhana. */
export function looksLikeLetterDateLine(s: string): boolean {
  const t = s.trim()
  if (/^\d{1,2}\s+\p{L}+(?:\s+\p{L}+)*\s+\d{4}$/u.test(t)) return true
  return /^[\p{L}\s.'-]+,\s*\d{1,2}\s+\p{L}+(?:\s+\p{L}+)*\s+\d{4}$/u.test(t)
}

export function extractCityFromDateLine(s: string): string | null {
  const m = s.trim().match(/^([^,]+),\s*/)
  if (!m) return null
  const c = m[1].trim()
  return c.length > 0 ? c : null
}

/** Ganti baris tanggal pertama (di dalam sel `lines`) dengan tanggal hari ini; kota diambil dari teks lama bila ada. */
export function replaceFirstDateInLetterLines(
  lines: string[],
  outputLanguage: LetterOutputLocale = 'id',
): string[] {
  const out = lines.map((c) => c)
  outer: for (let i = 0; i < out.length; i++) {
    const raw = out[i]
    if (typeof raw !== 'string' || raw === '') continue
    const parts = raw.split(/\r?\n/)
    for (let j = 0; j < parts.length; j++) {
      const seg = parts[j]
      if (seg.trim() && looksLikeLetterDateLine(seg)) {
        const city = extractCityFromDateLine(seg) ?? LETTER_HEADER_CITY_DEFAULT
        parts[j] = formatLetterHeaderDateLocalized(city, outputLanguage)
        out[i] = parts.join('\n')
        break outer
      }
    }
  }
  return out
}

/** Judul baris Hal: di PDF / preview — judul tetap per jenis (tanpa nama di baris Hal). */
export function halTitleForKind(
  kind: LetterKind | undefined,
  subject: string,
  outputLanguage: LetterOutputLocale = 'id',
): string {
  if (kind === 'lamaran') return outputLanguage === 'en' ? 'Job Application' : 'Surat Lamaran Kerja'
  if (kind === 'resign') return outputLanguage === 'en' ? 'Letter of Resignation' : 'Surat Pengunduran Diri'
  if (kind === 'pengaduan') return outputLanguage === 'en' ? 'Complaint Letter' : 'Surat Pengaduan'
  if (kind === 'izin') return outputLanguage === 'en' ? 'Leave of Absence' : 'Surat Izin'
  return subject.trim()
}

/** Hapus baris berbentuk label `Email: …` (untuk surat resign yang tidak memuat email). */
export function removeEmailLabelLinesFromLines(lines: string[]): string[] {
  return lines.map((cell) => {
    if (typeof cell !== 'string' || cell === '') return cell
    return cell
      .split(/\r?\n/)
      .filter((line) => !/^email\s*:/i.test(line.trim()))
      .join('\n')
  })
}

/** Setelah flatten `lines[]`, ganti baris tanggal pertama dengan tanggal hari ini (kota dari teks lama bila ada). */
export function replaceFirstDateInFlatLines(
  flat: string[],
  outputLanguage: LetterOutputLocale = 'id',
): string[] {
  const copy = [...flat]
  for (let i = 0; i < copy.length; i++) {
    const line = copy[i]
    if (!line.trim()) continue
    if (looksLikeLetterDateLine(line)) {
      const city = extractCityFromDateLine(line) ?? LETTER_HEADER_CITY_DEFAULT
      copy[i] = formatLetterHeaderDateLocalized(city, outputLanguage)
      break
    }
  }
  return copy
}
