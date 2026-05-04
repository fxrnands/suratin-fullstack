import { NextResponse } from 'next/server'

import { parseUserTier } from '@/lib/auth/user-tier'
import { requireAuth } from '@/lib/auth/require-auth'
import { getDb } from '@/lib/db'
import { findUserById } from '@/lib/db/queries/users'
import { toErrorResponse } from '@/lib/http/route-error'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)
    const db = getDb()
    const user = await findUserById(db, auth.sub)

    if (!user) {
      return NextResponse.json({ error: { code: 'USER_GONE', message: 'User not found' } }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      tier: parseUserTier(user.tier),
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    })
  } catch (error) {
    return toErrorResponse(error)
  }
}
