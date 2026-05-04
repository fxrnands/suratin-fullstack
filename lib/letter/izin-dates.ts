import { format, isValid, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function parseIzinIsoDate(value: unknown): Date | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!ISO_DATE.test(trimmed)) return undefined
  const parsed = parseISO(trimmed)
  return isValid(parsed) ? parsed : undefined
}

export function formatIzinDayIndonesian(iso: unknown): string {
  const date = parseIzinIsoDate(iso)
  if (!date) return ''
  return format(date, 'd MMMM yyyy', { locale: localeId })
}

/** Rentang untuk teks surat / perihal; kosong jika tanggal tidak valid. */
export function formatIzinDateRangeForLetter(izin: { dateFrom?: unknown; dateTo?: unknown }): string {
  const fromLabel = formatIzinDayIndonesian(izin.dateFrom)
  const toLabel = formatIzinDayIndonesian(izin.dateTo)
  if (fromLabel && toLabel) {
    const rawFrom = String(izin.dateFrom ?? '').trim()
    const rawTo = String(izin.dateTo ?? '').trim()
    if (rawFrom === rawTo) return fromLabel
    return `${fromLabel} – ${toLabel}`
  }
  if (fromLabel) return fromLabel
  if (toLabel) return toLabel
  return ''
}

export function areIzinDatesComplete(izin: { dateFrom?: unknown; dateTo?: unknown }): boolean {
  const from = parseIzinIsoDate(izin.dateFrom)
  const to = parseIzinIsoDate(izin.dateTo)
  if (!from || !to) return false
  return from.getTime() <= to.getTime()
}
