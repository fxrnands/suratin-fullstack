import type { NextResponse } from 'next/server'

export const ACCESS_TOKEN_COOKIE_KEY = 'suratin_access_token'
export const REFRESH_TOKEN_COOKIE_KEY = 'suratin_refresh_token'

interface AuthCookieInput {
  accessToken: string
  refreshToken: string
  accessExpiresIn: number
  refreshExpiresAt: string
}

function cookieHeaderValueByName(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null

  const entries = cookieHeader.split(';')
  for (const entry of entries) {
    const [rawKey, ...rawValueParts] = entry.trim().split('=')
    if (rawKey !== name) continue
    const rawValue = rawValueParts.join('=').trim()
    if (!rawValue) return null
    try {
      return decodeURIComponent(rawValue)
    } catch {
      return rawValue
    }
  }

  return null
}

export function getAccessTokenFromRequestCookie(request: Request): string | null {
  return cookieHeaderValueByName(request.headers.get('cookie'), ACCESS_TOKEN_COOKIE_KEY)
}

export function getRefreshTokenFromRequestCookie(request: Request): string | null {
  return cookieHeaderValueByName(request.headers.get('cookie'), REFRESH_TOKEN_COOKIE_KEY)
}

export function setAuthCookies(response: NextResponse, input: AuthCookieInput) {
  response.cookies.set(ACCESS_TOKEN_COOKIE_KEY, input.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.max(0, input.accessExpiresIn),
  })

  response.cookies.set(REFRESH_TOKEN_COOKIE_KEY, input.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(input.refreshExpiresAt),
  })
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE_KEY, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  response.cookies.set(REFRESH_TOKEN_COOKIE_KEY, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}
