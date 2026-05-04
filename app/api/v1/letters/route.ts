import { NextResponse } from 'next/server'

import { applyTierRestrictionsToLetterDraft, requireUserTier } from '@/lib/auth/letter-tone-tier'
import { requireAuth } from '@/lib/auth/require-auth'
import { getDb } from '@/lib/db'
import { insertLetterForUser, listLetterSummariesForUser } from '@/lib/db/queries/letters'
import { ApiError } from '@/lib/http/api-error'
import { toErrorResponse } from '@/lib/http/route-error'
import { zodErrorResponse } from '@/lib/http/zod-error'
import type { LetterDraft } from '@/components/letter-builder/types'
import { letterCreateSchema } from '@/lib/validation/letter-draft'
import { ZodError } from 'zod'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit') ?? 20), 50)
    const offset = Math.max(Number(searchParams.get('offset') ?? 0), 0)

    const db = getDb()
    const rows = await listLetterSummariesForUser(db, auth.sub, limit, offset)

    return NextResponse.json({
      items: rows.map((row) => ({
        id: row.id,
        title: row.title,
        kind: row.kind,
        status: row.status,
        updatedAt: row.updatedAt.toISOString(),
        createdAt: row.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      throw new ApiError(400, 'BAD_JSON', 'Expected JSON body')
    }

    const parsed = letterCreateSchema.parse(body)
    const kind = parsed.draft.kind
    if (!kind) {
      throw new ApiError(400, 'KIND_REQUIRED', 'draft.kind is required')
    }

    const db = getDb()
    const tier = await requireUserTier(db, auth.sub)
    const draftForSave = applyTierRestrictionsToLetterDraft(parsed.draft as LetterDraft, tier)

    const row = await insertLetterForUser(db, {
      userId: auth.sub,
      title: parsed.title ?? null,
      kind,
      draft: draftForSave,
      status: 'draft',
    })

    if (!row) throw new ApiError(500, 'CREATE_FAILED', 'Could not create letter')

    return NextResponse.json(
      {
        id: row.id,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error)
    return toErrorResponse(error)
  }
}
