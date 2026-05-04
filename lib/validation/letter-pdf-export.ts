import { z } from 'zod'

import { LETTER_KINDS, OUTPUT_LANGUAGES } from '@/components/letter-builder/types'

const kindEnum = z.enum(LETTER_KINDS)
const outputLanguageEnum = z.enum(OUTPUT_LANGUAGES)

export const letterPdfExportSchema = z
  .object({
    kind: kindEnum,
    fullName: z.string().trim().min(2).max(120),
    subject: z.string().trim().min(1).max(400),
    lines: z.array(z.string()).min(1).max(160),
    outputLanguage: outputLanguageEnum.default('id'),
  })
  .superRefine((data, ctx) => {
    const chars = data.lines.reduce((acc, line) => acc + line.length, 0)
    if (chars > 48_000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Isi surat terlalu panjang untuk PDF',
        path: ['lines'],
      })
    }
  })

export type LetterPdfExportInput = z.infer<typeof letterPdfExportSchema>
