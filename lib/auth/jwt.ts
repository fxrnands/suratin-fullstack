import * as jose from 'jose'

import { ApiError } from '@/lib/http/api-error'

export interface AccessTokenPayload {
  sub: string
  email: string
}

function accessSecret() {
  const secret = process.env.JWT_ACCESS_SECRET
  if (!secret || secret.length < 16) {
    throw new ApiError(
      503,
      'AUTH_NOT_CONFIGURED',
      'JWT_ACCESS_SECRET is missing or too short (min 16 chars)',
    )
  }
  return new TextEncoder().encode(secret)
}

export async function signAccessToken(payload: AccessTokenPayload) {
  const expires =
    process.env.JWT_ACCESS_EXPIRES ?? '15m'

  return new jose.SignJWT({
    email: payload.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(accessSecret())
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const secretKey = accessSecret()

  try {
    const { payload } = await jose.jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    })
    const sub = payload.sub
    const email = payload.email
    if (typeof sub !== 'string' || typeof email !== 'string') {
      throw new Error('Invalid payload shape')
    }
    return { sub, email }
  } catch {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired access token')
  }
}
