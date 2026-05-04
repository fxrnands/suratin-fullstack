import type { LetterDraft } from '@/components/letter-builder/types'

import type { Database } from '@/lib/db/types'
import { findUserById } from '@/lib/db/queries/users'
import { ApiError } from '@/lib/http/api-error'
import { parseUserTier, type UserTierId } from '@/lib/auth/user-tier'

/** Non‑Pro users always use formal tone in AI output and persisted drafts (cannot be bypassed via client). */
export const LETTER_TONE_FOR_NON_PRO = 'formal' as const satisfies LetterDraft['tone']

/** Non‑Pro output is always Indonesian (English output is Pro-only). */
export const LETTER_OUTPUT_LANGUAGE_FOR_NON_PRO = 'id' as const satisfies LetterDraft['outputLanguage']

export async function requireUserTier(db: Database, userId: string): Promise<UserTierId> {
  const row = await findUserById(db, userId)
  if (!row) {
    throw new ApiError(404, 'USER_GONE', 'User not found')
  }
  return parseUserTier(row.tier)
}

export function applyTierToLetterDraftTone(draft: LetterDraft, tier: UserTierId): LetterDraft {
  if (tier === 'pro') return draft
  if (draft.tone === LETTER_TONE_FOR_NON_PRO) return draft
  return { ...draft, tone: LETTER_TONE_FOR_NON_PRO }
}

export function applyTierToLetterDraftOutputLanguage(draft: LetterDraft, tier: UserTierId): LetterDraft {
  if (tier === 'pro') return draft
  if (draft.outputLanguage === LETTER_OUTPUT_LANGUAGE_FOR_NON_PRO) return draft
  return { ...draft, outputLanguage: LETTER_OUTPUT_LANGUAGE_FOR_NON_PRO }
}

/** Apply all subscription-gated draft fields (tone, output language). Order is stable for callers. */
export function applyTierRestrictionsToLetterDraft(draft: LetterDraft, tier: UserTierId): LetterDraft {
  return applyTierToLetterDraftOutputLanguage(applyTierToLetterDraftTone(draft, tier), tier)
}
