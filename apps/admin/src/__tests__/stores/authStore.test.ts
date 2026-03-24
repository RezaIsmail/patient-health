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
  data: { accessToken: 'admin-access-token', refreshToken: 'admin-refresh-token', expiresIn: 900 },
}

const fakeUser = {
  data: {
    id: 'user-admin-001',
    email: 'sysadmin@clinic.com',
    firstName: 'System',
    lastName: 'Admin',
    role: 'admin' as const,
    permissions: ['*'],
  },
}

describe('Admin authStore', () => {
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
        await useAuthStore.getState().login('sysadmin@clinic.com', 'admin123')
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.accessToken).toBe('admin-access-token')
      expect(state.user?.role).toBe('admin')
    })

    it('throws when login API call fails', async () => {
      mockApi.post.mockRejectedValueOnce(new Error('Invalid credentials'))

      await expect(
        act(async () => {
          await useAuthStore.getState().login('sysadmin@clinic.com', 'wrong')
        })
      ).rejects.toThrow('Invalid credentials')

      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('logout()', () => {
    it('clears all auth state', async () => {
      useAuthStore.setState({
        user: fakeUser.data,
        accessToken: 'admin-access-token',
        refreshToken: 'admin-refresh-token',
        isAuthenticated: true,
      })
      mockApi.post.mockResolvedValueOnce({})

      await act(async () => {
        await useAuthStore.getState().logout()
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
    })

    it('does not call logout API when there is no refresh token', async () => {
      await act(async () => {
        await useAuthStore.getState().logout()
      })

      expect(mockApi.post).not.toHaveBeenCalled()
    })
  })

  describe('clearAuth()', () => {
    it('resets all auth fields to null', () => {
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
    it('stores tokens and marks as authenticated', () => {
      useAuthStore.getState().setTokens('tok-a', 'tok-r')
      expect(useAuthStore.getState().accessToken).toBe('tok-a')
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })
  })

  describe('setUser()', () => {
    it('stores the user in state', () => {
      useAuthStore.getState().setUser(fakeUser.data)
      expect(useAuthStore.getState().user?.id).toBe('user-admin-001')
    })
  })
})
