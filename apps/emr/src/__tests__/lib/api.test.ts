import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { api, registerAuthStateGetter } from '../../lib/api'

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('API Axios instance', () => {
  describe('configuration', () => {
    it('has the expected HTTP methods', () => {
      expect(typeof api.get).toBe('function')
      expect(typeof api.post).toBe('function')
      expect(typeof api.put).toBe('function')
      expect(typeof api.delete).toBe('function')
    })

    it('has a 30-second timeout', () => {
      expect(api.defaults.timeout).toBe(30_000)
    })

    it('sets Content-Type to application/json by default', () => {
      expect(api.defaults.headers['Content-Type']).toBe('application/json')
    })
  })
})

describe('registerAuthStateGetter', () => {
  it('accepts a state getter without throwing', () => {
    expect(() => {
      registerAuthStateGetter(() => ({
        accessToken: 'test-token',
        refreshToken: 'test-refresh',
        setTokens: vi.fn(),
        clearAuth: vi.fn(),
      }))
    }).not.toThrow()
  })
})

describe('Request interceptor', () => {
  beforeEach(() => {
    // Register a getter that returns a test token
    registerAuthStateGetter(() => ({
      accessToken: 'interceptor-test-token',
      refreshToken: 'refresh-token',
      setTokens: vi.fn(),
      clearAuth: vi.fn(),
    }))
  })

  afterEach(() => {
    // Reset to no token
    registerAuthStateGetter(() => ({
      accessToken: null,
      refreshToken: null,
      setTokens: vi.fn(),
      clearAuth: vi.fn(),
    }))
  })

  it('injects the Authorization header from the registered getter', async () => {
    // Build a config object and run it through the request interceptor
    const config = { headers: {} as Record<string, string>, url: '/test' }
    // Access the request interceptor handlers directly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interceptors = (api.interceptors.request as any).handlers
    const handler = interceptors.find((h: { fulfilled?: unknown }) => h?.fulfilled)
    const result = await handler.fulfilled(config)

    expect(result.headers['Authorization']).toBe('Bearer interceptor-test-token')
  })

  it('attaches an x-correlation-id UUID to every request', async () => {
    const config = { headers: {} as Record<string, string>, url: '/test' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interceptors = (api.interceptors.request as any).handlers
    const handler = interceptors.find((h: { fulfilled?: unknown }) => h?.fulfilled)
    const result = await handler.fulfilled(config)

    expect(result.headers['x-correlation-id']).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  })

  it('does not attach Authorization when no token is registered', async () => {
    registerAuthStateGetter(() => ({
      accessToken: null,
      refreshToken: null,
      setTokens: vi.fn(),
      clearAuth: vi.fn(),
    }))

    const config = { headers: {} as Record<string, string>, url: '/test' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interceptors = (api.interceptors.request as any).handlers
    const handler = interceptors.find((h: { fulfilled?: unknown }) => h?.fulfilled)
    const result = await handler.fulfilled(config)

    expect(result.headers['Authorization']).toBeUndefined()
  })
})
