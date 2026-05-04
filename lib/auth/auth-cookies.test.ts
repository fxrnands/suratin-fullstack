import {
  ACCESS_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_KEY,
  getAccessTokenFromRequestCookie,
  getRefreshTokenFromRequestCookie,
} from '@/lib/auth/auth-cookies'

function makeRequest(cookieHeader: string) {
  return new Request('https://suratin.test', {
    headers: {
      cookie: cookieHeader,
    },
  })
}

describe('auth cookie readers', () => {
  it('extracts access and refresh token values from request cookies', () => {
    const request = makeRequest(
      `${ACCESS_TOKEN_COOKIE_KEY}=access-123; ${REFRESH_TOKEN_COOKIE_KEY}=refresh-123`,
    )

    expect(getAccessTokenFromRequestCookie(request)).toBe('access-123')
    expect(getRefreshTokenFromRequestCookie(request)).toBe('refresh-123')
  })

  it('returns null when cookie is missing', () => {
    const request = makeRequest('some_other_cookie=value')
    expect(getAccessTokenFromRequestCookie(request)).toBeNull()
    expect(getRefreshTokenFromRequestCookie(request)).toBeNull()
  })

  it('decodes URL-encoded cookie values', () => {
    const request = makeRequest(`${ACCESS_TOKEN_COOKIE_KEY}=access%20token`)
    expect(getAccessTokenFromRequestCookie(request)).toBe('access token')
  })
})
