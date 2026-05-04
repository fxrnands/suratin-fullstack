'use client'

import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/components/auth/auth-provider'
import { cn } from '@/lib/utils'

interface CreateLetterCtaButtonProps {
  label: string
  className?: string
}

export function CreateLetterCtaButton({ label, className }: CreateLetterCtaButtonProps) {
  const router = useRouter()
  const { user, hydrated } = useAuth()

  return (
    <button
      type="button"
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition hover:opacity-90',
        className,
      )}
      onClick={() => {
        const loginHref = `/login?next=${encodeURIComponent('/buat-surat')}`
        if (!hydrated) {
          router.push(loginHref)
          return
        }
        router.push(user ? '/buat-surat' : loginHref)
      }}
    >
      {label}
      <ChevronRight size={20} aria-hidden />
    </button>
  )
}
