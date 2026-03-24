import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import jwtPlugin from '@fastify/jwt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { patientRoutes } from '../../routes/patients'

// ─── Prisma mock ──────────────────────────────────────────────────────────────
// jest.mock is hoisted — the factory must not reference variables declared below it.

jest.mock('../../lib/prisma', () => ({
  prisma: {
    patient: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    auditLog: { create: jest.fn().mockResolvedValue({}) },
    observation: { findMany: jest.fn().mockResolvedValue([]) },
  },
}))

import { prisma } from '../../lib/prisma'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any

// ─── JWT helpers ──────────────────────────────────────────────────────────────

const JWT_SECRET = 'dev-access-secret-change-in-prod'

function makeToken(userId = 'test-user-id', role = 'physician'): string {
  return jwt.sign({ sub: userId, role, type: 'access' }, JWT_SECRET, { expiresIn: '1h' })
}

// ─── App factory ──────────────────────────────────────────────────────────────

async function buildApp() {
  const app = Fastify({ logger: false })
  await app.register(helmet, { contentSecurityPolicy: false })
  await app.register(cors, { origin: true, credentials: true })
  await app.register(rateLimit, { max: 1000, timeWindow: '1 minute' })
  await app.register(jwtPlugin, { secret: JWT_SECRET })

  // Replicate the production JWT preHandler (auth guard on all /api routes)
  app.addHook('preHandler', async (request, reply) => {
    if (request.url === '/health' || request.url === '/ready') return

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

  await app.register(patientRoutes)
  app.get('/health', async (_, reply) =>
    reply.status(200).send({ status: 'ok', service: 'emr-service', timestamp: new Date().toISOString() })
  )
  await app.ready()
  return app
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makePatientRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'patient-001',
    mrn: 'PH-000001',
    firstName: 'Alice',
    lastName: 'Walker',
    preferredName: null,
    dateOfBirth: new Date('1985-03-15'),
    gender: 'female',
    phone: '+1-555-0100',
    email: 'alice@example.com',
    isActive: true,
    insurances: [],
    ...overrides,
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Patient routes', () => {
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
    it('returns 200 without requiring a token', async () => {
      const res = await app.inject({ method: 'GET', url: '/health' })
      expect(res.statusCode).toBe(200)
      expect(res.json()).toMatchObject({ status: 'ok' })
    })
  })

  // ── GET /api/patients ──────────────────────────────────────────────────────

  describe('GET /api/patients', () => {
    it('returns 401 with no auth token', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/patients' })
      expect(res.statusCode).toBe(401)
    })

    it('returns 401 for an expired token', async () => {
      const expired = jwt.sign({ sub: 'u', role: 'physician', type: 'access' }, JWT_SECRET, { expiresIn: -1 })
      const res = await app.inject({
        method: 'GET',
        url: '/api/patients',
        headers: { Authorization: `Bearer ${expired}` },
      })
      expect(res.statusCode).toBe(401)
    })

    it('returns a paginated patient list', async () => {
      mockPrisma.patient.findMany.mockResolvedValueOnce([
        makePatientRow(),
        makePatientRow({ id: 'patient-002', mrn: 'PH-000002', firstName: 'Bob', lastName: 'Jones' }),
      ])
      mockPrisma.patient.count.mockResolvedValueOnce(2)

      const res = await app.inject({
        method: 'GET',
        url: '/api/patients',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(200)
      const body = res.json()
      expect(body.data).toHaveLength(2)
      expect(body.meta).toMatchObject({ page: 1, pageSize: 20, total: 2 })
      expect(body.data[0].mrn).toBe('PH-000001')
    })

    it('returns an empty list with correct meta when no patients exist', async () => {
      mockPrisma.patient.findMany.mockResolvedValueOnce([])
      mockPrisma.patient.count.mockResolvedValueOnce(0)

      const res = await app.inject({
        method: 'GET',
        url: '/api/patients',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(0)
      expect(res.json().meta.total).toBe(0)
    })

    it('passes search query to Prisma', async () => {
      mockPrisma.patient.findMany.mockResolvedValueOnce([makePatientRow()])
      mockPrisma.patient.count.mockResolvedValueOnce(1)

      await app.inject({
        method: 'GET',
        url: '/api/patients?q=Alice',
        headers: { Authorization: `Bearer ${token}` },
      })

      const callArg = mockPrisma.patient.findMany.mock.calls[0][0]
      expect(callArg.where).toHaveProperty('OR')
    })

    it('returns 400 for page=0 (invalid pagination)', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/patients?page=0',
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(400)
    })

    it('returns 400 for pageSize exceeding 100', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/patients?pageSize=200',
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(400)
    })
  })

  // ── POST /api/patients ─────────────────────────────────────────────────────

  describe('POST /api/patients', () => {
    const validPayload = {
      firstName: 'Charlie',
      lastName: 'Brown',
      dateOfBirth: '1990-07-04',
      gender: 'male',
      email: 'charlie@example.com',
    }

    it('creates a patient and returns 201 with an auto-generated MRN', async () => {
      mockPrisma.patient.findFirst.mockResolvedValueOnce(null) // no existing patients
      mockPrisma.patient.create.mockResolvedValueOnce(
        makePatientRow({ firstName: 'Charlie', lastName: 'Brown', mrn: 'PH-000001' })
      )

      const res = await app.inject({
        method: 'POST',
        url: '/api/patients',
        payload: validPayload,
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(201)
      const body = res.json()
      expect(body.data.mrn).toMatch(/^PH-\d{6}$/)
      expect(body.data.firstName).toBe('Charlie')
    })

    it('increments MRN from the current highest MRN', async () => {
      mockPrisma.patient.findFirst.mockResolvedValueOnce({ mrn: 'PH-000042' })
      mockPrisma.patient.create.mockResolvedValueOnce(
        makePatientRow({ mrn: 'PH-000043', firstName: 'Dave', lastName: 'Smith' })
      )

      await app.inject({
        method: 'POST',
        url: '/api/patients',
        payload: { ...validPayload, firstName: 'Dave', lastName: 'Smith' },
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(mockPrisma.patient.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ mrn: 'PH-000043' }) })
      )
    })

    it('returns 400 when firstName is missing', async () => {
      const { firstName: _f, ...withoutFirstName } = validPayload
      const res = await app.inject({
        method: 'POST',
        url: '/api/patients',
        payload: withoutFirstName,
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(400)
    })

    it('returns 400 when lastName is missing', async () => {
      const { lastName: _l, ...withoutLastName } = validPayload
      const res = await app.inject({
        method: 'POST',
        url: '/api/patients',
        payload: withoutLastName,
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(400)
    })

    it('returns 400 for a non-YYYY-MM-DD date format', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/patients',
        payload: { ...validPayload, dateOfBirth: '15/03/1985' },
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(400)
    })

    it('returns 400 for an invalid gender enum value', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/patients',
        payload: { ...validPayload, gender: 'invalid-gender' },
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(400)
    })

    it('returns 401 without an auth token', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/patients',
        payload: validPayload,
      })
      expect(res.statusCode).toBe(401)
    })
  })

  // ── GET /api/patients/:id ──────────────────────────────────────────────────

  describe('GET /api/patients/:id', () => {
    it('returns 200 with patient data', async () => {
      const patient = makePatientRow()
      mockPrisma.patient.findUnique.mockResolvedValueOnce(patient)

      const res = await app.inject({
        method: 'GET',
        url: `/api/patients/${patient.id}`,
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(200)
      const body = res.json()
      expect(body.data.id).toBe(patient.id)
      expect(body.data.mrn).toBe('PH-000001')
      // Internal field should not be exposed
      expect(body.data).not.toHaveProperty('isActive')
    })

    it('maps age correctly from dateOfBirth', async () => {
      mockPrisma.patient.findUnique.mockResolvedValueOnce(makePatientRow())

      const res = await app.inject({
        method: 'GET',
        url: '/api/patients/patient-001',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(200)
      expect(typeof res.json().data.age).toBe('number')
      expect(res.json().data.age).toBeGreaterThan(0)
    })

    it('returns 404 when patient does not exist', async () => {
      mockPrisma.patient.findUnique.mockResolvedValueOnce(null)

      const res = await app.inject({
        method: 'GET',
        url: '/api/patients/nonexistent-id',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(404)
      expect(res.json()).toMatchObject({ statusCode: 404, error: 'Not Found' })
    })

    it('returns 404 for a soft-deleted (inactive) patient', async () => {
      mockPrisma.patient.findUnique.mockResolvedValueOnce(makePatientRow({ isActive: false }))

      const res = await app.inject({
        method: 'GET',
        url: '/api/patients/patient-001',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  // ── PUT /api/patients/:id ──────────────────────────────────────────────────

  describe('PUT /api/patients/:id', () => {
    it('updates allowed fields and returns 200', async () => {
      const patient = makePatientRow()
      mockPrisma.patient.findUnique.mockResolvedValueOnce(patient)
      mockPrisma.patient.update.mockResolvedValueOnce({ ...patient, phone: '+1-555-9999' })

      const res = await app.inject({
        method: 'PUT',
        url: `/api/patients/${patient.id}`,
        payload: { phone: '+1-555-9999' },
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(200)
      expect(mockPrisma.patient.update).toHaveBeenCalled()
    })

    it('returns 404 when patient does not exist', async () => {
      mockPrisma.patient.findUnique.mockResolvedValueOnce(null)

      const res = await app.inject({
        method: 'PUT',
        url: '/api/patients/nonexistent',
        payload: { phone: '+1-555-0000' },
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(404)
    })
  })
})
