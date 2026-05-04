import { toast } from 'sonner'

/** Thrown when `/api/v1/auth/*` returns a non-success JSON body (client-side). */
export class AuthHttpError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown) {
    super(`HTTP ${status}`)
    this.name = 'AuthHttpError'
    this.status = status
    this.body = body
  }
}

type ApiErrorJson = {
  error?: {
    code?: string
    message?: string
    issues?: {
      fieldErrors?: Record<string, string[] | undefined>
      formErrors?: string[]
    }
  }
}

const TITLE_BY_CODE: Record<string, string> = {
  EMAIL_EXISTS: 'Email sudah terdaftar',
  INVALID_CREDENTIALS: 'Email atau kata sandi salah',
  VALIDATION_ERROR: 'Periksa data yang Anda isi',
  BAD_JSON: 'Format permintaan tidak valid',
  AUTH_NOT_CONFIGURED: 'Server belum dikonfigurasi',
  DATABASE_UNAVAILABLE: 'Database tidak terhubung',
  REGISTER_FAILED: 'Pendaftaran gagal',
  INTERNAL_ERROR: 'Terjadi kesalahan di server',
}

function validationDescription(issues: NonNullable<ApiErrorJson['error']>['issues']): string {
  if (!issues) return ''
  const parts: string[] = []
  const labels: Record<string, string> = {
    email: 'Email',
    password: 'Kata sandi',
    name: 'Nama',
    refreshToken: 'Sesi',
  }
  for (const [field, msgs] of Object.entries(issues.fieldErrors ?? {})) {
    if (!msgs?.length) continue
    const label = labels[field] ?? field
    parts.push(`${label}: ${msgs.join(', ')}`)
  }
  for (const msg of issues.formErrors ?? []) {
    if (msg) parts.push(msg)
  }
  return parts.join(' · ')
}

export function toastAuthHttpFailure(status: number, json: unknown): void {
  const body = json as ApiErrorJson
  const err = body?.error

  if (!err) {
    toast.error(status >= 500 ? 'Kesalahan server' : 'Permintaan gagal', {
      description:
        status >= 500
          ? `Server mengembalikan status ${status}. Coba lagi atau hubungi dukungan jika berlanjut.`
          : `Status ${status}`,
    })
    return
  }

  const title =
    (err.code && TITLE_BY_CODE[err.code]) ??
    err.message ??
    (status >= 500 ? 'Terjadi kesalahan' : 'Permintaan ditolak')

  let description = ''

  if (err.code === 'VALIDATION_ERROR' && err.issues) {
    description = validationDescription(err.issues)
    if (!description && err.message) description = err.message
  } else if (err.code === 'EMAIL_EXISTS') {
    description = 'Gunakan email lain atau masuk jika ini akun Anda.'
  } else if (err.code === 'INVALID_CREDENTIALS') {
    description = 'Periksa email dan kata sandi, lalu coba lagi.'
  } else if (err.message && err.message !== title) {
    description = err.message
  }

  if (description) {
    toast.error(title, { description, duration: err.code === 'VALIDATION_ERROR' ? 9000 : 6500 })
  } else {
    toast.error(title)
  }
}

export function toastAuthCaughtError(error: unknown): void {
  if (error instanceof AuthHttpError) {
    toastAuthHttpFailure(error.status, error.body)
    return
  }
  toast.error('Terjadi kesalahan', {
    description: error instanceof Error ? error.message : 'Silakan coba lagi.',
  })
}
