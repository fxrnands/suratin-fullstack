import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function zodErrorResponse(error: ZodError) {
  return NextResponse.json(
    {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        issues: error.flatten(),
      },
    },
    { status: 400 },
  )
}
