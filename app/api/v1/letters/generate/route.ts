import type { LetterDraft, LetterKind } from '@/components/letter-builder/types'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

import { applyTierRestrictionsToLetterDraft, requireUserTier } from '@/lib/auth/letter-tone-tier'
import { requireAuth } from '@/lib/auth/require-auth'
import { getDb } from '@/lib/db'
import { generateLetterWithGemini } from '@/lib/gemini/generate-letter'
import { ApiError } from '@/lib/http/api-error'
import { toErrorResponse } from '@/lib/http/route-error'
import { zodErrorResponse } from '@/lib/http/zod-error'
import { letterGenerateBodySchema } from '@/lib/validation/letter-draft'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      throw new ApiError(400, 'BAD_JSON', 'Expected JSON body')
    }

    const parsed = letterGenerateBodySchema.parse(body)
    const draft = parsed.draft
    if (!draft.kind) {
      throw new ApiError(400, 'KIND_REQUIRED', 'Letter kind is required')
    }

    const db = getDb()
    const tier = await requireUserTier(db, auth.sub)
    const completeDraft = applyTierRestrictionsToLetterDraft(
      draft as LetterDraft,
      tier,
    ) as LetterDraft & { kind: LetterKind }

    const generated = await generateLetterWithGemini(completeDraft)

    return NextResponse.json({
      subject: generated.subject,
      lines: generated.lines,
      model: generated.modelUsed,
    })
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error)
    return toErrorResponse(error)
  }
}
