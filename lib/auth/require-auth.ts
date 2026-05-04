import { getAccessTokenFromRequestCookie } from '@/lib/auth/auth-cookies'
import { getBearerToken } from '@/lib/auth/bearer'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { ApiError } from '@/lib/http/api-error'

export async function requireAuth(request: Request) {
  const token = getBearerToken(request) ?? getAccessTokenFromRequestCookie(request)
  if (!token) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Missing bearer token')
  }
  return verifyAccessToken(token)
}
