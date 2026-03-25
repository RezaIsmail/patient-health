import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import { prisma } from '../lib/prisma'
import { emrClient, crmClient } from '../lib/internalClient'
import { publishMemberCreated } from '../lib/eventPublisher'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUserId(request: FastifyRequest): string {
  return (request as FastifyRequest & { userId: string }).userId ?? 'unknown'
}

function getUserRole(request: FastifyRequest): string {
  return (request as FastifyRequest & { userRole: string }).userRole ?? 'unknown'
}

function correlationId(request: FastifyRequest): string {
  return (request.headers['x-correlation-id'] as string) ?? uuidv4()
}

function buildError(statusCode: number, error: string, message: string, cid: string) {
  return { statusCode, error, message, correlationId: cid }
}

async function generateMemberNumber(): Promise<string> {
  const datePart = format(new Date(), 'yyyyMMdd')
  const prefix = `MEM-${datePart}-`
  const count = await prisma.member.count({
    where: { memberNumber: { startsWith: prefix } },
  })
  const seq = String(count + 1).padStart(4, '0')
  return `${prefix}${seq}`
}

function writeAuditEvent(params: {
  service: string
  entityType: string
  entityId: string
  action: string
  actorId: string
  actorRole?: string
  memberId?: string
  fieldChanges?: unknown
  correlationId?: string
  ipAddress?: string
}) {
  prisma.auditEvent
    .create({
      data: {
        service: params.service,
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        actorId: params.actorId,
        actorRole: params.actorRole ?? null,
        memberId: params.memberId ?? null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fieldChanges: (params.fieldChanges ?? undefined) as any,
        correlationId: params.correlationId ?? null,
        ipAddress: params.ipAddress ?? null,
      },
    })
    .catch((err) => console.error('Audit event write failed:', err))
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const createMemberSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
  sex: z.enum(['male', 'female', 'other', 'unknown']).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().max(255).optional(),
  status: z
    .enum(['pending_verification', 'active', 'suspended', 'inactive', 'deceased'])
    .default('active'),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
  emrPatientId: z.string().optional(),
  crmContactId: z.string().optional(),
  organisationId: z.string().min(1),
  siteId: z.string().min(1).optional(),
})

const updateMemberSchema = createMemberSchema.partial().omit({ organisationId: true })

const listMembersQuerySchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  riskLevel: z.string().optional(),
  organisationId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

const createEnrollmentSchema = z.object({
  programmeId: z.string().min(1),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
})

const transitionEnrollmentSchema = z.object({
  toState: z.enum([
    'referred',
    'screened',
    'eligible',
    'consented',
    'enrolled',
    'active',
    'graduated',
    'disenrolled',
    'transferred',
    'declined',
  ]),
  reasonCode: z.string().optional(),
  notes: z.string().optional(),
})

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function memberRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/members
   */
  fastify.get('/api/members', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const query = listMembersQuerySchema.safeParse(request.query)
    if (!query.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', query.error.message, cid))
    }

    const { q, status, riskLevel, organisationId, page, pageSize } = query.data
    const skip = (page - 1) * pageSize

    const where = {
      ...(q && {
        OR: [
          { firstName: { contains: q, mode: 'insensitive' as const } },
          { lastName: { contains: q, mode: 'insensitive' as const } },
          { memberNumber: { contains: q, mode: 'insensitive' as const } },
          { emrPatientId: { contains: q, mode: 'insensitive' as const } },
        ],
      }),
      ...(status && { status }),
      ...(riskLevel && { riskLevel }),
      ...(organisationId && { organisationId }),
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        include: {
          organisation: { select: { id: true, name: true } },
          site: { select: { id: true, name: true } },
          _count: { select: { enrollments: true } },
        },
      }),
      prisma.member.count({ where }),
    ])

    return reply.status(200).send({
      data: members,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  })

  /**
   * POST /api/members
   */
  fastify.post('/api/members', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const userId = getUserId(request)
    const userRole = getUserRole(request)

    const body = createMemberSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
    }

    const memberNumber = await generateMemberNumber()
    const { dateOfBirth, ...rest } = body.data

    const member = await prisma.member.create({
      data: {
        ...rest,
        memberNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      },
      include: {
        organisation: { select: { id: true, name: true } },
      },
    })

    writeAuditEvent({
      service: 'admin',
      entityType: 'member',
      entityId: member.id,
      action: 'create',
      actorId: userId,
      actorRole: userRole,
      memberId: member.id,
      correlationId: cid,
      ipAddress: request.ip,
    })

    // Publish domain event — fire-and-forget, never block member creation
    publishMemberCreated(
      { memberId: member.id, memberNumber: member.memberNumber, firstName: member.firstName, lastName: member.lastName },
      cid,
    )

    // Fan out to EMR + CRM in parallel — fire-and-forget, never block member creation
    Promise.allSettled([
      emrClient.createPatient({
        firstName: member.firstName,
        lastName: member.lastName,
        dateOfBirth: member.dateOfBirth?.toISOString().slice(0, 10),
        gender: member.sex === 'male' ? 'male' : member.sex === 'female' ? 'female' : 'unknown',
        phone: member.phone ?? undefined,
        email: member.email ?? undefined,
        adminMemberId: member.id,
      }, cid).then(async (result) => {
        if (result.ok) {
          await prisma.member.update({
            where: { id: member.id },
            data: { emrPatientId: result.data.patientId },
          })
          return result.data.patientId
        }
        return null
      }),
      crmClient.createContact({
        firstName: member.firstName,
        lastName: member.lastName,
        dateOfBirth: member.dateOfBirth?.toISOString().slice(0, 10),
        sex: member.sex ?? undefined,
        phone: member.phone ?? undefined,
        email: member.email ?? undefined,
        riskLevel: member.riskLevel,
        adminMemberId: member.id,
      }, cid).then(async (result) => {
        if (result.ok) {
          await prisma.member.update({
            where: { id: member.id },
            data: { crmContactId: result.data.contactId },
          })
          return result.data.contactId
        }
        return null
      }),
    ]).then(async ([emrResult, crmResult]) => {
      // After both complete, link the EMR patient ID onto the CRM contact
      const emrPatientId = emrResult.status === 'fulfilled' ? emrResult.value : null
      const crmContactId = crmResult.status === 'fulfilled' ? crmResult.value : null
      if (emrPatientId && crmContactId) {
        await crmClient.linkEmrPatient(crmContactId, { emrPatientId }, cid).catch(() => null)
      }
    }).catch(() => null)

    return reply.status(201).send({ data: member })
  })

  /**
   * GET /api/members/:id
   */
  fastify.get(
    '/api/members/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const member = await prisma.member.findUnique({
        where: { id },
        include: {
          organisation: { select: { id: true, name: true, type: true } },
          site: { select: { id: true, name: true } },
          enrollments: {
            include: {
              programme: { select: { id: true, name: true, programmeType: true } },
              _count: { select: { transitions: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: { select: { enrollments: true, auditEvents: true } },
        },
      })

      if (!member) {
        return reply.status(404).send(buildError(404, 'Not Found', `Member ${id} not found`, cid))
      }

      return reply.status(200).send({ data: member })
    }
  )

  /**
   * PUT /api/members/:id
   */
  fastify.put(
    '/api/members/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const userId = getUserId(request)
      const userRole = getUserRole(request)
      const { id } = request.params

      const body = updateMemberSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const existing = await prisma.member.findUnique({ where: { id }, select: { id: true, crmContactId: true } })
      if (!existing) {
        return reply.status(404).send(buildError(404, 'Not Found', `Member ${id} not found`, cid))
      }

      const { dateOfBirth, ...rest } = body.data
      const member = await prisma.member.update({
        where: { id },
        data: {
          ...rest,
          ...(dateOfBirth !== undefined && { dateOfBirth: new Date(dateOfBirth) }),
        },
      })

      writeAuditEvent({
        service: 'admin',
        entityType: 'member',
        entityId: id,
        action: 'update',
        actorId: userId,
        actorRole: userRole,
        memberId: id,
        fieldChanges: rest,
        correlationId: cid,
        ipAddress: request.ip,
      })

      // If riskLevel changed and we have a linked CRM contact, sync the update
      if (rest.riskLevel !== undefined && existing.crmContactId) {
        crmClient.updateRiskLevel(existing.crmContactId, { riskLevel: rest.riskLevel }, cid).catch(() => null)
      }

      return reply.status(200).send({ data: member })
    }
  )

  /**
   * DELETE /api/members/:id — soft delete
   */
  fastify.delete(
    '/api/members/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const userId = getUserId(request)
      const userRole = getUserRole(request)
      const { id } = request.params

      const existing = await prisma.member.findUnique({ where: { id }, select: { id: true } })
      if (!existing) {
        return reply.status(404).send(buildError(404, 'Not Found', `Member ${id} not found`, cid))
      }

      await prisma.member.update({ where: { id }, data: { status: 'inactive' } })

      writeAuditEvent({
        service: 'admin',
        entityType: 'member',
        entityId: id,
        action: 'delete',
        actorId: userId,
        actorRole: userRole,
        memberId: id,
        correlationId: cid,
        ipAddress: request.ip,
      })

      return reply.status(200).send({ data: { id, status: 'inactive' } })
    }
  )

  /**
   * GET /api/members/:id/enrollments
   */
  fastify.get(
    '/api/members/:id/enrollments',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const member = await prisma.member.findUnique({ where: { id }, select: { id: true } })
      if (!member) {
        return reply.status(404).send(buildError(404, 'Not Found', `Member ${id} not found`, cid))
      }

      const enrollments = await prisma.programmeEnrollment.findMany({
        where: { memberId: id },
        include: {
          programme: { select: { id: true, name: true, programmeType: true, status: true } },
          transitions: { orderBy: { timestamp: 'desc' }, take: 10 },
        },
        orderBy: { createdAt: 'desc' },
      })

      return reply.status(200).send({ data: enrollments })
    }
  )

  /**
   * POST /api/members/:id/enrollments
   */
  fastify.post(
    '/api/members/:id/enrollments',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const userId = getUserId(request)
      const userRole = getUserRole(request)
      const { id } = request.params

      const body = createEnrollmentSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const member = await prisma.member.findUnique({ where: { id }, select: { id: true } })
      if (!member) {
        return reply.status(404).send(buildError(404, 'Not Found', `Member ${id} not found`, cid))
      }

      const existing = await prisma.programmeEnrollment.findUnique({
        where: { memberId_programmeId: { memberId: id, programmeId: body.data.programmeId } },
        select: { id: true },
      })
      if (existing) {
        return reply
          .status(409)
          .send(
            buildError(
              409,
              'Conflict',
              'Member is already enrolled or referred to this programme',
              cid
            )
          )
      }

      const enrollment = await prisma.programmeEnrollment.create({
        data: {
          memberId: id,
          programmeId: body.data.programmeId,
          assignedTo: body.data.assignedTo ?? null,
          notes: body.data.notes ?? null,
          state: 'referred',
        },
        include: {
          programme: { select: { id: true, name: true } },
        },
      })

      writeAuditEvent({
        service: 'admin',
        entityType: 'programme_enrollment',
        entityId: enrollment.id,
        action: 'create',
        actorId: userId,
        actorRole: userRole,
        memberId: id,
        correlationId: cid,
        ipAddress: request.ip,
      })

      return reply.status(201).send({ data: enrollment })
    }
  )

  /**
   * PUT /api/members/:id/enrollments/:enrollmentId/transition
   */
  fastify.put(
    '/api/members/:id/enrollments/:enrollmentId/transition',
    async (
      request: FastifyRequest<{ Params: { id: string; enrollmentId: string } }>,
      reply: FastifyReply
    ) => {
      const cid = correlationId(request)
      const userId = getUserId(request)
      const userRole = getUserRole(request)
      const { id, enrollmentId } = request.params

      const body = transitionEnrollmentSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const enrollment = await prisma.programmeEnrollment.findUnique({
        where: { id: enrollmentId },
        select: {
          id: true,
          state: true,
          memberId: true,
          programmeId: true,
          programme: { select: { id: true, name: true } },
          member: { select: { crmContactId: true } },
        },
      })
      if (!enrollment || enrollment.memberId !== id) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Enrollment ${enrollmentId} not found`, cid))
      }

      const fromState = enrollment.state
      const { toState, reasonCode, notes } = body.data

      // Timestamp fields
      const timestampUpdates: Record<string, Date> = {}
      if (toState === 'enrolled' || toState === 'active') timestampUpdates.enrolledAt = new Date()
      if (toState === 'graduated') timestampUpdates.graduatedAt = new Date()
      if (toState === 'disenrolled' || toState === 'transferred' || toState === 'declined') {
        timestampUpdates.disenrolledAt = new Date()
      }

      const [updated] = await prisma.$transaction([
        prisma.programmeEnrollment.update({
          where: { id: enrollmentId },
          data: { state: toState, reasonCode: reasonCode ?? null, notes: notes ?? null, ...timestampUpdates },
        }),
        prisma.enrollmentTransition.create({
          data: {
            enrollmentId,
            fromState,
            toState,
            actorId: userId,
            actorRole: userRole,
            reasonCode: reasonCode ?? null,
            notes: notes ?? null,
          },
        }),
      ])

      writeAuditEvent({
        service: 'admin',
        entityType: 'programme_enrollment',
        entityId: enrollmentId,
        action: 'update',
        actorId: userId,
        actorRole: userRole,
        memberId: id,
        fieldChanges: { fromState, toState, reasonCode },
        correlationId: cid,
        ipAddress: request.ip,
      })

      // When transitioning to 'active', notify CRM to log the programme enrollment event
      if (toState === 'active' && enrollment.member.crmContactId) {
        crmClient.updateProgramme(enrollment.member.crmContactId, {
          programmeId: enrollment.programme.id,
          programmeName: enrollment.programme.name,
          state: toState,
          memberId: id,
        }, cid).catch(() => null)
      }

      return reply.status(200).send({ data: updated })
    }
  )
}
