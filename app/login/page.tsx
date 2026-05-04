'use client'

import Link from 'next/link'
import { Suspense } from 'react'

import { useLoginForm } from '@/app/login/use-login-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function LoginForm() {
  const { email, setEmail, password, setPassword, busy, handleSubmit } =
    useLoginForm()

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Masuk</CardTitle>
        <CardDescription>Gunakan email dan kata sandi akun Suratin Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Kata sandi</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? 'Memproses…' : 'Masuk'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
            Daftar
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center bg-secondary/20 px-4 py-16">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-xl border border-border/60 bg-card px-6 py-12 text-center text-sm text-muted-foreground shadow-md">
            Memuat…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
