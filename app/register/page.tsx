'use client'

import Link from 'next/link'
import { Suspense } from 'react'

import { useRegisterForm } from '@/app/register/use-register-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function RegisterForm() {
  const { name, setName, email, setEmail, password, setPassword, busy, handleSubmit } =
    useRegisterForm()

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Daftar</CardTitle>
        <CardDescription>Buat akun Suratin untuk menyimpan dan menghasilkan surat.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
          <div className="space-y-2">
            <Label htmlFor="name">Nama lengkap</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
              placeholder="Nama lengkap"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
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
              autoComplete="new-password"
              required
              placeholder="Minimal aman untuk akun Anda"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? 'Memproses…' : 'Daftar'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Masuk
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center bg-secondary/20 px-4 py-16">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-xl border border-border/60 bg-card px-6 py-12 text-center text-sm text-muted-foreground shadow-md">
            Memuat…
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  )
}
