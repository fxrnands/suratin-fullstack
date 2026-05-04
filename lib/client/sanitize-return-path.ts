const FALLBACK = '/buat-surat'

export function sanitizeReturnPath(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return FALLBACK
  if (raw.startsWith('/login') || raw.startsWith('/register')) return FALLBACK
  return raw
}
