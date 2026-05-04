import { and, desc, eq } from 'drizzle-orm'

import type { Database } from '@/lib/db/types'
import { letters } from '@/lib/db/schema'

export async function listLetterSummariesForUser(
  db: Database,
  userId: string,
  limit: number,
  offset: number,
) {
  return db
    .select({
      id: letters.id,
      title: letters.title,
      kind: letters.kind,
      status: letters.status,
      updatedAt: letters.updatedAt,
      createdAt: letters.createdAt,
    })
    .from(letters)
    .where(eq(letters.userId, userId))
    .orderBy(desc(letters.updatedAt))
    .limit(limit)
    .offset(offset)
}

export async function getLetterForUser(db: Database, letterId: string, userId: string) {
  const [row] = await db
    .select()
    .from(letters)
    .where(and(eq(letters.id, letterId), eq(letters.userId, userId)))
    .limit(1)

  return row ?? null
}

export async function insertLetterForUser(
  db: Database,
  row: {
    userId: string
    title: string | null
    kind: string
    draft: unknown
    status: string
  },
) {
  const [created] = await db
    .insert(letters)
    .values({
      userId: row.userId,
      title: row.title,
      kind: row.kind,
      draft: row.draft,
      status: row.status,
    })
    .returning({
      id: letters.id,
      createdAt: letters.createdAt,
      updatedAt: letters.updatedAt,
    })

  return created ?? null
}

export async function updateLetterForUser(
  db: Database,
  letterId: string,
  userId: string,
  patch: {
    title?: string | null
    draft?: unknown
    kind?: string
    status?: string
    generatedSubject?: string | null
    generatedLines?: string[] | null
  },
) {
  await db
    .update(letters)
    .set({
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.draft !== undefined ? { draft: patch.draft } : {}),
      ...(patch.kind !== undefined ? { kind: patch.kind } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.generatedSubject !== undefined ? { generatedSubject: patch.generatedSubject } : {}),
      ...(patch.generatedLines !== undefined ? { generatedLines: patch.generatedLines } : {}),
      updatedAt: new Date(),
    })
    .where(and(eq(letters.id, letterId), eq(letters.userId, userId)))
}

export async function deleteLetterForUser(db: Database, letterId: string, userId: string) {
  const deleted = await db
    .delete(letters)
    .where(and(eq(letters.id, letterId), eq(letters.userId, userId)))
    .returning({ id: letters.id })

  return deleted
}
