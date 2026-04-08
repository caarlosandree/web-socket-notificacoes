const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export const auth = {
  setAccessToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, token)
    }
  },

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ACCESS_TOKEN_KEY)
    }
    return null
  },

  setRefreshToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, token)
    }
  },

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    }
    return null
  },

  clear() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  },
}
