import { NextResponse } from 'next/server'

import { setAuthCookies } from '@/lib/auth/auth-cookies'
import { parseUserTier } from '@/lib/auth/user-tier'
import { verifyPassword } from '@/lib/auth/password'
import { issueTokenPair } from '@/lib/auth/session'
import { getDb } from '@/lib/db'
import { findUserByEmail } from '@/lib/db/queries/users'
import { ApiError } from '@/lib/http/api-error'
import { toErrorResponse } from '@/lib/http/route-error'
import { zodErrorResponse } from '@/lib/http/zod-error'
import { loginSchema } from '@/lib/validation/letter-draft'
import { ZodError } from 'zod'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      throw new ApiError(400, 'BAD_JSON', 'Expected JSON body')
    }

    const parsed = loginSchema.parse(body)
    const email = parsed.email.toLowerCase()

    const db = getDb()
    const user = await findUserByEmail(db, email)

    if (!user) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')
    }

    const ok = await verifyPassword(parsed.password, user.passwordHash)
    if (!ok) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')
    }

    const tokens = await issueTokenPair(user.id, user.email)

    const response = NextResponse.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      refreshExpiresAt: tokens.refreshExpiresAt,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: parseUserTier(user.tier),
      },
    })
    setAuthCookies(response, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessExpiresIn: tokens.expiresIn,
      refreshExpiresAt: tokens.refreshExpiresAt,
    })
    return response
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error)
    return toErrorResponse(error)
  }
}
