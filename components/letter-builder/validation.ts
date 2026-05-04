import type { LetterDraft, LetterKind } from '@/components/letter-builder/types'
import {
  IZIN_LEAVE_TYPE_IDS,
  PENGA_DUAN_DESIRED_OUTCOME_IDS,
  PENGA_DUAN_PROBLEM_CATEGORY_IDS,
} from '@/components/letter-builder/types'
import { areIzinDatesComplete } from '@/lib/letter/izin-dates'

function nonEmpty(value: string): boolean {
  return value.trim().length > 0
}

export function isDraftComplete(draft: LetterDraft): draft is LetterDraft & { kind: LetterKind } {
  if (!draft.kind || !nonEmpty(draft.fullName)) return false

  switch (draft.kind) {
    case 'lamaran':
      return (
        nonEmpty(draft.lamaran.position) &&
        nonEmpty(draft.lamaran.company) &&
        nonEmpty(draft.lamaran.education) &&
        nonEmpty(draft.lamaran.skills)
      )
    case 'resign':
      return (
        nonEmpty(draft.resign.company) &&
        nonEmpty(draft.resign.position) &&
        nonEmpty(draft.resign.effectiveDate)
      )
    case 'permohonan':
      return (
        nonEmpty(draft.permohonan.institution) &&
        nonEmpty(draft.permohonan.purpose) &&
        nonEmpty(draft.permohonan.whatFor) &&
        nonEmpty(draft.permohonan.details)
      )
    case 'izin': {
      const iz = draft.izin
      const leaveOk =
        iz.leaveType !== '' && (IZIN_LEAVE_TYPE_IDS as readonly string[]).includes(iz.leaveType)
      return (
        nonEmpty(iz.recipientName) &&
        nonEmpty(iz.institution) &&
        leaveOk &&
        nonEmpty(iz.reason) &&
        areIzinDatesComplete(iz)
      )
    }
    case 'pengaduan': {
      const peng = draft.pengaduan
      const categoryOk =
        peng.problemCategory !== '' &&
        (PENGA_DUAN_PROBLEM_CATEGORY_IDS as readonly string[]).includes(peng.problemCategory)
      const outcomeOk =
        peng.desiredOutcome !== '' &&
        (PENGA_DUAN_DESIRED_OUTCOME_IDS as readonly string[]).includes(peng.desiredOutcome)
      const outcomeOtherOk =
        peng.desiredOutcome !== 'lainnya' || nonEmpty(peng.desiredOutcomeOther)
      const priorOk = peng.priorContact !== 'ya' || nonEmpty(peng.priorContactResponse)
      return (
        nonEmpty(peng.institution) &&
        categoryOk &&
        nonEmpty(peng.issue) &&
        outcomeOk &&
        outcomeOtherOk &&
        priorOk
      )
    }
    default:
      return false
  }
}
