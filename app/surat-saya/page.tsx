import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ACCESS_TOKEN_COOKIE_KEY } from '@/lib/auth/auth-cookies'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { getDb } from '@/lib/db'
import { listLetterSummariesForUser } from '@/lib/db/queries/letters'
import { Button } from '@/components/ui/button'

interface LetterSummary {
  id: string
  title: string | null
  kind: string
  status: string
  updatedAt: string
}

export default async function SuratSayaPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value ?? null
  if (!accessToken) redirect('/login')

  const auth = await verifyAccessToken(accessToken).catch(() => redirect('/login'))

  const db = getDb()
  const rows = await listLetterSummariesForUser(db, auth.sub, 50, 0)
  const items: LetterSummary[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    kind: row.kind,
    status: row.status,
    updatedAt: row.updatedAt.toISOString(),
  }))

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Surat saya</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Riwayat draft dan surat yang disimpan untuk {auth.email}.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" type="button">
          <Link href="/surat-saya">Muat ulang</Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 bg-card/40 px-6 py-12 text-center">
          <p className="text-muted-foreground">Belum ada surat tersimpan.</p>
          <Button asChild className="mt-6">
            <Link href="/buat-surat">Buat surat baru</Link>
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-border/60 rounded-xl border border-border/60 bg-card/40">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">
                  {item.title?.trim() || `Surat ${item.kind}`}
                </p>
                <p className="text-xs capitalize text-muted-foreground">
                  {item.kind.replace(/-/g, ' ')} · {item.status}
                  {' · '}
                  {new Date(item.updatedAt).toLocaleString('id-ID')}
                </p>
              </div>
              <Button asChild variant="secondary" size="sm">
                <Link href="/buat-surat">Buat / lanjut di editor</Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
