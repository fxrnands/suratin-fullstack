import { getDb } from '@/lib/db'
import { selectAllMarketingSections } from '@/lib/db/queries/marketing'
import {
  MARKETING_SECTION_KEYS,
  type SerializedHomeBundle,
} from '@/lib/marketing/serialized-home'
import {
  hydrateHomeMarketing,
  mergeSerializedHome,
  type HydratedHomeContent,
} from '@/lib/marketing/hydrate-home'

function rowsToMergeRecord(rows: { sectionKey: string; payload: unknown }[]) {
  const record: Partial<Record<keyof SerializedHomeBundle, unknown>> = {}
  for (const row of rows) {
    if (!(MARKETING_SECTION_KEYS as readonly string[]).includes(row.sectionKey)) continue
    record[row.sectionKey as keyof SerializedHomeBundle] = row.payload
  }
  return record
}

/** Loads landing JSON from `marketing_sections`, merges into defaults, hydrates Lucide icons (server-only). */
export async function getHomePageContent(): Promise<HydratedHomeContent> {
  let mergeInput: Partial<Record<keyof SerializedHomeBundle, unknown>> = {}

  try {
    const db = getDb()
    const rows = await selectAllMarketingSections(db)
    mergeInput = rowsToMergeRecord(rows)
  } catch {
    /* Missing DATABASE_URL, unmigrated DB, or query errors — bundled defaults only. */
  }

  const merged = mergeSerializedHome(mergeInput)
  return hydrateHomeMarketing(merged)
}
