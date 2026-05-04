'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { parseUserTier, type UserTierId } from '@/lib/auth/user-tier'
import { AuthHttpError } from '@/lib/client/auth-http-error'
import { accessTokenExpiresWithin, decodeJwtExpiryUnix } from '@/lib/client/jwt-exp'

const STORAGE_ACCESS = 'suratin_access_token'
const STORAGE_REFRESH = 'suratin_refresh_token'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  tier: UserTierId
}

function normalizeAuthUser(raw: AuthUser): AuthUser {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    tier: parseUserTier((raw as { tier?: string }).tier),
  }
}

interface AuthContextValue {
  user: AuthUser | null
  accessToken: string | null
  hydrated: boolean
  refreshSession: () => Promise<string | null>
  login: (email: string, password: string) => Promise<void>
  register: (input: { email: string; password: string; name: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshTokenState, setRefreshTokenState] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const refreshInflightRef = useRef<Promise<{ accessToken: string; refreshToken: string } | null> | null>(
    null,
  )

  const clearTokens = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_ACCESS)
      sessionStorage.removeItem(STORAGE_REFRESH)
    } catch {
      /* ignore */
    }
    setAccessToken(null)
    setRefreshTokenState(null)
    setUser(null)
  }, [])

  const persistTokens = useCallback((access: string, refresh: string) => {
    try {
      sessionStorage.setItem(STORAGE_ACCESS, access)
      sessionStorage.setItem(STORAGE_REFRESH, refresh)
    } catch {
      /* ignore */
    }
    setAccessToken(access)
    setRefreshTokenState(refresh)
  }, [])

  const performRefreshRotation = useCallback(async (): Promise<{
    accessToken: string
    refreshToken: string
  } | null> => {
    if (refreshInflightRef.current) return refreshInflightRef.current

    const run = async (): Promise<{ accessToken: string; refreshToken: string } | null> => {
      let refresh: string | null = refreshTokenState
      if (!refresh && typeof sessionStorage !== 'undefined') {
        try {
          refresh = sessionStorage.getItem(STORAGE_REFRESH)
        } catch {
          /* ignore */
        }
      }
      if (!refresh) return null

      const res = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      })
      const data = (await res.json().catch(() => null)) as {
        accessToken?: string
        refreshToken?: string
      } | null

      if (!res.ok || !data?.accessToken || !data?.refreshToken) {
        clearTokens()
        return null
      }

      persistTokens(data.accessToken, data.refreshToken)
      return { accessToken: data.accessToken, refreshToken: data.refreshToken }
    }

    const promise = run().finally(() => {
      if (refreshInflightRef.current === promise) refreshInflightRef.current = null
    })
    refreshInflightRef.current = promise
    return promise
  }, [refreshTokenState, persistTokens, clearTokens])

  const fetchMe = useCallback(
    async (token: string, attemptRefresh = true) => {
      const load = async (t: string, allowRefresh: boolean) => {
        const res = await fetch('/api/v1/users/me', {
          headers: { Authorization: `Bearer ${t}` },
        })
        if (res.ok) {
          const data = (await res.json()) as AuthUser
          setUser(normalizeAuthUser(data))
          return
        }
        if (res.status === 401 && allowRefresh) {
          const rotated = await performRefreshRotation()
          if (rotated) {
            await load(rotated.accessToken, false)
            return
          }
        }
        clearTokens()
      }
      await load(token, attemptRefresh)
    },
    [clearTokens, performRefreshRotation],
  )

  const fetchMeRef = useRef(fetchMe)
  fetchMeRef.current = fetchMe
  const performRefreshRotationRef = useRef(performRefreshRotation)
  performRefreshRotationRef.current = performRefreshRotation

  useLayoutEffect(() => {
    let access: string | null = null
    let refresh: string | null = null
    try {
      access = sessionStorage.getItem(STORAGE_ACCESS)
      refresh = sessionStorage.getItem(STORAGE_REFRESH)
    } catch {
      /* ignore */
    }
    setRefreshTokenState(refresh)
    setAccessToken(access)

    void (async () => {
      try {
        if (access) {
          await fetchMeRef.current(access)
        } else if (refresh) {
          const rotated = await performRefreshRotationRef.current()
          if (rotated) await fetchMeRef.current(rotated.accessToken, false)
        }
      } finally {
        setHydrated(true)
      }
    })()
  }, [])

  const refreshSession = useCallback(async (): Promise<string | null> => {
    const rotated = await performRefreshRotation()
    if (!rotated) return null
    await fetchMe(rotated.accessToken, false)
    return rotated.accessToken
  }, [performRefreshRotation, fetchMe])

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return
    if (!accessToken) return

    const exp = decodeJwtExpiryUnix(accessToken)
    if (!exp) return

    const skewMs = 90_000
    const msUntil = exp * 1000 - Date.now() - skewMs

    const tick = () => void refreshSession()

    if (msUntil <= 0) {
      void tick()
      return
    }

    const id = window.setTimeout(tick, msUntil)
    return () => window.clearTimeout(id)
  }, [hydrated, accessToken, refreshSession])

  useEffect(() => {
    if (!hydrated || typeof document === 'undefined') return
    if (!accessToken) return

    const onVisibility = () => {
      if (document.visibilityState !== 'visible') return
      if (accessTokenExpiresWithin(accessToken, 120)) void refreshSession()
    }

    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [hydrated, accessToken, refreshSession])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = (await res.json().catch(() => null)) as {
        accessToken?: string
        refreshToken?: string
        user?: AuthUser
        error?: { message?: string; code?: string }
      } | null
      if (!res.ok || !data?.accessToken || !data.refreshToken || !data.user) {
        throw new AuthHttpError(res.status, data ?? { error: { message: res.statusText } })
      }
      persistTokens(data.accessToken, data.refreshToken)
      setUser(normalizeAuthUser(data.user))
    },
    [persistTokens],
  )

  const register = useCallback(
    async (input: { email: string; password: string; name: string }) => {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = (await res.json().catch(() => null)) as {
        accessToken?: string
        refreshToken?: string
        user?: AuthUser
        error?: { message?: string; code?: string }
      } | null
      if (!res.ok || !data?.accessToken || !data.refreshToken || !data.user) {
        throw new AuthHttpError(res.status, data ?? { error: { message: res.statusText } })
      }
      persistTokens(data.accessToken, data.refreshToken)
      setUser(normalizeAuthUser(data.user))
    },
    [persistTokens],
  )

  const logout = useCallback(async () => {
    const refresh =
      refreshTokenState ??
      (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(STORAGE_REFRESH) : null)
    if (refresh) {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      }).catch(() => {})
    }
    clearTokens()
  }, [refreshTokenState, clearTokens])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      hydrated,
      refreshSession,
      login,
      register,
      logout,
    }),
    [user, accessToken, hydrated, refreshSession, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
