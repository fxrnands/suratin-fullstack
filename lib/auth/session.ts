import * as jose from 'jose'

import { signAccessToken } from '@/lib/auth/jwt'
import { createOpaqueRefreshToken, hashRefreshToken } from '@/lib/auth/refresh-token'
import { getDb } from '@/lib/db'
import {
  findRefreshTokenJoinUserByHash,
  insertRefreshToken,
  revokeRefreshTokenByHash,
  revokeRefreshTokenById,
} from '@/lib/db/queries/refresh-tokens'
import { ApiError } from '@/lib/http/api-error'

const REFRESH_MS = 7 * 24 * 60 * 60 * 1000

export function computeExpiresInSeconds(accessToken: string) {
  const decoded = jose.decodeJwt(accessToken)
  if (typeof decoded.exp !== 'number') return 900
  const now = Math.floor(Date.now() / 1000)
  return Math.max(0, decoded.exp - now)
}

export async function issueTokenPair(userId: string, email: string) {
  const db = getDb()
  const accessToken = await signAccessToken({ sub: userId, email })
  const rawRefresh = createOpaqueRefreshToken()
  const tokenHash = hashRefreshToken(rawRefresh)
  const expiresAt = new Date(Date.now() + REFRESH_MS)

  await insertRefreshToken(db, {
    userId,
    tokenHash,
    expiresAt,
  })

  return {
    accessToken,
    refreshToken: rawRefresh,
    expiresIn: computeExpiresInSeconds(accessToken),
    refreshExpiresAt: expiresAt.toISOString(),
  }
}

export async function rotateRefreshToken(rawRefresh: string) {
  const db = getDb()
  const hash = hashRefreshToken(rawRefresh)

  const row = await findRefreshTokenJoinUserByHash(db, hash)

  if (!row || row.revokedAt) {
    throw new ApiError(401, 'INVALID_REFRESH', 'Refresh token invalid')
  }
  if (row.expiresAt.getTime() <= Date.now()) {
    throw new ApiError(401, 'INVALID_REFRESH', 'Refresh token expired')
  }

  await revokeRefreshTokenById(db, row.id)

  return issueTokenPair(row.userId, row.email)
}

export async function revokeRefreshToken(rawRefresh: string) {
  const db = getDb()
  const hash = hashRefreshToken(rawRefresh)
  await revokeRefreshTokenByHash(db, hash)
}
