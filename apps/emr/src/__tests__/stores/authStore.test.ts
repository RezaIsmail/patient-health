import { vi, describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'

// ─── Mock the api module ──────────────────────────────────────────────────────
// Must be hoisted before importing the store (which imports api at module load)

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resetStore() {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  })
}

const fakeTokens = {
  data: { accessToken: 'access-token-abc', refreshToken: 'refresh-token-xyz', expiresIn: 900 },
}

const fakeUser = {
  data: {
    id: 'user-001',
    email: 'doc@clinic.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'physician' as const,
    permissions: ['patient:read', 'chart:read'],
  },
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('EMR authStore', () => {
  beforeEach(() => {
    resetStore()
  })

  describe('initial state', () => {
    it('starts unauthenticated with no tokens or user', () => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.accessToken).toBeNull()
      expect(state.refreshToken).toBeNull()
      expect(state.user).toBeNull()
    })
  })

  describe('login()', () => {
    it('sets tokens and user on successful login', async () => {
      mockApi.post.mockResolvedValueOnce(fakeTokens)
      mockApi.get.mockResolvedValueOnce(fakeUser)

      await act(async () => {
        await useAuthStore.getState().login('doc@clinic.com', 'password123')
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.accessToken).toBe('access-token-abc')
      expect(state.refreshToken).toBe('refresh-token-xyz')
      expect(state.user?.email).toBe('doc@clinic.com')
      expect(state.user?.role).toBe('physician')
    })

    it('calls login endpoint with email and password', async () => {
      mockApi.post.mockResolvedValueOnce(fakeTokens)
      mockApi.get.mockResolvedValueOnce(fakeUser)

      await act(async () => {
        await useAuthStore.getState().login('doc@clinic.com', 'securepass')
      })

      expect(mockApi.post).toHaveBeenCalledWith(
        '/api/auth/auth/login',
        { email: 'doc@clinic.com', password: 'securepass' }
      )
    })

    it('fetches user profile after obtaining tokens', async () => {
      mockApi.post.mockResolvedValueOnce(fakeTokens)
      mockApi.get.mockResolvedValueOnce(fakeUser)

      await act(async () => {
        await useAuthStore.getState().login('doc@clinic.com', 'password123')
      })

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/auth/auth/me',
        expect.objectContaining({ headers: { Authorization: 'Bearer access-token-abc' } })
      )
    })

    it('throws when the login API call fails', async () => {
      mockApi.post.mockRejectedValueOnce(new Error('Network error'))

      await expect(
        act(async () => {
          await useAuthStore.getState().login('doc@clinic.com', 'wrong')
        })
      ).rejects.toThrow('Network error')

      // State should remain unauthenticated
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('logout()', () => {
    it('clears all auth state after logout', async () => {
      // Set up authenticated state
      useAuthStore.setState({
        user: fakeUser.data,
        accessToken: 'access-token-abc',
        refreshToken: 'refresh-token-xyz',
        isAuthenticated: true,
      })

      mockApi.post.mockResolvedValueOnce({})

      await act(async () => {
        await useAuthStore.getState().logout()
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.accessToken).toBeNull()
      expect(state.refreshToken).toBeNull()
      expect(state.user).toBeNull()
    })

    it('calls logout endpoint with the current refresh token', async () => {
      useAuthStore.setState({
        user: fakeUser.data,
        accessToken: 'access-token-abc',
        refreshToken: 'refresh-token-xyz',
        isAuthenticated: true,
      })

      mockApi.post.mockResolvedValueOnce({})

      await act(async () => {
        await useAuthStore.getState().logout()
      })

      expect(mockApi.post).toHaveBeenCalledWith(
        '/api/auth/auth/logout',
        { refreshToken: 'refresh-token-xyz' }
      )
    })

    it('clears auth state even if the logout API call fails', async () => {
      useAuthStore.setState({
        user: fakeUser.data,
        accessToken: 'access-token-abc',
        refreshToken: 'refresh-token-xyz',
        isAuthenticated: true,
      })

      mockApi.post.mockRejectedValueOnce(new Error('Network error'))

      await act(async () => {
        await useAuthStore.getState().logout()
      })

      // clearAuth must still be called even on error
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })

    it('skips the logout API call when there is no refresh token', async () => {
      // No refresh token — store is already cleared
      await act(async () => {
        await useAuthStore.getState().logout()
      })

      expect(mockApi.post).not.toHaveBeenCalled()
    })
  })

  describe('setTokens()', () => {
    it('sets tokens and marks as authenticated', () => {
      useAuthStore.getState().setTokens('new-access', 'new-refresh')

      const state = useAuthStore.getState()
      expect(state.accessToken).toBe('new-access')
      expect(state.refreshToken).toBe('new-refresh')
      expect(state.isAuthenticated).toBe(true)
    })
  })

  describe('setUser()', () => {
    it('stores the user in state', () => {
      useAuthStore.getState().setUser(fakeUser.data)
      expect(useAuthStore.getState().user?.id).toBe('user-001')
    })
  })

  describe('clearAuth()', () => {
    it('resets all auth fields to their initial values', () => {
      useAuthStore.setState({
        user: fakeUser.data,
        accessToken: 'some-token',
        refreshToken: 'some-refresh',
        isAuthenticated: true,
      })

      useAuthStore.getState().clearAuth()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.accessToken).toBeNull()
      expect(state.refreshToken).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })
})
