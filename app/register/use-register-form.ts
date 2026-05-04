'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, type FormEvent } from 'react'
import { toast } from 'sonner'

import { useAuth } from '@/components/auth/auth-provider'
import { toastAuthCaughtError } from '@/lib/client/auth-http-error'
import { sanitizeReturnPath } from '@/lib/client/sanitize-return-path'

export function useRegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnPath = sanitizeReturnPath(searchParams.get('next'))
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setBusy(true)
      try {
        await register({
          email,
          password,
          name: name.trim(),
        })
        toast.success('Akun berhasil dibuat')
        router.push(returnPath)
        router.refresh()
      } catch (error) {
        toastAuthCaughtError(error)
      } finally {
        setBusy(false)
      }
    },
    [email, name, password, register, returnPath, router],
  )

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    busy,
    handleSubmit,
  }
}
