import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import { crmInternalRoutes } from '../../routes/internal'

// ─── Prisma mock ──────────────────────────────────────────────────────────────
// jest.mock is hoisted — the factory must not reference variables declared below it.

jest.mock('../../lib/prisma', () => ({
  prisma: {
    contact: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    communication: { create: jest.fn().mockResolvedValue({}) },
  },
}))

import { prisma } from '../../lib/prisma'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any

// ─── App factory ──────────────────────────────────────────────────────────────

const INTERNAL_TOKEN = 'dev-internal-secret'
process.env.INTERNAL_SERVICE_TOKEN = INTERNAL_TOKEN

async function buildApp() {
  const app = Fastify({ logger: false })
  await app.register(helmet, { contentSecurityPolicy: false })
  await app.register(cors, { origin: true })
  await app.register(crmInternalRoutes)
  await app.ready()
  return app
}

const internalHeaders = {
  Authorization: `Bearer ${INTERNAL_TOKEN}`,
  'Content-Type': 'application/json',
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CRM internal routes', () => {
  let app: Awaited<ReturnType<typeof buildApp>>

  beforeAll(async () => {
    app = await buildApp()
  })

  afterAll(async () => {
    await app.close()
  })

  // ── POST /internal/contacts ────────────────────────────────────────────────

  describe('POST /internal/contacts', () => {
    const validPayload = {
      firstName: 'Alice',
      lastName: 'Walker',
      riskLevel: 'low',
      adminMemberId: 'member-001',
    }

    it('creates a contact and returns 201 with contactId', async () => {
      mockPrisma.contact.findFirst.mockResolvedValueOnce(null) // no existing
      mockPrisma.contact.create.mockResolvedValueOnce({ id: 'contact-new-001' })

      const res = await app.inject({
        method: 'POST',
        url: '/internal/contacts',
        payload: validPayload,
        headers: internalHeaders,
      })

      expect(res.statusCode).toBe(201)
      expect(res.json()).toHaveProperty('contactId', 'contact-new-001')
    })

    it('is idempotent — returns existing contact if adminMemberId already linked', async () => {
      mockPrisma.contact.findFirst.mockResolvedValueOnce({ id: 'contact-existing-001' })

      const res = await app.inject({
        method: 'POST',
        url: '/internal/contacts',
        payload: validPayload,
        headers: internalHeaders,
      })

      expect(res.statusCode).toBe(200)
      expect(res.json()).toHaveProperty('contactId', 'contact-existing-001')
      expect(mockPrisma.contact.create).not.toHaveBeenCalled()
    })

    it('returns 400 when required fields are missing', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/internal/contacts',
        payload: { firstName: 'Alice' }, // missing lastName and adminMemberId
        headers: internalHeaders,
      })
      expect(res.statusCode).toBe(400)
    })

    it('returns 401 with an invalid internal token', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/internal/contacts',
        payload: validPayload,
        headers: { Authorization: 'Bearer wrong-token' },
      })
      expect(res.statusCode).toBe(401)
    })

    it('returns 401 with no authorization header', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/internal/contacts',
        payload: validPayload,
      })
      expect(res.statusCode).toBe(401)
    })
  })

  // ── POST /internal/clinical-sync ───────────────────────────────────────────

  describe('POST /internal/clinical-sync', () => {
    const syncPayload = {
      emrPatientId: 'emr-patient-001',
      riskLevel: 'high',
      activeConditions: [
        { code: 'E11', display: 'Type 2 Diabetes' },
        { code: 'I10', display: 'Essential Hypertension' },
        { code: 'J45', display: 'Asthma' },
      ],
      activeMedications: [{ name: 'Metformin', dose: '500mg' }],
      openCareGapCount: 2,
      triggerType: 'problem_added',
    }

    it('updates contact risk level and logs a timeline event', async () => {
      mockPrisma.contact.findFirst.mockResolvedValueOnce({
        id: 'contact-001',
        riskLevel: 'low', // was low, now high
      })

      const res = await app.inject({
        method: 'POST',
        url: '/internal/clinical-sync',
        payload: syncPayload,
        headers: internalHeaders,
      })

      expect(res.statusCode).toBe(200)
      expect(res.json()).toMatchObject({ ok: true, synced: true, contactId: 'contact-001' })
      expect(mockPrisma.contact.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ riskLevel: 'high' }) })
      )
      expect(mockPrisma.communication.create).toHaveBeenCalled()
    })

    it('skips risk update when riskLevel has not changed', async () => {
      mockPrisma.contact.findFirst.mockResolvedValueOnce({
        id: 'contact-001',
        riskLevel: 'high', // already high
      })

      const res = await app.inject({
        method: 'POST',
        url: '/internal/clinical-sync',
        payload: syncPayload,
        headers: internalHeaders,
      })

      expect(res.statusCode).toBe(200)
      // Should not have updated riskLevel (no change)
      expect(mockPrisma.contact.update).not.toHaveBeenCalled()
      // But should still log the timeline event
      expect(mockPrisma.communication.create).toHaveBeenCalled()
    })

    it('returns 200 with synced=false when no contact is linked to the EMR patient', async () => {
      mockPrisma.contact.findFirst.mockResolvedValueOnce(null)

      const res = await app.inject({
        method: 'POST',
        url: '/internal/clinical-sync',
        payload: syncPayload,
        headers: internalHeaders,
      })

      expect(res.statusCode).toBe(200)
      expect(res.json()).toMatchObject({ ok: true, synced: false, reason: 'no_linked_contact' })
    })

    it('returns 400 when required fields are missing', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/internal/clinical-sync',
        payload: { emrPatientId: 'emr-001' }, // missing riskLevel, conditions etc.
        headers: internalHeaders,
      })
      expect(res.statusCode).toBe(400)
    })

    it('returns 401 with an invalid internal token', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/internal/clinical-sync',
        payload: syncPayload,
        headers: { Authorization: 'Bearer bad-token' },
      })
      expect(res.statusCode).toBe(401)
    })
  })

  // ── PATCH /internal/contacts/:id/link-emr ─────────────────────────────────

  describe('PATCH /internal/contacts/:id/link-emr', () => {
    it('stores the EMR patient ID on the contact and returns 200', async () => {
      mockPrisma.contact.findUnique.mockResolvedValueOnce({ id: 'contact-001' })

      const res = await app.inject({
        method: 'PATCH',
        url: '/internal/contacts/contact-001/link-emr',
        payload: { emrPatientId: 'emr-patient-001' },
        headers: internalHeaders,
      })

      expect(res.statusCode).toBe(200)
      expect(mockPrisma.contact.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { emrPatientId: 'emr-patient-001' } })
      )
    })

    it('returns 404 when contact does not exist', async () => {
      mockPrisma.contact.findUnique.mockResolvedValueOnce(null)

      const res = await app.inject({
        method: 'PATCH',
        url: '/internal/contacts/ghost-id/link-emr',
        payload: { emrPatientId: 'emr-001' },
        headers: internalHeaders,
      })

      expect(res.statusCode).toBe(404)
    })

    it('returns 400 when emrPatientId is missing', async () => {
      const res = await app.inject({
        method: 'PATCH',
        url: '/internal/contacts/contact-001/link-emr',
        payload: {},
        headers: internalHeaders,
      })
      expect(res.statusCode).toBe(400)
    })
  })

  // ── PATCH /internal/contacts/:id/risk-update ──────────────────────────────

  describe('PATCH /internal/contacts/:id/risk-update', () => {
    it('updates riskLevel and returns 200', async () => {
      const res = await app.inject({
        method: 'PATCH',
        url: '/internal/contacts/contact-001/risk-update',
        payload: { riskLevel: 'critical' },
        headers: internalHeaders,
      })

      expect(res.statusCode).toBe(200)
      expect(mockPrisma.contact.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { riskLevel: 'critical' } })
      )
    })

    it('returns 400 for an invalid riskLevel value', async () => {
      const res = await app.inject({
        method: 'PATCH',
        url: '/internal/contacts/contact-001/risk-update',
        payload: { riskLevel: 'extreme' }, // not in enum
        headers: internalHeaders,
      })
      expect(res.statusCode).toBe(400)
    })
  })
})
