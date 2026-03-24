import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import bcrypt from 'bcryptjs'
import { authRoutes } from '../../routes/auth'
import { signAccessToken, signRefreshToken } from '../../lib/jwt'

// ─── Prisma mock ──────────────────────────────────────────────────────────────
// jest.mock is hoisted — the factory must not reference variables declared below it.

jest.mock('../../lib/prisma', () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    refreshToken: {
      create: jest.fn().mockResolvedValue({}),
      findUnique: jest.fn(),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    auditLog: { create: jest.fn().mockResolvedValue({}) },
  },
}))

import { prisma } from '../../lib/prisma'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any

// ─── App factory ──────────────────────────────────────────────────────────────

async function buildApp() {
  const app = Fastify({ logger: false })
  await app.register(helmet, { contentSecurityPolicy: false })
  await app.register(cors, { origin: true, credentials: true })
  await app.register(rateLimit, { max: 1000, timeWindow: '1 minute' })
  await app.register(authRoutes)
  app.get('/health', async (_, reply) =>
    reply.status(200).send({ status: 'ok', service: 'auth-service', timestamp: new Date().toISOString() })
  )
  await app.ready()
  return app
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const PLAIN_PASSWORD = 'SecurePass123!'
let passwordHash: string

beforeAll(async () => {
  passwordHash = await bcrypt.hash(PLAIN_PASSWORD, 4) // low rounds for test speed
})

function makeActiveUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 'user-001',
    email: 'doc@clinic.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'physician',
    passwordHash,
    isActive: true,
    ...overrides,
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Auth routes', () => {
  let app: Awaited<ReturnType<typeof buildApp>>

  beforeAll(async () => {
    app = await buildApp()
  })

  afterAll(async () => {
    await app.close()
  })

  // ── GET /health ────────────────────────────────────────────────────────────

  describe('GET /health', () => {
    it('returns 200 with status ok — no auth required', async () => {
      const res = await app.inject({ method: 'GET', url: '/health' })
      expect(res.statusCode).toBe(200)
      expect(res.json()).toMatchObject({ status: 'ok', service: 'auth-service' })
    })
  })

  // ── POST /auth/login ───────────────────────────────────────────────────────

  describe('POST /auth/login', () => {
    it('returns 200 with access + refresh tokens for valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(makeActiveUser())

      const res = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { email: 'doc@clinic.com', password: PLAIN_PASSWORD },
      })

      expect(res.statusCode).toBe(200)
      const body = res.json()
      expect(typeof body.accessToken).toBe('string')
      expect(typeof body.refreshToken).toBe('string')
      expect(typeof body.expiresIn).toBe('number')
    })

    it('stores the refresh token in DB on successful login', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(makeActiveUser())

      await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { email: 'doc@clinic.com', password: PLAIN_PASSWORD },
      })

      expect(mockPrisma.refreshToken.create).toHaveBeenCalled()
    })

    it('returns 400 for invalid email format', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { email: 'not-an-email', password: PLAIN_PASSWORD },
      })

      expect(res.statusCode).toBe(400)
      expect(res.json()).toMatchObject({ statusCode: 400, error: 'Bad Request' })
    })

    it('returns 400 when password is empty', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { email: 'doc@clinic.com', password: '' },
      })

      expect(res.statusCode).toBe(400)
    })

    it('returns 400 when body fields are missing', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {},
      })

      expect(res.statusCode).toBe(400)
    })

    it('returns 401 when user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null)

      const res = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { email: 'unknown@clinic.com', password: PLAIN_PASSWORD },
      })

      expect(res.statusCode).toBe(401)
      expect(res.json()).toMatchObject({ statusCode: 401, error: 'Unauthorized' })
    })

    it('returns 401 for an inactive user account', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(makeActiveUser({ isActive: false }))

      const res = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { email: 'doc@clinic.com', password: PLAIN_PASSWORD },
      })

      expect(res.statusCode).toBe(401)
    })

    it('returns 401 for a wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(makeActiveUser())

      const res = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { email: 'doc@clinic.com', password: 'WrongPassword!' },
      })

      expect(res.statusCode).toBe(401)
    })

    it('echoes back the x-correlation-id header in error responses', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null)

      const res = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { email: 'none@test.com', password: 'pass' },
        headers: { 'x-correlation-id': 'trace-abc-123' },
      })

      expect(res.json().correlationId).toBe('trace-abc-123')
    })
  })

  // ── POST /auth/refresh ─────────────────────────────────────────────────────

  describe('POST /auth/refresh', () => {
    it('returns 200 with a new access token for a valid refresh token', async () => {
      const userId = 'user-001'
      const refreshToken = signRefreshToken(userId)

      mockPrisma.refreshToken.findUnique.mockResolvedValueOnce({
        token: refreshToken,
        userId,
        isRevoked: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      mockPrisma.user.findUnique.mockResolvedValueOnce(makeActiveUser({ id: userId }))

      const res = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        payload: { refreshToken },
      })

      expect(res.statusCode).toBe(200)
      const body = res.json()
      expect(typeof body.accessToken).toBe('string')
      expect(typeof body.expiresIn).toBe('number')
    })

    it('returns 400 when refreshToken field is missing', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        payload: {},
      })

      expect(res.statusCode).toBe(400)
    })

    it('returns 401 for an invalid (malformed) refresh token', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        payload: { refreshToken: 'invalid.token.here' },
      })

      expect(res.statusCode).toBe(401)
    })

    it('returns 401 for a revoked refresh token', async () => {
      const refreshToken = signRefreshToken('user-001')

      mockPrisma.refreshToken.findUnique.mockResolvedValueOnce({
        token: refreshToken,
        userId: 'user-001',
        isRevoked: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })

      const res = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        payload: { refreshToken },
      })

      expect(res.statusCode).toBe(401)
    })

    it('returns 401 for a token expired in the DB', async () => {
      const refreshToken = signRefreshToken('user-001')

      mockPrisma.refreshToken.findUnique.mockResolvedValueOnce({
        token: refreshToken,
        userId: 'user-001',
        isRevoked: false,
        expiresAt: new Date(Date.now() - 1000),
      })

      const res = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        payload: { refreshToken },
      })

      expect(res.statusCode).toBe(401)
    })

    it('returns 401 when the user has been deactivated', async () => {
      const userId = 'user-001'
      const refreshToken = signRefreshToken(userId)

      mockPrisma.refreshToken.findUnique.mockResolvedValueOnce({
        token: refreshToken,
        userId,
        isRevoked: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      mockPrisma.user.findUnique.mockResolvedValueOnce(makeActiveUser({ id: userId, isActive: false }))

      const res = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        payload: { refreshToken },
      })

      expect(res.statusCode).toBe(401)
    })
  })

  // ── POST /auth/logout ──────────────────────────────────────────────────────

  describe('POST /auth/logout', () => {
    it('returns 204 and marks the token as revoked', async () => {
      const refreshToken = signRefreshToken('user-001')

      const res = await app.inject({
        method: 'POST',
        url: '/auth/logout',
        payload: { refreshToken },
      })

      expect(res.statusCode).toBe(204)
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { token: refreshToken },
        data: { isRevoked: true },
      })
    })

    it('returns 400 when refreshToken is missing', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/auth/logout',
        payload: {},
      })

      expect(res.statusCode).toBe(400)
    })

    it('is idempotent — succeeds even if token does not exist', async () => {
      mockPrisma.refreshToken.updateMany.mockResolvedValueOnce({ count: 0 })
      const refreshToken = signRefreshToken('ghost-user')

      const res = await app.inject({
        method: 'POST',
        url: '/auth/logout',
        payload: { refreshToken },
      })

      expect(res.statusCode).toBe(204)
    })
  })

  // ── GET /auth/me ───────────────────────────────────────────────────────────

  describe('GET /auth/me', () => {
    it('returns 200 with user profile for a valid access token', async () => {
      const user = makeActiveUser()
      const accessToken = signAccessToken(user.id, 'physician')
      mockPrisma.user.findUnique.mockResolvedValueOnce(user)

      const res = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      expect(res.statusCode).toBe(200)
      const body = res.json()
      expect(body.id).toBe(user.id)
      expect(body.email).toBe(user.email)
      expect(body.role).toBe('physician')
      expect(Array.isArray(body.permissions)).toBe(true)
      expect(body.permissions).toContain('patient:read')
      expect(body).not.toHaveProperty('passwordHash')
    })

    it('returns 401 when authorization header is absent', async () => {
      const res = await app.inject({ method: 'GET', url: '/auth/me' })
      expect(res.statusCode).toBe(401)
    })

    it('returns 401 when authorization header lacks Bearer prefix', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: { Authorization: 'Token abc123' },
      })
      expect(res.statusCode).toBe(401)
    })

    it('returns 401 for a tampered access token', async () => {
      const valid = signAccessToken('user-001', 'physician')
      const tampered = valid.slice(0, -5) + 'xxxxx'

      const res = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: { Authorization: `Bearer ${tampered}` },
      })

      expect(res.statusCode).toBe(401)
    })

    it('returns 404 when the user no longer exists in the DB', async () => {
      const accessToken = signAccessToken('deleted-user', 'physician')
      mockPrisma.user.findUnique.mockResolvedValueOnce(null)

      const res = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      expect(res.statusCode).toBe(404)
    })

    it('grants admin role all permissions (wildcard)', async () => {
      const user = makeActiveUser({ role: 'admin' })
      const accessToken = signAccessToken(user.id, 'admin')
      mockPrisma.user.findUnique.mockResolvedValueOnce(user)

      const res = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      expect(res.statusCode).toBe(200)
      expect(res.json().permissions).toContain('*')
    })
  })
})
