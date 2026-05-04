'use client'

import Link from 'next/link'

import { useAuth } from '@/components/auth/auth-provider'
import { LandingNavLink } from '@/components/landing/landing-nav-link'
import { useSiteHeaderState } from '@/components/site-header/use-site-header-state'
import { UserAccountMenu } from '@/components/site-header/user-account-menu'

export function SiteHeader() {
  const { appShell, isScrolled, onSuratSaya } = useSiteHeaderState()
  const { user, hydrated } = useAuth()

  return (
    <header
      className={`sticky top-0 z-50 bg-background/80 backdrop-blur-sm print:hidden ${
        isScrolled
          ? 'border-b border-border/30 shadow-[0_8px_24px_rgba(15,23,42,0.08)]'
          : 'border-b border-transparent shadow-none'
      }`}
    >
      <nav
        className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 lg:px-8 xl:px-10"
        aria-label="Utama"
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            Suratin
          </Link>
          {appShell ? (
            <div className="flex flex-wrap items-center justify-end gap-4 sm:gap-6">
              <Link
                href="/surat-saya"
                className={
                  onSuratSaya
                    ? 'text-sm font-medium capitalize text-foreground'
                    : 'text-sm capitalize text-muted-foreground transition hover:text-foreground'
                }
                prefetch={false}
                aria-current={onSuratSaya ? 'page' : undefined}
              >
                surat saya
              </Link>
              {hydrated && user ? <UserAccountMenu /> : null}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-end gap-4 sm:gap-8">
              <LandingNavLink
                sectionId="cara-kerja"
                className="hidden text-sm text-muted-foreground transition hover:text-foreground sm:inline"
              >
                Cara Kerja
              </LandingNavLink>
              <LandingNavLink
                sectionId="harga"
                className="hidden text-sm text-muted-foreground transition hover:text-foreground sm:inline"
              >
                Harga
              </LandingNavLink>
              {hydrated && user ? (
                <UserAccountMenu />
              ) : (
                <Link
                  href="/register"
                  className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  Daftar
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
