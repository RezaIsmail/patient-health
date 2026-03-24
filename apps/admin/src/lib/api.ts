import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { v4 as uuidv4 } from 'uuid'

// Avoid circular dependency: authStore → api → authStore
let _getAuthState: (() => {
  accessToken: string | null
  refreshToken: string | null
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void
}) | null = null

export function registerAuthStateGetter(
  getter: () => {
    accessToken: string | null
    refreshToken: string | null
    setTokens: (accessToken: string, refreshToken: string) => void
    clearAuth: () => void
  }
) {
  _getAuthState = getter
}

function getAuthState() {
  if (!_getAuthState) {
    return { accessToken: null, refreshToken: null, setTokens: () => {}, clearAuth: () => {} }
  }
  return _getAuthState()
}

// ─── Axios instance ───────────────────────────────────────────────────────────

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

// ── Request interceptor ────────────────────────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = getAuthState()

  if (accessToken && config.headers) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }

  if (config.headers) {
    config.headers['x-correlation-id'] = uuidv4()
  }

  return config
})

// ── Response interceptor ───────────────────────────────────────────────────────
let isRefreshing = false
let refreshQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      getAuthState().clearAuth()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            resolve(api(originalRequest))
          },
          reject,
        })
      })
    }

    isRefreshing = true
    const { refreshToken, setTokens, clearAuth } = getAuthState()

    try {
      const { data } = await axios.post<{ accessToken: string; expiresIn: number }>(
        '/api/auth/auth/refresh',
        { refreshToken },
        { headers: { 'x-correlation-id': uuidv4() } }
      )

      const newToken = data.accessToken
      setTokens(newToken, refreshToken ?? '')

      refreshQueue.forEach(({ resolve }) => resolve(newToken))
      refreshQueue = []

      originalRequest.headers['Authorization'] = `Bearer ${newToken}`
      return api(originalRequest)
    } catch (refreshError) {
      refreshQueue.forEach(({ reject }) => reject(refreshError))
      refreshQueue = []
      clearAuth()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)
