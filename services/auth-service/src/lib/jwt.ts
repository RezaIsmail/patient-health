import jwt from 'jsonwebtoken'
import type { UserRole } from '@patient-health/types'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret-change-in-prod'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret-change-in-prod'
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m'
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d'

export interface AccessTokenPayload {
  sub: string       // userId
  role: UserRole
  type: 'access'
  iat?: number
  exp?: number
}

export interface RefreshTokenPayload {
  sub: string       // userId
  type: 'refresh'
  iat?: number
  exp?: number
}

export function signAccessToken(userId: string, role: UserRole): string {
  const payload = { sub: userId, role, type: 'access' }
  return jwt.sign(payload, ACCESS_SECRET, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expiresIn: ACCESS_EXPIRES_IN as any,
  })
}

export function signRefreshToken(userId: string): string {
  const payload = { sub: userId, type: 'refresh' }
  return jwt.sign(payload, REFRESH_SECRET, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expiresIn: REFRESH_EXPIRES_IN as any,
  })
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload
  if (decoded.type !== 'access') {
    throw new Error('Invalid token type: expected access token')
  }
  return decoded
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload
  if (decoded.type !== 'refresh') {
    throw new Error('Invalid token type: expected refresh token')
  }
  return decoded
}

/**
 * Returns the number of seconds until the access token expires.
 * Converts the ACCESS_EXPIRES_IN string (e.g. '15m') to seconds.
 */
export function getAccessTokenTtlSeconds(): number {
  const raw = ACCESS_EXPIRES_IN
  const match = raw.match(/^(\d+)([smhd])$/)
  if (!match) return 900 // default 15 minutes
  const value = parseInt(match[1], 10)
  const unit = match[2]
  const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 }
  return value * (multipliers[unit] ?? 60)
}
