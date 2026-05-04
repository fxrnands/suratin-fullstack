import { z } from 'zod'

import type { LetterDraft } from '@/components/letter-builder/types'
import {
  IZIN_LEAVE_TYPE_IDS,
  LETTER_KINDS,
  PENGA_DUAN_DESIRED_OUTCOME_IDS,
  PENGA_DUAN_PROBLEM_CATEGORY_IDS,
  PENGA_DUAN_URGENCY_IDS,
} from '@/components/letter-builder/types'
import { isDraftComplete } from '@/components/letter-builder/validation'

const kindEnum = z.enum(LETTER_KINDS)

function bounded(max: number) {
  return z.string().max(max)
}

export const letterDraftSchema = z.object({
  kind: kindEnum.nullable(),
  fullName: bounded(200),
  tone: z.enum(['formal', 'tegas', 'persuasif']),
  outputLanguage: z.enum(['id', 'en']).default('id'),
  lamaran: z.object({
    position: bounded(500),
    company: bounded(500),
    education: bounded(2000),
    skills: bounded(2000),
    birthPlaceDate: bounded(200).default(''),
    phone: bounded(80).default(''),
    email: bounded(320).default(''),
    includeEmailInLetter: z.boolean().default(false),
  }),
  resign: z.object({
    company: bounded(500),
    position: bounded(300),
    effectiveDate: bounded(100),
    reason: bounded(2000),
  }),
  permohonan: z.object({
    institution: bounded(500),
    purpose: bounded(1000),
    whatFor: bounded(2000).default(''),
    details: bounded(4000),
  }),
  izin: z.object({
    recipientName: bounded(200),
    institution: bounded(500),
    leaveType: z
      .string()
      .max(20)
      .refine((s) => s === '' || (IZIN_LEAVE_TYPE_IDS as readonly string[]).includes(s)),
    reason: bounded(2000),
    dateFrom: bounded(10),
    dateTo: bounded(10),
    employeeId: bounded(80).default(''),
    additionalDetails: bounded(1200).default(''),
    hasAttachment: z.boolean().default(false),
    attachmentNote: bounded(400).default(''),
  }),
  pengaduan: z.object({
    institution: bounded(500),
    divisionOrBranch: bounded(300).default(''),
    contactPhone: bounded(80).default(''),
    contactEmail: bounded(320).default(''),
    problemCategory: z
      .string()
      .max(40)
      .refine((s) => s === '' || (PENGA_DUAN_PROBLEM_CATEGORY_IDS as readonly string[]).includes(s)),
    issue: bounded(8000),
    impact: bounded(2000).default(''),
    transactionOrCustomerId: bounded(300).default(''),
    incidentDate: bounded(120).default(''),
    desiredOutcome: z
      .string()
      .max(40)
      .refine((s) => s === '' || (PENGA_DUAN_DESIRED_OUTCOME_IDS as readonly string[]).includes(s)),
    desiredOutcomeOther: bounded(2000).default(''),
    resolution: bounded(2000).default(''),
    urgency: z.enum(PENGA_DUAN_URGENCY_IDS as unknown as [string, ...string[]]).default('normal'),
    priorContact: z.enum(['tidak', 'ya']).default('tidak'),
    priorContactResponse: bounded(2000).default(''),
  }),
})

export const letterGenerateBodySchema = z.object({
  draft: letterDraftSchema.superRefine((draft, ctx) => {
    if (!draft.kind) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'kind is required', path: ['kind'] })
      return
    }
    if (!isDraftComplete(draft as LetterDraft)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Draft is incomplete for the selected letter type',
      })
    }
  }),
})

export const passwordSchema = z
  .string()
  .min(8)
  .max(128)
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[0-9]/, 'Must contain a digit')

export const registerSchema = z.object({
  email: z.string().trim().email().max(320),
  password: passwordSchema,
  name: z.string().trim().min(2).max(120),
})

export const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(128),
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
})

export const logoutSchema = refreshSchema

export const letterCreateSchema = z
  .object({
    title: z.string().trim().max(200).optional(),
    draft: letterDraftSchema,
  })
  .superRefine((body, ctx) => {
    if (!body.draft.kind) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'draft.kind is required to save a letter',
        path: ['draft', 'kind'],
      })
    }
  })

export const letterPatchSchema = z
  .object({
    title: z.string().trim().max(200).optional(),
    draft: letterDraftSchema.optional(),
    status: z.enum(['draft', 'generated']).optional(),
    generatedSubject: z.string().max(500).optional(),
    generatedLines: z.array(z.string()).optional(),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: 'At least one field is required',
  })
