import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../lib/prisma'

const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN ?? 'dev-internal-secret'

function validateInternalToken(request: FastifyRequest, reply: FastifyReply): boolean {
  const auth = request.headers['authorization']
  if (!auth || auth !== `Bearer ${INTERNAL_TOKEN}`) {
    reply.status(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Invalid internal service token' })
    return false
  }
  return true
}

const createPatientSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  gender: z.enum(['male', 'female', 'other', 'unknown']).optional().default('unknown'),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional(),
  adminMemberId: z.string(), // stored as adminMemberId for traceability
})

export async function emrInternalRoutes(fastify: FastifyInstance) {
  /**
   * POST /internal/patients
   * Called by Admin when a Member is created — creates the linked EMR Patient.
   */
  fastify.post(
    '/internal/patients',
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!validateInternalToken(request, reply)) return

      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const parsed = createPatientSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400, error: 'Bad Request',
          message: parsed.error.errors.map(e => e.message).join(', '),
          correlationId,
        })
      }

      const { firstName, lastName, dateOfBirth, gender, phone, email, adminMemberId } = parsed.data

      // Check if a patient already exists for this adminMemberId to avoid duplicates
      const existing = await prisma.patient.findFirst({
        where: { adminMemberId },
        select: { id: true },
      })
      if (existing) {
        return reply.status(200).send({ patientId: existing.id })
      }

      // Generate MRN: MRN-YYYYMMDD-NNNN
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const count = await prisma.patient.count()
      const mrn = `MRN-${dateStr}-${String(count + 1).padStart(4, '0')}`

      const patient = await prisma.patient.create({
        data: {
          firstName,
          lastName,
          preferredName: null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date('1900-01-01'),
          gender: gender ?? 'unknown',
          phone: phone ?? null,
          email: email ?? null,
          mrn,
          isActive: true,
          adminMemberId,
        },
        select: { id: true },
      })

      fastify.log.info({ correlationId, patientId: patient.id, adminMemberId }, 'Internal: patient created from Admin member')

      return reply.status(201).send({ patientId: patient.id })
    }
  )
}
