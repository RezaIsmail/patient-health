import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import jwtPlugin from '@fastify/jwt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { contactRoutes } from '../../routes/contacts'

// ─── Prisma mock ──────────────────────────────────────────────────────────────
// jest.mock is hoisted — the factory must not reference variables declared below it.

jest.mock('../../lib/prisma', () => ({
  prisma: {
    contact: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    auditLog: { create: jest.fn().mockResolvedValue({}) },
    communication: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({}),
    },
    task: { findMany: jest.fn().mockResolvedValue([]) },
    referral: { findMany: jest.fn().mockResolvedValue([]) },
  },
}))

import { prisma } from '../../lib/prisma'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any

// ─── JWT helpers ──────────────────────────────────────────────────────────────

const JWT_SECRET = 'dev-access-secret-change-in-prod'

function makeToken(userId = 'test-user-id', role = 'admin'): string {
  return jwt.sign({ sub: userId, role, type: 'access' }, JWT_SECRET, { expiresIn: '1h' })
}

// ─── App factory ──────────────────────────────────────────────────────────────

async function buildApp() {
  const app = Fastify({ logger: false })
  await app.register(helmet, { contentSecurityPolicy: false })
  await app.register(cors, { origin: true, credentials: true })
  await app.register(rateLimit, { max: 1000, timeWindow: '1 minute' })
  await app.register(jwtPlugin, { secret: JWT_SECRET })

  app.addHook('preHandler', async (request, reply) => {
    if (request.url === '/health' || request.url === '/ready' || request.url.startsWith('/internal')) return

    const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
    const authHeader = request.headers['authorization']

    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
        correlationId,
      })
    }

    try {
      const token = authHeader.slice(7)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded = app.jwt.verify(token) as { sub: string; role: string }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(request as any).userId = decoded.sub
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(request as any).userRole = decoded.role
    } catch {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid or expired access token',
        correlationId,
      })
    }
  })

  await app.register(contactRoutes)
  app.get('/health', async (_, reply) =>
    reply.status(200).send({ status: 'ok', service: 'crm-service', timestamp: new Date().toISOString() })
  )
  await app.ready()
  return app
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeContact(overrides: Record<string, unknown> = {}) {
  return {
    id: 'contact-001',
    firstName: 'Sarah',
    lastName: 'Connor',
    dateOfBirth: new Date('1980-05-20'),
    sex: 'female',
    phone: '+1-555-0200',
    email: 'sarah@example.com',
    status: 'active',
    riskLevel: 'low',
    language: 'en',
    source: 'referral',
    sdohFlags: [],
    emrPatientId: null,
    adminMemberId: null,
    assignedTo: null,
    accountId: null,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    carePlans: [],
    referrals: [],
    tasks: [],
    careGaps: [],
    ...overrides,
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CRM Contact routes', () => {
  let app: Awaited<ReturnType<typeof buildApp>>
  let token: string

  beforeAll(async () => {
    app = await buildApp()
    token = makeToken()
  })

  afterAll(async () => {
    await app.close()
  })

  // ── GET /health ────────────────────────────────────────────────────────────

  describe('GET /health', () => {
    it('returns 200 without auth', async () => {
      const res = await app.inject({ method: 'GET', url: '/health' })
      expect(res.statusCode).toBe(200)
    })
  })

  // ── GET /api/contacts ──────────────────────────────────────────────────────

  describe('GET /api/contacts', () => {
    it('returns 401 without an auth token', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/contacts' })
      expect(res.statusCode).toBe(401)
    })

    it('returns a paginated contact list', async () => {
      mockPrisma.contact.findMany.mockResolvedValueOnce([makeContact(), makeContact({ id: 'contact-002', firstName: 'John' })])
      mockPrisma.contact.count.mockResolvedValueOnce(2)

      const res = await app.inject({
        method: 'GET',
        url: '/api/contacts',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(200)
      const body = res.json()
      expect(body.data).toHaveLength(2)
      expect(body.meta).toMatchObject({ page: 1, pageSize: 20, total: 2 })
    })

    it('returns an empty list with correct meta', async () => {
      mockPrisma.contact.findMany.mockResolvedValueOnce([])
      mockPrisma.contact.count.mockResolvedValueOnce(0)

      const res = await app.inject({
        method: 'GET',
        url: '/api/contacts',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(0)
    })

    it('filters by status when provided', async () => {
      mockPrisma.contact.findMany.mockResolvedValueOnce([makeContact({ status: 'active' })])
      mockPrisma.contact.count.mockResolvedValueOnce(1)

      await app.inject({
        method: 'GET',
        url: '/api/contacts?status=active',
        headers: { Authorization: `Bearer ${token}` },
      })

      const callArg = mockPrisma.contact.findMany.mock.calls[0][0]
      expect(callArg.where).toMatchObject({ status: 'active' })
    })

    it('filters by riskLevel when provided', async () => {
      mockPrisma.contact.findMany.mockResolvedValueOnce([makeContact({ riskLevel: 'high' })])
      mockPrisma.contact.count.mockResolvedValueOnce(1)

      await app.inject({
        method: 'GET',
        url: '/api/contacts?riskLevel=high',
        headers: { Authorization: `Bearer ${token}` },
      })

      const callArg = mockPrisma.contact.findMany.mock.calls[0][0]
      expect(callArg.where).toMatchObject({ riskLevel: 'high' })
    })
  })

  // ── POST /api/contacts ─────────────────────────────────────────────────────

  describe('POST /api/contacts', () => {
    const validPayload = {
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria@example.com',
      phone: '+1-555-0300',
      status: 'lead',
      riskLevel: 'low',
    }

    it('creates a contact and returns 201', async () => {
      mockPrisma.contact.create.mockResolvedValueOnce(makeContact({ firstName: 'Maria', lastName: 'Garcia' }))

      const res = await app.inject({
        method: 'POST',
        url: '/api/contacts',
        payload: validPayload,
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(201)
      expect(res.json().data.firstName).toBe('Maria')
    })

    it('returns 400 when firstName is missing', async () => {
      const { firstName: _f, ...withoutFirstName } = validPayload
      const res = await app.inject({
        method: 'POST',
        url: '/api/contacts',
        payload: withoutFirstName,
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(400)
    })

    it('returns 400 when lastName is missing', async () => {
      const { lastName: _l, ...withoutLastName } = validPayload
      const res = await app.inject({
        method: 'POST',
        url: '/api/contacts',
        payload: withoutLastName,
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(400)
    })

    it('returns 400 for an invalid email format', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/contacts',
        payload: { ...validPayload, email: 'not-an-email' },
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(400)
    })

    it('returns 400 for an invalid status enum value', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/contacts',
        payload: { ...validPayload, status: 'unknown-status' },
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(400)
    })

    it('returns 401 without an auth token', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/contacts',
        payload: validPayload,
      })
      expect(res.statusCode).toBe(401)
    })
  })

  // ── GET /api/contacts/:id ──────────────────────────────────────────────────

  describe('GET /api/contacts/:id', () => {
    it('returns 200 with contact data', async () => {
      const contact = makeContact()
      mockPrisma.contact.findUnique.mockResolvedValueOnce(contact)

      const res = await app.inject({
        method: 'GET',
        url: `/api/contacts/${contact.id}`,
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(200)
      const body = res.json()
      expect(body.data.id).toBe(contact.id)
      expect(body.data.firstName).toBe('Sarah')
    })

    it('returns 404 when contact does not exist', async () => {
      mockPrisma.contact.findUnique.mockResolvedValueOnce(null)

      const res = await app.inject({
        method: 'GET',
        url: '/api/contacts/nonexistent-id',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(404)
      expect(res.json()).toMatchObject({ statusCode: 404, error: 'Not Found' })
    })
  })

  // ── PATCH /api/contacts/:id ────────────────────────────────────────────────

  describe('PATCH /api/contacts/:id', () => {
    it('updates contact fields and returns 200', async () => {
      const contact = makeContact()
      mockPrisma.contact.findUnique.mockResolvedValueOnce(contact)
      mockPrisma.contact.update.mockResolvedValueOnce({ ...contact, riskLevel: 'high' })

      const res = await app.inject({
        method: 'PATCH',
        url: `/api/contacts/${contact.id}`,
        payload: { riskLevel: 'high' },
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when contact does not exist', async () => {
      mockPrisma.contact.findUnique.mockResolvedValueOnce(null)

      const res = await app.inject({
        method: 'PATCH',
        url: '/api/contacts/ghost-id',
        payload: { riskLevel: 'medium' },
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(404)
    })
  })
})
