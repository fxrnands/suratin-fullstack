import { ZodError } from 'zod'

import {
  letterPatchSchema,
  loginSchema,
  passwordSchema,
  refreshSchema,
  registerSchema,
} from '@/lib/validation/letter-draft'

describe('auth and patch validation schemas', () => {
  it('accepts strong passwords and rejects weak ones', () => {
    expect(passwordSchema.parse('StrongPass123')).toBe('StrongPass123')
    expect(() => passwordSchema.parse('weakpass')).toThrow(ZodError)
    expect(() => passwordSchema.parse('NOLOWER123')).toThrow(ZodError)
    expect(() => passwordSchema.parse('NoDigitPass')).toThrow(ZodError)
  })

  it('validates register and login payloads', () => {
    expect(
      registerSchema.parse({
        email: 'user@example.com',
        password: 'StrongPass123',
        name: 'Suratin User',
      }),
    ).toBeDefined()

    expect(
      loginSchema.parse({
        email: 'user@example.com',
        password: 'StrongPass123',
      }),
    ).toBeDefined()
  })

  it('requires refresh token minimum length', () => {
    expect(refreshSchema.parse({ refreshToken: '1234567890' })).toBeDefined()
    expect(() => refreshSchema.parse({ refreshToken: 'short' })).toThrow(ZodError)
  })

  it('requires at least one field for letter patch payload', () => {
    expect(() => letterPatchSchema.parse({})).toThrow(ZodError)
    expect(letterPatchSchema.parse({ status: 'draft' })).toBeDefined()
  })
})
