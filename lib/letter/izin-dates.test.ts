import {
  areIzinDatesComplete,
  formatIzinDateRangeForLetter,
  formatIzinDayIndonesian,
  parseIzinIsoDate,
} from '@/lib/letter/izin-dates'

describe('izin date helpers', () => {
  it('parses only ISO yyyy-mm-dd dates', () => {
    expect(parseIzinIsoDate('2026-05-04')).toBeDefined()
    expect(parseIzinIsoDate('04-05-2026')).toBeUndefined()
    expect(parseIzinIsoDate('2026/05/04')).toBeUndefined()
  })

  it('formats Indonesian day labels', () => {
    expect(formatIzinDayIndonesian('2026-05-04')).toContain('2026')
    expect(formatIzinDayIndonesian('invalid')).toBe('')
  })

  it('builds date range labels for letters', () => {
    expect(formatIzinDateRangeForLetter({ dateFrom: '2026-05-04', dateTo: '2026-05-04' })).toBe(
      formatIzinDayIndonesian('2026-05-04'),
    )
    expect(formatIzinDateRangeForLetter({ dateFrom: '2026-05-04', dateTo: '2026-05-05' })).toContain('–')
  })

  it('validates complete ranges where from <= to', () => {
    expect(areIzinDatesComplete({ dateFrom: '2026-05-04', dateTo: '2026-05-05' })).toBe(true)
    expect(areIzinDatesComplete({ dateFrom: '2026-05-06', dateTo: '2026-05-05' })).toBe(false)
    expect(areIzinDatesComplete({ dateFrom: 'invalid', dateTo: '2026-05-05' })).toBe(false)
  })
})
