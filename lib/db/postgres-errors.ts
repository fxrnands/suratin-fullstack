/** Walk `cause` chain — Drizzle / `postgres` often wrap `PostgresError` (code `23505`, etc.). */
export function getPgErrorCode(error: unknown): string | undefined {
  let current: unknown = error
  for (let i = 0; i < 8 && current; i++) {
    if (typeof current === 'object' && current !== null && 'code' in current) {
      const code = (current as { code: unknown }).code
      if (typeof code === 'string') return code
    }
    current =
      typeof current === 'object' && current !== null && 'cause' in current
        ? (current as { cause: unknown }).cause
        : undefined
  }
  return undefined
}
