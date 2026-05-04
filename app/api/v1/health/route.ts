import { sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { getDb } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, database: 'not_configured' as const })
  }

  try {
    const db = getDb()
    await db.execute(sql`select 1`)
    return NextResponse.json({ ok: true, database: 'up' as const })
  } catch {
    return NextResponse.json({ ok: false, database: 'down' as const }, { status: 503 })
  }
}
