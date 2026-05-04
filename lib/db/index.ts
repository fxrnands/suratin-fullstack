import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from '@/lib/db/schema'
import type { Database } from '@/lib/db/types'
import { ApiError } from '@/lib/http/api-error'

export type { Database } from '@/lib/db/types'

const globalForDb = globalThis as unknown as {
  suratinSql?: postgres.Sql
}

function createSql(url: string) {
  return postgres(url, {
    max: 10,
    prepare: false,
  })
}

export function getSql(): postgres.Sql {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new ApiError(503, 'DATABASE_UNAVAILABLE', 'DATABASE_URL is not set')
  }
  if (!globalForDb.suratinSql) {
    globalForDb.suratinSql = createSql(url)
  }
  return globalForDb.suratinSql
}

export function getDb(): Database {
  const sql = getSql()
  return drizzle(sql, { schema })
}
