import { NextResponse } from 'next/server'

import { setAuthCookies } from '@/lib/auth/auth-cookies'
import { hashPassword } from '@/lib/auth/password'
import { issueTokenPair } from '@/lib/auth/session'
import { getDb } from '@/lib/db'
import { getPgErrorCode } from '@/lib/db/postgres-errors'
import { insertUser } from '@/lib/db/queries/users'
import { ApiError } from '@/lib/http/api-error'
import { toErrorResponse } from '@/lib/http/route-error'
import { zodErrorResponse } from '@/lib/http/zod-error'
import { registerSchema } from '@/lib/validation/letter-draft'
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

    const parsed = registerSchema.parse(body)

    const db = getDb()
    const passwordHash = await hashPassword(parsed.password)

    let userId: string
    try {
      const inserted = await insertUser(db, {
        email: parsed.email.toLowerCase(),
        passwordHash,
        name: parsed.name,
        tier: 'free',
      })

      if (!inserted) throw new ApiError(500, 'REGISTER_FAILED', 'Could not create user')
      userId = inserted.id
    } catch (error: unknown) {
      if (getPgErrorCode(error) === '23505') {
        throw new ApiError(409, 'EMAIL_EXISTS', 'Email already registered')
      }
      throw error
    }

    const tokens = await issueTokenPair(userId, parsed.email.toLowerCase())

    const response = NextResponse.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      refreshExpiresAt: tokens.refreshExpiresAt,
      user: {
        id: userId,
        email: parsed.email.toLowerCase(),
        name: parsed.name,
        tier: 'free',
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
