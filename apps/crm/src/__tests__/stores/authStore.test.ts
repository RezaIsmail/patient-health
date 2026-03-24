import { vi, describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'

vi.mock('../../lib/api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
  registerAuthStateGetter: vi.fn(),
}))

import { useAuthStore } from '../../stores/authStore'
import { api } from '../../lib/api'

const mockApi = api as { post: ReturnType<typeof vi.fn>; get: ReturnType<typeof vi.fn> }

function resetStore() {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  })
}

const fakeTokens = {
  data: { accessToken: 'crm-access-token', refreshToken: 'crm-refresh-token', expiresIn: 900 },
}

const fakeUser = {
  data: {
    id: 'user-002',
    email: 'coordinator@clinic.com',
    firstName: 'Care',
    lastName: 'Manager',
    role: 'nurse' as const,
    permissions: ['patient:read'],
  },
}

describe('CRM authStore', () => {
  beforeEach(() => {
    resetStore()
  })

  describe('initial state', () => {
    it('starts unauthenticated with no tokens or user', () => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.accessToken).toBeNull()
      expect(state.user).toBeNull()
    })
  })

  describe('login()', () => {
    it('sets tokens and user on successful login', async () => {
      mockApi.post.mockResolvedValueOnce(fakeTokens)
      mockApi.get.mockResolvedValueOnce(fakeUser)

      await act(async () => {
        await useAuthStore.getState().login('coordinator@clinic.com', 'password123')
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.accessToken).toBe('crm-access-token')
      expect(state.user?.email).toBe('coordinator@clinic.com')
    })

    it('throws when login fails', async () => {
      mockApi.post.mockRejectedValueOnce(new Error('Unauthorized'))

      await expect(
        act(async () => {
          await useAuthStore.getState().login('bad@clinic.com', 'wrong')
        })
      ).rejects.toThrow('Unauthorized')

      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('logout()', () => {
    it('clears auth state and calls logout endpoint', async () => {
      useAuthStore.setState({
        user: fakeUser.data,
        accessToken: 'crm-access-token',
        refreshToken: 'crm-refresh-token',
        isAuthenticated: true,
      })
      mockApi.post.mockResolvedValueOnce({})

      await act(async () => {
        await useAuthStore.getState().logout()
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
      expect(mockApi.post).toHaveBeenCalledWith('/api/auth/auth/logout', { refreshToken: 'crm-refresh-token' })
    })

    it('clears auth state even when logout API call fails', async () => {
      useAuthStore.setState({
        user: fakeUser.data,
        accessToken: 'crm-access-token',
        refreshToken: 'crm-refresh-token',
        isAuthenticated: true,
      })
      mockApi.post.mockRejectedValueOnce(new Error('Network error'))

      await act(async () => {
        await useAuthStore.getState().logout()
      })

      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('clearAuth()', () => {
    it('resets all auth fields', () => {
      useAuthStore.setState({
        user: fakeUser.data,
        accessToken: 'token',
        refreshToken: 'refresh',
        isAuthenticated: true,
      })

      useAuthStore.getState().clearAuth()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.accessToken).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('setTokens()', () => {
    it('stores tokens and sets isAuthenticated to true', () => {
      useAuthStore.getState().setTokens('new-access', 'new-refresh')
      const state = useAuthStore.getState()
      expect(state.accessToken).toBe('new-access')
      expect(state.isAuthenticated).toBe(true)
    })
  })
})
