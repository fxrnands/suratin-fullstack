import { eq } from 'drizzle-orm'

import type { Database } from '@/lib/db/types'
import { refreshTokens, users } from '@/lib/db/schema'

export async function insertRefreshToken(
  db: Database,
  row: { userId: string; tokenHash: string; expiresAt: Date },
) {
  await db.insert(refreshTokens).values(row)
}

export async function findRefreshTokenJoinUserByHash(db: Database, tokenHash: string) {
  const [row] = await db
    .select({
      id: refreshTokens.id,
      userId: refreshTokens.userId,
      expiresAt: refreshTokens.expiresAt,
      revokedAt: refreshTokens.revokedAt,
      email: users.email,
    })
    .from(refreshTokens)
    .innerJoin(users, eq(refreshTokens.userId, users.id))
    .where(eq(refreshTokens.tokenHash, tokenHash))
    .limit(1)

  return row ?? null
}

export async function revokeRefreshTokenById(db: Database, tokenRowId: string) {
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.id, tokenRowId))
}

export async function revokeRefreshTokenByHash(db: Database, tokenHash: string) {
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.tokenHash, tokenHash))
}
