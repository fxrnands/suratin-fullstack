import { NextResponse } from 'next/server'

import {
  getRefreshTokenFromRequestCookie,
  setAuthCookies,
} from '@/lib/auth/auth-cookies'
import { rotateRefreshToken } from '@/lib/auth/session'
import { ApiError } from '@/lib/http/api-error'
import { toErrorResponse } from '@/lib/http/route-error'
import { refreshSchema } from '@/lib/validation/letter-draft'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    let body: unknown = null
    try {
      body = await request.json()
    } catch {
      body = null
    }

    const parsed = refreshSchema.safeParse(body)
    const refreshToken =
      (parsed.success ? parsed.data.refreshToken : null) ||
      getRefreshTokenFromRequestCookie(request)
    if (!refreshToken) {
      throw new ApiError(401, 'INVALID_REFRESH', 'Refresh token required')
    }
    const tokens = await rotateRefreshToken(refreshToken)

    const response = NextResponse.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      refreshExpiresAt: tokens.refreshExpiresAt,
    })
    setAuthCookies(response, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessExpiresIn: tokens.expiresIn,
      refreshExpiresAt: tokens.refreshExpiresAt,
    })
    return response
  } catch (error) {
    return toErrorResponse(error)
  }
}
