import { NextResponse } from 'next/server'

import { applyTierRestrictionsToLetterDraft, requireUserTier } from '@/lib/auth/letter-tone-tier'
import { requireAuth } from '@/lib/auth/require-auth'
import { getDb } from '@/lib/db'
import {
  deleteLetterForUser,
  getLetterForUser,
  updateLetterForUser,
} from '@/lib/db/queries/letters'
import { ApiError } from '@/lib/http/api-error'
import { toErrorResponse } from '@/lib/http/route-error'
import { zodErrorResponse } from '@/lib/http/zod-error'
import type { LetterDraft } from '@/components/letter-builder/types'
import { letterPatchSchema } from '@/lib/validation/letter-draft'
import { z, ZodError } from 'zod'

export const runtime = 'nodejs'

const idParam = z.string().uuid()

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(request)
    const { id } = await context.params
    idParam.parse(id)

    const db = getDb()
    const row = await getLetterForUser(db, id, auth.sub)

    if (!row) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Letter not found' } }, { status: 404 })
    }

    return NextResponse.json({
      id: row.id,
      title: row.title,
      kind: row.kind,
      status: row.status,
      draft: row.draft,
      generatedSubject: row.generatedSubject,
      generatedLines: row.generatedLines,
      model: row.model,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    })
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error)
    return toErrorResponse(error)
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(request)
    const { id } = await context.params
    idParam.parse(id)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      throw new ApiError(400, 'BAD_JSON', 'Expected JSON body')
    }

    const parsed = letterPatchSchema.parse(body)

    const db = getDb()
    const existing = await getLetterForUser(db, id, auth.sub)

    if (!existing) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Letter not found' } }, { status: 404 })
    }

    const tier = await requireUserTier(db, auth.sub)
    const draftPatch =
      parsed.draft !== undefined
        ? applyTierRestrictionsToLetterDraft(parsed.draft as LetterDraft, tier)
        : undefined

    const kindPatch =
      draftPatch?.kind !== undefined && draftPatch.kind !== null ? draftPatch.kind : undefined

    await updateLetterForUser(db, id, auth.sub, {
      ...(parsed.title !== undefined ? { title: parsed.title } : {}),
      ...(draftPatch !== undefined ? { draft: draftPatch } : {}),
      ...(kindPatch !== undefined ? { kind: kindPatch } : {}),
      ...(parsed.status !== undefined ? { status: parsed.status } : {}),
      ...(parsed.generatedSubject !== undefined ? { generatedSubject: parsed.generatedSubject } : {}),
      ...(parsed.generatedLines !== undefined ? { generatedLines: parsed.generatedLines } : {}),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error)
    return toErrorResponse(error)
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(request)
    const { id } = await context.params
    idParam.parse(id)

    const db = getDb()
    const deleted = await deleteLetterForUser(db, id, auth.sub)

    if (!deleted.length) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Letter not found' } }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error)
    return toErrorResponse(error)
  }
}
