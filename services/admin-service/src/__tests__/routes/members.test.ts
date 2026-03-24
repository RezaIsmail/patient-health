import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import jwtPlugin from '@fastify/jwt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { memberRoutes } from '../../routes/members'

// ─── Prisma mock ──────────────────────────────────────────────────────────────
// jest.mock is hoisted — the factory must not reference variables declared below it.

jest.mock('../../lib/prisma', () => ({
  prisma: {
    member: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    programmeEnrollment: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    enrollmentTransition: { create: jest.fn() },
    auditEvent: { create: jest.fn().mockResolvedValue({}) },
    $transaction: jest.fn(),
  },
}))

jest.mock('../../lib/internalClient', () => ({
  emrClient: {
    createPatient: jest.fn().mockResolvedValue({ ok: true, data: { patientId: 'emr-patient-001' } }),
  },
  crmClient: {
    createContact: jest.fn().mockResolvedValue({ ok: true, data: { contactId: 'crm-contact-001' } }),
    linkEmrPatient: jest.fn().mockResolvedValue({ ok: true, data: { ok: true } }),
    updateRiskLevel: jest.fn().mockResolvedValue({ ok: true, data: { ok: true } }),
    updateProgramme: jest.fn().mockResolvedValue({ ok: true, data: { ok: true } }),
  },
}))

import { prisma } from '../../lib/prisma'
import { emrClient, crmClient } from '../../lib/internalClient'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockEmrClient = emrClient as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockCrmClient = crmClient as any

// ─── JWT helpers ──────────────────────────────────────────────────────────────

const JWT_SECRET = 'dev-access-secret-change-in-prod'

function makeToken(userId = 'admin-user-id', role = 'admin'): string {
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

  await app.register(memberRoutes)
  app.get('/health', async (_, reply) =>
    reply.status(200).send({ status: 'ok', service: 'admin-service', timestamp: new Date().toISOString() })
  )
  await app.ready()
  return app
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeMember(overrides: Record<string, unknown> = {}) {
  return {
    id: 'member-001',
    memberNumber: 'MEM-20260101-0001',
    firstName: 'Tom',
    lastName: 'Hardy',
    dateOfBirth: new Date('1975-08-10'),
    sex: 'male',
    phone: '+1-555-0400',
    email: 'tom@example.com',
    status: 'active',
    riskLevel: 'low',
    organisationId: 'org-springfield-medical',
    siteId: null,
    emrPatientId: null,
    crmContactId: null,
    organisation: { id: 'org-springfield-medical', name: 'Springfield Medical Group' },
    site: null,
    enrollments: [],
    _count: { enrollments: 0 },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Admin Member routes', () => {
  let app: Awaited<ReturnType<typeof buildApp>>
  let token: string

  beforeAll(async () => {
    app = await buildApp()
    token = makeToken()
  })

  afterAll(async () => {
    await app.close()
  })

  // ── GET /api/members ───────────────────────────────────────────────────────

  describe('GET /api/members', () => {
    it('returns 401 without an auth token', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/members' })
      expect(res.statusCode).toBe(401)
    })

    it('returns a paginated member list', async () => {
      mockPrisma.member.findMany.mockResolvedValueOnce([makeMember()])
      mockPrisma.member.count.mockResolvedValueOnce(1)

      const res = await app.inject({
        method: 'GET',
        url: '/api/members',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(200)
      const body = res.json()
      expect(body.data).toHaveLength(1)
      expect(body.meta).toMatchObject({ page: 1, pageSize: 20, total: 1 })
    })

    it('filters by status when provided', async () => {
      mockPrisma.member.findMany.mockResolvedValueOnce([])
      mockPrisma.member.count.mockResolvedValueOnce(0)

      await app.inject({
        method: 'GET',
        url: '/api/members?status=active',
        headers: { Authorization: `Bearer ${token}` },
      })

      const callArg = mockPrisma.member.findMany.mock.calls[0][0]
      expect(callArg.where).toMatchObject({ status: 'active' })
    })

    it('filters by organisationId when provided', async () => {
      mockPrisma.member.findMany.mockResolvedValueOnce([])
      mockPrisma.member.count.mockResolvedValueOnce(0)

      await app.inject({
        method: 'GET',
        url: '/api/members?organisationId=org-springfield-medical',
        headers: { Authorization: `Bearer ${token}` },
      })

      const callArg = mockPrisma.member.findMany.mock.calls[0][0]
      expect(callArg.where).toMatchObject({ organisationId: 'org-springfield-medical' })
    })
  })

  // ── POST /api/members ──────────────────────────────────────────────────────

  describe('POST /api/members', () => {
    const validPayload = {
      firstName: 'Emma',
      lastName: 'Stone',
      dateOfBirth: '1988-11-06',
      sex: 'female',
      email: 'emma@example.com',
      phone: '+1-555-0500',
      organisationId: 'org-springfield-medical',
      riskLevel: 'low',
      status: 'active',
    }

    it('creates a member, returns 201, and triggers EMR+CRM fan-out', async () => {
      mockPrisma.member.count.mockResolvedValueOnce(0) // for MEM number generation
      mockPrisma.member.create.mockResolvedValueOnce(
        makeMember({ firstName: 'Emma', lastName: 'Stone' })
      )
      // Fan-out updates
      mockPrisma.member.update.mockResolvedValue(makeMember({ emrPatientId: 'emr-patient-001', crmContactId: 'crm-contact-001' }))

      const res = await app.inject({
        method: 'POST',
        url: '/api/members',
        payload: validPayload,
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(201)
      const body = res.json()
      expect(body.data.firstName).toBe('Emma')
      expect(body.data).toHaveProperty('memberNumber')

      // Fan-out to EMR and CRM is fire-and-forget; allow the promise to settle
      await new Promise((r) => setTimeout(r, 50))
      expect(mockEmrClient.createPatient).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: 'Emma', lastName: 'Stone' }),
        expect.any(String)
      )
      expect(mockCrmClient.createContact).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: 'Emma', lastName: 'Stone' }),
        expect.any(String)
      )
    })

    it('auto-generates a member number in MEM-YYYYMMDD-NNNN format', async () => {
      mockPrisma.member.count.mockResolvedValueOnce(5) // 5 existing today → seq = 0006
      const expectedMember = makeMember({ memberNumber: 'MEM-20260101-0006' })
      mockPrisma.member.create.mockResolvedValueOnce(expectedMember)
      mockPrisma.member.update.mockResolvedValue(expectedMember)

      await app.inject({
        method: 'POST',
        url: '/api/members',
        payload: validPayload,
        headers: { Authorization: `Bearer ${token}` },
      })

      const createCall = mockPrisma.member.create.mock.calls[0][0]
      expect(createCall.data.memberNumber).toMatch(/^MEM-\d{8}-\d{4}$/)
    })

    it('still returns 201 even when EMR fan-out fails (resilience)', async () => {
      mockEmrClient.createPatient.mockResolvedValueOnce({ ok: false, reason: 'EMR unavailable' })
      mockPrisma.member.count.mockResolvedValueOnce(0)
      mockPrisma.member.create.mockResolvedValueOnce(makeMember())
      mockPrisma.member.update.mockResolvedValue(makeMember())

      const res = await app.inject({
        method: 'POST',
        url: '/api/members',
        payload: validPayload,
        headers: { Authorization: `Bearer ${token}` },
      })

      // Fan-out is fire-and-forget — member creation must not fail
      expect(res.statusCode).toBe(201)
    })

    it('returns 400 when firstName is missing', async () => {
      const { firstName: _f, ...withoutFirstName } = validPayload
      const res = await app.inject({
        method: 'POST',
        url: '/api/members',
        payload: withoutFirstName,
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(400)
    })

    it('returns 400 when organisationId is missing', async () => {
      const { organisationId: _o, ...withoutOrg } = validPayload
      const res = await app.inject({
        method: 'POST',
        url: '/api/members',
        payload: withoutOrg,
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(400)
    })
  })

  // ── GET /api/members/:id ───────────────────────────────────────────────────

  describe('GET /api/members/:id', () => {
    it('returns 200 with member data', async () => {
      mockPrisma.member.findUnique.mockResolvedValueOnce(makeMember())

      const res = await app.inject({
        method: 'GET',
        url: '/api/members/member-001',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(200)
      expect(res.json().data.id).toBe('member-001')
    })

    it('returns 404 when member does not exist', async () => {
      mockPrisma.member.findUnique.mockResolvedValueOnce(null)

      const res = await app.inject({
        method: 'GET',
        url: '/api/members/nonexistent',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  // ── PUT /api/members/:id ───────────────────────────────────────────────────

  describe('PUT /api/members/:id', () => {
    it('updates member fields and returns 200', async () => {
      const member = makeMember()
      mockPrisma.member.findUnique.mockResolvedValueOnce(member)
      mockPrisma.member.update.mockResolvedValueOnce({ ...member, phone: '+1-555-9999' })

      const res = await app.inject({
        method: 'PUT',
        url: '/api/members/member-001',
        payload: { phone: '+1-555-9999' },
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(200)
    })

    it('syncs risk level to CRM when riskLevel changes and crmContactId is set', async () => {
      const member = makeMember({ crmContactId: 'crm-contact-001' })
      mockPrisma.member.findUnique.mockResolvedValueOnce(member)
      mockPrisma.member.update.mockResolvedValueOnce({ ...member, riskLevel: 'high' })

      await app.inject({
        method: 'PUT',
        url: '/api/members/member-001',
        payload: { riskLevel: 'high' },
        headers: { Authorization: `Bearer ${token}` },
      })

      await new Promise((r) => setTimeout(r, 20))
      expect(mockCrmClient.updateRiskLevel).toHaveBeenCalledWith(
        'crm-contact-001',
        { riskLevel: 'high' },
        expect.any(String)
      )
    })

    it('returns 404 when member does not exist', async () => {
      mockPrisma.member.findUnique.mockResolvedValueOnce(null)

      const res = await app.inject({
        method: 'PUT',
        url: '/api/members/ghost-id',
        payload: { phone: '+1-555-0000' },
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  // ── DELETE /api/members/:id ────────────────────────────────────────────────

  describe('DELETE /api/members/:id', () => {
    it('soft-deletes the member (sets status to inactive) and returns 200', async () => {
      mockPrisma.member.findUnique.mockResolvedValueOnce(makeMember())
      mockPrisma.member.update.mockResolvedValueOnce(makeMember({ status: 'inactive' }))

      const res = await app.inject({
        method: 'DELETE',
        url: '/api/members/member-001',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toMatchObject({ id: 'member-001', status: 'inactive' })
      expect(mockPrisma.member.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: 'inactive' } })
      )
    })

    it('returns 404 when member does not exist', async () => {
      mockPrisma.member.findUnique.mockResolvedValueOnce(null)

      const res = await app.inject({
        method: 'DELETE',
        url: '/api/members/ghost-id',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  // ── POST /api/members/:id/enrollments ──────────────────────────────────────

  describe('POST /api/members/:id/enrollments', () => {
    it('creates an enrollment in referred state and returns 201', async () => {
      mockPrisma.member.findUnique.mockResolvedValueOnce(makeMember())
      mockPrisma.programmeEnrollment.findUnique.mockResolvedValueOnce(null) // not already enrolled
      mockPrisma.programmeEnrollment.create.mockResolvedValueOnce({
        id: 'enrollment-001',
        memberId: 'member-001',
        programmeId: 'prog-diabetes',
        state: 'referred',
        programme: { id: 'prog-diabetes', name: 'Diabetes Care' },
        createdAt: new Date(),
      })

      const res = await app.inject({
        method: 'POST',
        url: '/api/members/member-001/enrollments',
        payload: { programmeId: 'prog-diabetes' },
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(201)
      expect(res.json().data.state).toBe('referred')
    })

    it('returns 409 when member is already enrolled in the programme', async () => {
      mockPrisma.member.findUnique.mockResolvedValueOnce(makeMember())
      mockPrisma.programmeEnrollment.findUnique.mockResolvedValueOnce({ id: 'enrollment-existing' })

      const res = await app.inject({
        method: 'POST',
        url: '/api/members/member-001/enrollments',
        payload: { programmeId: 'prog-diabetes' },
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(409)
    })

    it('returns 404 when member does not exist', async () => {
      mockPrisma.member.findUnique.mockResolvedValueOnce(null)

      const res = await app.inject({
        method: 'POST',
        url: '/api/members/ghost-id/enrollments',
        payload: { programmeId: 'prog-diabetes' },
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  // ── PUT /api/members/:id/enrollments/:enrollmentId/transition ──────────────

  describe('PUT /api/members/:id/enrollments/:enrollmentId/transition', () => {
    it('transitions enrollment to a new state and creates a transition record', async () => {
      const updatedEnrollment = {
        id: 'enrollment-001',
        memberId: 'member-001',
        programmeId: 'prog-diabetes',
        state: 'enrolled',
        enrolledAt: new Date(),
      }
      mockPrisma.programmeEnrollment.findUnique.mockResolvedValueOnce({
        id: 'enrollment-001',
        state: 'consented',
        memberId: 'member-001',
        programmeId: 'prog-diabetes',
        programme: { id: 'prog-diabetes', name: 'Diabetes Care' },
        member: { crmContactId: null },
      })
      mockPrisma.$transaction.mockImplementationOnce((ops: Promise<unknown>[]) => Promise.all(ops))
      mockPrisma.programmeEnrollment.update.mockResolvedValueOnce(updatedEnrollment)
      mockPrisma.enrollmentTransition.create.mockResolvedValueOnce({ id: 'transition-001' })

      const res = await app.inject({
        method: 'PUT',
        url: '/api/members/member-001/enrollments/enrollment-001/transition',
        payload: { toState: 'enrolled', notes: 'Member confirmed' },
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(200)
      expect(mockPrisma.$transaction).toHaveBeenCalled()
      expect(mockPrisma.enrollmentTransition.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ fromState: 'consented', toState: 'enrolled' }),
        })
      )
    })

    it('notifies CRM when transitioning to active state (if crmContactId is set)', async () => {
      mockPrisma.programmeEnrollment.findUnique.mockResolvedValueOnce({
        id: 'enrollment-001',
        state: 'enrolled',
        memberId: 'member-001',
        programmeId: 'prog-diabetes',
        programme: { id: 'prog-diabetes', name: 'Diabetes Care' },
        member: { crmContactId: 'crm-contact-001' },
      })
      mockPrisma.$transaction.mockImplementationOnce((ops: Promise<unknown>[]) => Promise.all(ops))
      mockPrisma.programmeEnrollment.update.mockResolvedValueOnce({
        id: 'enrollment-001',
        state: 'active',
      })
      mockPrisma.enrollmentTransition.create.mockResolvedValueOnce({ id: 'transition-002' })

      await app.inject({
        method: 'PUT',
        url: '/api/members/member-001/enrollments/enrollment-001/transition',
        payload: { toState: 'active' },
        headers: { Authorization: `Bearer ${token}` },
      })

      await new Promise((r) => setTimeout(r, 20))
      expect(mockCrmClient.updateProgramme).toHaveBeenCalledWith(
        'crm-contact-001',
        expect.objectContaining({ state: 'active' }),
        expect.any(String)
      )
    })

    it('returns 400 for an invalid toState value', async () => {
      const res = await app.inject({
        method: 'PUT',
        url: '/api/members/member-001/enrollments/enrollment-001/transition',
        payload: { toState: 'flying' }, // not a valid state
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(400)
    })

    it('returns 404 when enrollment does not exist', async () => {
      mockPrisma.programmeEnrollment.findUnique.mockResolvedValueOnce(null)

      const res = await app.inject({
        method: 'PUT',
        url: '/api/members/member-001/enrollments/ghost-enrollment/transition',
        payload: { toState: 'enrolled' },
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(404)
    })

    it('returns 404 when enrollment does not belong to the member', async () => {
      mockPrisma.programmeEnrollment.findUnique.mockResolvedValueOnce({
        id: 'enrollment-001',
        state: 'referred',
        memberId: 'different-member-id', // mismatch
        programmeId: 'prog-diabetes',
        programme: { id: 'prog-diabetes', name: 'Diabetes Care' },
        member: { crmContactId: null },
      })

      const res = await app.inject({
        method: 'PUT',
        url: '/api/members/member-001/enrollments/enrollment-001/transition',
        payload: { toState: 'screened' },
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.statusCode).toBe(404)
    })
  })
})
