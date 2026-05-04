function base64UrlToPayloadJson(segment: string): string {
  let base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) base64 += '='
  return typeof atob === 'function' ? atob(base64) : ''
}

/** Decode JWT `exp` (seconds since epoch) without verifying the signature — scheduling refresh only. */
export function decodeJwtExpiryUnix(accessToken: string): number | null {
  try {
    const parts = accessToken.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(base64UrlToPayloadJson(parts[1])) as { exp?: unknown }
    return typeof payload.exp === 'number' ? payload.exp : null
  } catch {
    return null
  }
}

export function accessTokenExpiresWithin(accessToken: string, withinSeconds: number): boolean {
  const exp = decodeJwtExpiryUnix(accessToken)
  if (!exp) return false
  const nowSec = Math.floor(Date.now() / 1000)
  return exp - nowSec <= withinSeconds
}
