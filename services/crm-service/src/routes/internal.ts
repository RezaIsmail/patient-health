import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../lib/prisma'
import { Prisma } from '@prisma/client'
import { dispatchWebhookEvent } from './webhooks'
import { publishContactRiskChanged, publishCareGapOpened } from '../lib/eventPublisher'

// ─── Care gap rule engine ──────────────────────────────────────────────────────
// Maps ICD-10 condition codes to care gaps that should be opened automatically.

interface GapRule {
  gapType: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  conditionCodes: string[] // ICD-10 prefixes — any match triggers the gap
}

const GAP_RULES: GapRule[] = [
  {
    gapType: 'hba1c',
    description: 'HbA1c monitoring overdue for patient with Type 2 Diabetes',
    priority: 'high',
    conditionCodes: ['E11', 'E10', 'E13'],
  },
  {
    gapType: 'bp_check',
    description: 'Blood pressure check overdue for patient with hypertension',
    priority: 'medium',
    conditionCodes: ['I10', 'I11', 'I12', 'I13'],
  },
  {
    gapType: 'medication_refill',
    description: 'Medication refill follow-up needed for COPD patient',
    priority: 'high',
    conditionCodes: ['J44', 'J43', 'J45'],
  },
  {
    gapType: 'behavioural_health_assessment',
    description: 'Behavioural health screening recommended based on active diagnosis',
    priority: 'medium',
    conditionCodes: ['F32', 'F33', 'F41', 'F10', 'F11', 'F19'],
  },
]

function identifyGapsFromConditions(
  conditions: Array<{ code: string; display: string }>
): GapRule[] {
  const triggered: GapRule[] = []
  for (const rule of GAP_RULES) {
    const matches = conditions.some((c) =>
      rule.conditionCodes.some((prefix) => c.code.startsWith(prefix))
    )
    if (matches) triggered.push(rule)
  }
  return triggered
}

const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN ?? 'dev-internal-secret'

function validateInternalToken(request: FastifyRequest, reply: FastifyReply): boolean {
  const auth = request.headers['authorization']
  if (!auth || auth !== `Bearer ${INTERNAL_TOKEN}`) {
    reply.status(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Invalid internal service token' })
    return false
  }
  return true
}

export async function crmInternalRoutes(fastify: FastifyInstance) {

  /**
   * POST /internal/contacts
   * Called by Admin when a Member is created — creates the linked CRM Contact.
   */
  fastify.post('/internal/contacts', async (request: FastifyRequest, reply: FastifyReply) => {
    if (!validateInternalToken(request, reply)) return
    const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()

    const schema = z.object({
      firstName: z.string().min(1).max(100),
      lastName: z.string().min(1).max(100),
      dateOfBirth: z.string().optional(),
      sex: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      riskLevel: z.string().optional().default('low'),
      adminMemberId: z.string(),
    })
    const parsed = schema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: parsed.error.errors.map(e => e.message).join(', '), correlationId })
    }

    const d = parsed.data

    // Idempotent — if contact already linked to this adminMemberId, return it
    // We store adminMemberId in the notes field as a lookup key
    const existing = await prisma.contact.findFirst({
      where: {
        notes: { contains: `admin_member_id:${d.adminMemberId}` },
      },
      select: { id: true },
    })
    if (existing) {
      return reply.status(200).send({ contactId: existing.id })
    }

    const contact = await prisma.contact.create({
      data: {
        firstName: d.firstName,
        lastName: d.lastName,
        dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth) : null,
        sex: d.sex ?? null,
        phone: d.phone ?? null,
        email: d.email ?? null,
        riskLevel: d.riskLevel ?? 'low',
        status: 'active',
        source: 'admin_sync',
        notes: `admin_member_id:${d.adminMemberId}`,
      },
      select: { id: true },
    })

    fastify.log.info({ correlationId, contactId: contact.id, adminMemberId: d.adminMemberId }, 'Internal: contact created from Admin member')
    return reply.status(201).send({ contactId: contact.id })
  })

  /**
   * POST /internal/clinical-sync
   * Called by EMR after any clinical write — syncs risk level and clinical flags to the CRM contact.
   * The CRM does NOT store full clinical data — only metadata needed for segmentation.
   */
  fastify.post('/internal/clinical-sync', async (request: FastifyRequest, reply: FastifyReply) => {
    if (!validateInternalToken(request, reply)) return
    const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()

    const schema = z.object({
      emrPatientId: z.string(),
      riskLevel: z.string(),
      activeConditions: z.array(z.object({ code: z.string(), display: z.string() })),
      activeMedications: z.array(z.object({ name: z.string(), dose: z.string().optional() })),
      openCareGapCount: z.number(),
      triggerType: z.string(),
    })
    const parsed = schema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: parsed.error.errors.map(e => e.message).join(', '), correlationId })
    }

    const d = parsed.data

    // Find the contact linked to this EMR patient
    const contact = await prisma.contact.findFirst({
      where: { emrPatientId: d.emrPatientId },
      select: { id: true, riskLevel: true },
    })

    if (!contact) {
      // No linked contact — nothing to sync, not an error
      fastify.log.info({ correlationId, emrPatientId: d.emrPatientId }, 'Internal: clinical-sync skipped — no linked CRM contact')
      return reply.status(200).send({ ok: true, synced: false, reason: 'no_linked_contact' })
    }

    // Update the contact's risk level if it changed
    const riskChanged = d.riskLevel !== contact.riskLevel
    const updates: Record<string, unknown> = {}
    if (riskChanged) {
      updates.riskLevel = d.riskLevel
    }

    if (Object.keys(updates).length > 0) {
      await prisma.contact.update({
        where: { id: contact.id },
        data: updates,
      })
    }

    // ── Automated care gap identification ────────────────────────────────────
    // Evaluate gap rules against active conditions and open any gaps that are
    // not already open for this contact.
    const triggeredRules = identifyGapsFromConditions(d.activeConditions)
    const newGaps: string[] = []
    interface NewGapRecord { id: string; gapType: string; description: string }
    const newGapRecords: NewGapRecord[] = []

    for (const rule of triggeredRules) {
      const exists = await prisma.careGap.findFirst({
        where: {
          contactId: contact.id,
          gapType: rule.gapType as never,
          status: { in: ['open', 'in_progress'] },
        },
      })
      if (!exists) {
        const created = await prisma.careGap.create({
          data: {
            contactId: contact.id,
            gapType: rule.gapType,
            description: rule.description,
            status: 'open',
            priority: rule.priority,
            identifiedBy: 'system',
          },
        })
        newGaps.push(rule.gapType)
        newGapRecords.push({ id: created.id, gapType: rule.gapType, description: rule.description })
      }
    }

    // Log a system communication event so care coordinators can see the clinical update in the timeline
    const conditionSummary = d.activeConditions.slice(0, 3).map(c => c.display).join(', ')
    const newGapSummary = newGaps.length > 0 ? ` Opened ${newGaps.length} new care gap(s): ${newGaps.join(', ')}.` : ''
    const message = `EMR clinical update (${d.triggerType.replace(/_/g, ' ')}). Active conditions: ${conditionSummary || 'none'}. Open care gaps: ${d.openCareGapCount}.${newGapSummary}`

    await prisma.communication.create({
      data: {
        contactId: contact.id,
        type: 'system_event',
        direction: 'inbound',
        subject: 'EMR Clinical Update',
        content: message,
        status: 'received',
        sentBy: null,
        sentAt: new Date(),
      },
    })

    // Dispatch webhook events + Redis pub/sub (fire-and-forget)
    if (riskChanged) {
      dispatchWebhookEvent('contact.risk_level_changed', {
        contactId: contact.id,
        emrPatientId: d.emrPatientId,
        previousRiskLevel: contact.riskLevel,
        newRiskLevel: d.riskLevel,
      }).catch(() => {})
      publishContactRiskChanged(
        {
          contactId: contact.id,
          emrPatientId: d.emrPatientId,
          riskLevel: d.riskLevel,
          previousRiskLevel: contact.riskLevel,
        },
        correlationId,
      )
    }
    for (const gap of newGapRecords) {
      dispatchWebhookEvent('care_gap.opened', {
        contactId: contact.id,
        gapType: gap.gapType,
        trigger: 'clinical_sync',
      }).catch(() => {})
      publishCareGapOpened(
        { careGapId: gap.id, contactId: contact.id, title: gap.description },
        correlationId,
      )
    }

    fastify.log.info({ correlationId, contactId: contact.id, emrPatientId: d.emrPatientId, triggerType: d.triggerType, newGaps }, 'Internal: clinical-sync complete')
    return reply.status(200).send({ ok: true, synced: true, contactId: contact.id, newGapsOpened: newGaps.length })
  })

  /**
   * PATCH /internal/contacts/:crmContactId/programme-update
   * Called by Admin when a programme enrollment state changes.
   */
  fastify.patch('/internal/contacts/:crmContactId/programme-update',
    async (request: FastifyRequest<{ Params: { crmContactId: string } }>, reply: FastifyReply) => {
      if (!validateInternalToken(request, reply)) return
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { crmContactId } = request.params

      const schema = z.object({
        programmeId: z.string(),
        programmeName: z.string(),
        state: z.string(),
        memberId: z.string(),
      })
      const parsed = schema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: parsed.error.errors.map(e => e.message).join(', '), correlationId })
      }

      const d = parsed.data
      const contact = await prisma.contact.findUnique({ where: { id: crmContactId }, select: { id: true } })
      if (!contact) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: `Contact ${crmContactId} not found`, correlationId })
      }

      // Log as system event on the contact timeline
      await prisma.communication.create({
        data: {
          contactId: crmContactId,
          type: 'system_event',
          direction: 'inbound',
          subject: 'Programme Enrollment Update',
          content: `Admin: Programme "${d.programmeName}" — enrollment status changed to "${d.state}".`,
          status: 'received',
          sentBy: null,
          sentAt: new Date(),
        },
      })

      fastify.log.info({ correlationId, crmContactId, programmeId: d.programmeId, state: d.state }, 'Internal: programme-update logged')
      return reply.status(200).send({ ok: true })
    }
  )

  /**
   * PATCH /internal/contacts/:crmContactId/link-emr
   * Called by Admin after EMR patient creation — stores the EMR patient ID on the CRM contact
   * so that subsequent clinical syncs from the EMR can find the right contact.
   */
  fastify.patch('/internal/contacts/:crmContactId/link-emr',
    async (request: FastifyRequest<{ Params: { crmContactId: string } }>, reply: FastifyReply) => {
      if (!validateInternalToken(request, reply)) return
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { crmContactId } = request.params

      const schema = z.object({ emrPatientId: z.string().min(1) })
      const parsed = schema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: 'emrPatientId is required', correlationId })
      }

      const contact = await prisma.contact.findUnique({ where: { id: crmContactId }, select: { id: true } })
      if (!contact) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: `Contact ${crmContactId} not found`, correlationId })
      }

      await prisma.contact.update({
        where: { id: crmContactId },
        data: { emrPatientId: parsed.data.emrPatientId },
      })

      fastify.log.info({ correlationId, crmContactId, emrPatientId: parsed.data.emrPatientId }, 'Internal: EMR patient ID linked to CRM contact')
      return reply.status(200).send({ ok: true })
    }
  )

  /**
   * PATCH /internal/contacts/:crmContactId/risk-update
   * Called by Admin when a member's risk level changes.
   */
  fastify.patch('/internal/contacts/:crmContactId/risk-update',
    async (request: FastifyRequest<{ Params: { crmContactId: string } }>, reply: FastifyReply) => {
      if (!validateInternalToken(request, reply)) return
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { crmContactId } = request.params

      const schema = z.object({ riskLevel: z.enum(['low', 'medium', 'high', 'critical']) })
      const parsed = schema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: 'riskLevel must be low|medium|high|critical', correlationId })
      }

      await prisma.contact.update({
        where: { id: crmContactId },
        data: { riskLevel: parsed.data.riskLevel },
      })

      fastify.log.info({ correlationId, crmContactId, riskLevel: parsed.data.riskLevel }, 'Internal: risk level synced from Admin')
      return reply.status(200).send({ ok: true })
    }
  )
}
