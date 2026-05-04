import { sanitizeReturnPath } from '@/lib/client/sanitize-return-path'

describe('sanitizeReturnPath', () => {
  it('returns fallback for empty or invalid paths', () => {
    expect(sanitizeReturnPath(null)).toBe('/buat-surat')
    expect(sanitizeReturnPath('')).toBe('/buat-surat')
    expect(sanitizeReturnPath('login')).toBe('/buat-surat')
    expect(sanitizeReturnPath('//evil.com')).toBe('/buat-surat')
  })

  it('blocks auth pages to avoid redirect loops', () => {
    expect(sanitizeReturnPath('/login')).toBe('/buat-surat')
    expect(sanitizeReturnPath('/register?next=/surat-saya')).toBe('/buat-surat')
  })

  it('allows internal app routes', () => {
    expect(sanitizeReturnPath('/surat-saya')).toBe('/surat-saya')
    expect(sanitizeReturnPath('/buat-surat?kind=izin')).toBe('/buat-surat?kind=izin')
  })
})
