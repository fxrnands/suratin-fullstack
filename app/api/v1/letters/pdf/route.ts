import { ZodError } from 'zod'

import { removeEmailLabelLinesFromLines } from '@/lib/letter/letter-presentation'
import { generateLetterPdfBytes } from '@/lib/pdf/generate-letter-pdf'
import { buildLetterPdfFilename, pdfAttachmentContentDisposition } from '@/lib/pdf/letter-pdf-filename'
import { ApiError } from '@/lib/http/api-error'
import { toErrorResponse } from '@/lib/http/route-error'
import { zodErrorResponse } from '@/lib/http/zod-error'
import { letterPdfExportSchema } from '@/lib/validation/letter-pdf-export'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      throw new ApiError(400, 'BAD_JSON', 'Expected JSON body')
    }

    const parsed = letterPdfExportSchema.parse(body)
    const linesForPdf =
      parsed.kind === 'resign' ? removeEmailLabelLinesFromLines(parsed.lines) : parsed.lines
    const pdfBytes = await generateLetterPdfBytes({
      kind: parsed.kind,
      subject: parsed.subject,
      lines: linesForPdf,
      outputLanguage: parsed.outputLanguage,
    })

    const filename = buildLetterPdfFilename(parsed.kind, parsed.fullName)

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'no-store',
        'Content-Disposition': pdfAttachmentContentDisposition(filename),
      },
    })
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error)
    return toErrorResponse(error)
  }
}
