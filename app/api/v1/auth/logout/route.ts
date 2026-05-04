import { NextResponse } from 'next/server'

import {
  clearAuthCookies,
  getRefreshTokenFromRequestCookie,
} from '@/lib/auth/auth-cookies'
import { revokeRefreshToken } from '@/lib/auth/session'
import { ApiError } from '@/lib/http/api-error'
import { toErrorResponse } from '@/lib/http/route-error'
import { logoutSchema } from '@/lib/validation/letter-draft'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    let body: unknown = null
    try {
      body = await request.json()
    } catch {
      body = null
    }

    const parsed = logoutSchema.safeParse(body)
    const refreshToken =
      (parsed.success ? parsed.data.refreshToken : null) ||
      getRefreshTokenFromRequestCookie(request)
    if (!refreshToken) {
      throw new ApiError(400, 'BAD_REQUEST', 'Refresh token required')
    }

    await revokeRefreshToken(refreshToken)

    const response = NextResponse.json({ ok: true })
    clearAuthCookies(response)
    return response
  } catch (error) {
    return toErrorResponse(error)
  }
}
