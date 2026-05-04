import type { Database } from '@/lib/db/types'
import { marketingSections } from '@/lib/db/schema'

export type MarketingSectionRow = {
  sectionKey: string
  payload: unknown
}

export async function selectAllMarketingSections(db: Database): Promise<MarketingSectionRow[]> {
  const rows = await db.select().from(marketingSections)
  return rows.map((r) => ({
    sectionKey: r.sectionKey,
    payload: r.payload,
  }))
}
