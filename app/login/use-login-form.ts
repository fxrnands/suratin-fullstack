'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, type FormEvent } from 'react'
import { toast } from 'sonner'

import { useAuth } from '@/components/auth/auth-provider'
import { toastAuthCaughtError } from '@/lib/client/auth-http-error'
import { sanitizeReturnPath } from '@/lib/client/sanitize-return-path'

export function useLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnPath = sanitizeReturnPath(searchParams.get('next'))
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setBusy(true)
      try {
        await login(email, password)
        toast.success('Selamat datang kembali')
        router.push(returnPath)
        router.refresh()
      } catch (error) {
        toastAuthCaughtError(error)
      } finally {
        setBusy(false)
      }
    },
    [email, login, password, returnPath, router],
  )

  return {
    email,
    setEmail,
    password,
    setPassword,
    busy,
    handleSubmit,
  }
}
