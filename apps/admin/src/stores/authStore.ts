import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserDto } from '@patient-health/types'
import { api } from '../lib/api'

interface AuthState {
  user: UserDto | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: UserDto) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const tokensRes = await api.post<{
          accessToken: string
          refreshToken: string
          expiresIn: number
        }>('/api/auth/auth/login', { email, password })

        const { accessToken, refreshToken } = tokensRes.data
        set({ accessToken, refreshToken, isAuthenticated: true })

        const userRes = await api.get<UserDto>('/api/auth/auth/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        set({ user: userRes.data })
      },

      logout: async () => {
        const { refreshToken } = get()
        if (refreshToken) {
          await api.post('/api/auth/auth/logout', { refreshToken }).catch(() => null)
        }
        get().clearAuth()
      },

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken, isAuthenticated: true })
      },

      setUser: (user) => {
        set({ user })
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'ph-admin-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
