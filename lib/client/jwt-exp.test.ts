import { accessTokenExpiresWithin, decodeJwtExpiryUnix } from '@/lib/client/jwt-exp'

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function buildUnsignedToken(payload: Record<string, unknown>) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'none', typ: 'JWT' }))
  const body = base64UrlEncode(JSON.stringify(payload))
  return `${header}.${body}.signature`
}

describe('jwt-exp helpers', () => {
  it('decodes exp unix value from payload', () => {
    const token = buildUnsignedToken({ sub: 'user-1', exp: 1_900_000_000 })
    expect(decodeJwtExpiryUnix(token)).toBe(1_900_000_000)
  })

  it('returns null for malformed or missing exp', () => {
    expect(decodeJwtExpiryUnix('not-a-jwt')).toBeNull()
    expect(decodeJwtExpiryUnix(buildUnsignedToken({ sub: 'user-1' }))).toBeNull()
  })

  it('checks threshold using current time', () => {
    const now = Math.floor(Date.now() / 1000)
    const nearExpiry = buildUnsignedToken({ exp: now + 20 })
    const farExpiry = buildUnsignedToken({ exp: now + 600 })

    expect(accessTokenExpiresWithin(nearExpiry, 30)).toBe(true)
    expect(accessTokenExpiresWithin(farExpiry, 30)).toBe(false)
  })
})
