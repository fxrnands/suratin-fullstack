import { eq } from 'drizzle-orm'

import type { Database } from '@/lib/db/types'
import { users } from '@/lib/db/schema'

export async function findUserByEmail(db: Database, email: string) {
  const normalized = email.toLowerCase()
  const [row] = await db.select().from(users).where(eq(users.email, normalized)).limit(1)
  return row ?? null
}

export async function findUserById(db: Database, userId: string) {
  const [row] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  return row ?? null
}

export async function insertUser(
  db: Database,
  values: {
    email: string
    passwordHash: string
    name: string | null
    tier?: 'free' | 'pro'
  },
) {
  const [inserted] = await db
    .insert(users)
    .values({
      email: values.email.toLowerCase(),
      passwordHash: values.passwordHash,
      name: values.name,
      tier: values.tier ?? 'free',
    })
    .returning({ id: users.id })

  return inserted ?? null
}
