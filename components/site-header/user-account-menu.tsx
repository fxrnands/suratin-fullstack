'use client'

import { Check, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useAuth, type AuthUser } from '@/components/auth/auth-provider'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { rememberLandingSectionScroll } from '@/lib/client/landing-section-scroll'
import { USER_TIER_IDS, USER_TIER_PROFILE, type UserTierId } from '@/lib/auth/user-tier'
import { cn } from '@/lib/utils'

function initialsFromUser(user: AuthUser): string {
  const fromName = user.name?.trim()
  const base = fromName || user.email
  const parts = base.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    const first = parts[0]?.[0]
    const last = parts[parts.length - 1]?.[0]
    if (first && last) return `${first}${last}`.toUpperCase()
  }
  const compact = parts[0] ?? user.email
  return compact.slice(0, 2).toUpperCase()
}

function openPricingUpgrade(router: ReturnType<typeof useRouter>) {
  rememberLandingSectionScroll('harga')
  router.push('/', { scroll: false })
}

export function UserAccountMenu() {
  const router = useRouter()
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full p-0.5 pr-1 outline-none ring-offset-background transition hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:pr-2"
          aria-label="Buka menu akun"
        >
          <Avatar className="size-9 border border-border/80">
            <AvatarFallback className="bg-primary/12 text-xs font-semibold text-primary">
              {initialsFromUser(user)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="hidden size-4 shrink-0 text-muted-foreground sm:block" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[17rem]">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium text-foreground">{user.name ?? user.email}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Paket
        </DropdownMenuLabel>
        {USER_TIER_IDS.map((tierId: UserTierId) => {
          const profile = USER_TIER_PROFILE[tierId]
          const active = user.tier === tierId
          const downgradeBlocked = tierId === 'free' && user.tier === 'pro'
          const upgradeRow = tierId === 'pro' && user.tier === 'free'

          return (
            <DropdownMenuItem
              key={tierId}
              disabled={active || downgradeBlocked}
              className={cn(
                'flex cursor-pointer flex-col items-stretch gap-0.5 py-2.5',
                'focus:bg-muted/90 focus:text-foreground data-highlighted:bg-muted/90 data-highlighted:text-foreground',
              )}
              onClick={() => {
                if (upgradeRow) openPricingUpgrade(router)
              }}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <span className="font-medium leading-tight">{profile.displayName}</span>
                {active ? (
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                ) : null}
              </div>
              <span className="text-xs font-normal text-muted-foreground">{profile.description}</span>
              {upgradeRow ? (
                <span className="text-xs font-medium text-primary">Lihat paket Pro →</span>
              ) : null}
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => void logout()}>
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
