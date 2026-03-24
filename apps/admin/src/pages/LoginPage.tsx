import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@patient-health/ui'
import { useAuthStore } from '../stores/authStore'
import type { ApiError } from '@patient-health/types'
import { isAxiosError } from 'axios'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      await login(credentials.email, credentials.password)
    },
    onSuccess: () => {
      navigate('/', { replace: true })
    },
  })

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {}
    if (!email) errors.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address'
    if (!password) errors.password = 'Password is required'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    loginMutation.mutate({ email, password })
  }

  function getErrorMessage(): string {
    const err = loginMutation.error
    if (!err) return ''
    if (isAxiosError(err) && err.response?.data) {
      const apiErr = err.response.data as ApiError
      return apiErr.message ?? 'Sign in failed. Please try again.'
    }
    return 'Unable to connect. Please check your network and try again.'
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Patient Health</h1>
          <p className="mt-0.5 text-xs font-medium tracking-widest text-gray-400 uppercase">
            Admin System
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Sign in to your account</h2>
          <p className="mb-6 text-sm text-gray-500">
            Enter your credentials to access the Admin System.
          </p>

          {loginMutation.isError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              <span className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500">✕</span>
              <p>{getErrorMessage()}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }))
                }}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                aria-invalid={!!fieldErrors.email}
                placeholder="you@example.com"
                className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 ${
                  fieldErrors.email
                    ? 'border-red-400 focus:ring-red-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              {fieldErrors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }))
                  }}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                  aria-invalid={!!fieldErrors.password}
                  placeholder="••••••••"
                  className={`w-full rounded-md border px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 ${
                    fieldErrors.password
                      ? 'border-red-400 focus:ring-red-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="password-error" className="mt-1 text-xs text-red-600" role="alert">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700"
              size="default"
              isLoading={loginMutation.isPending}
              disabled={loginMutation.isPending}
            >
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Access is provisioned by your system administrator.
          <br />
          Contact IT support if you cannot log in.
        </p>
      </div>
    </div>
  )
}
