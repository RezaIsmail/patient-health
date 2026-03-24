import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../lib/prisma'

/**
 * EMR Integration Routes
 *
 * Provides a read-only window into the EMR clinical record for contacts
 * that have an `emrPatientId` linked. The CRM service proxies requests
 * to the EMR service using the caller's JWT token (same JWT secret).
 *
 * All EMR data is read-only from the CRM — writes go through the EMR directly.
 * Graceful degradation: if the EMR service is unavailable, returns { available: false }.
 */

const EMR_SERVICE_URL = process.env.EMR_SERVICE_URL ?? 'http://emr-service:3002'

function cid(request: FastifyRequest): string {
  return (request.headers['x-correlation-id'] as string) ?? uuidv4()
}

function buildError(statusCode: number, error: string, message: string, correlationId: string) {
  return { statusCode, error, message, correlationId }
}

function getUserId(request: FastifyRequest): string {
  return (request as FastifyRequest & { userId: string }).userId ?? 'unknown'
}

async function fetchEmr<T>(
  path: string,
  authHeader: string,
  correlationId: string
): Promise<{ ok: true; data: T } | { ok: false; reason: string }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5s timeout

    const response = await fetch(`${EMR_SERVICE_URL}${path}`, {
      headers: {
        Authorization: authHeader,
        'x-correlation-id': correlationId,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      return { ok: false, reason: `EMR returned ${response.status}` }
    }

    const body = await response.json() as T
    return { ok: true, data: body }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown error'
    return { ok: false, reason: `EMR unavailable: ${message}` }
  }
}

export async function emrIntegrationRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/contacts/:contactId/emr-summary
   *
   * Returns a read-only clinical summary for a CRM contact that has an
   * `emrPatientId` linked. Proxies to the EMR service's /api/patients/:id/chart.
   *
   * Response:
   *   { available: true, data: { patient, activeProblems, medications, allergies, recentVitals, ... } }
   *   { available: false, reason: "..." }  (graceful degradation)
   */
  fastify.get(
    '/api/contacts/:contactId/emr-summary',
    async (request: FastifyRequest<{ Params: { contactId: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { contactId } = request.params

      // Look up contact and its EMR link
      const contact = await prisma.contact.findUnique({
        where: { id: contactId },
        select: { id: true, emrPatientId: true, firstName: true, lastName: true },
      })

      if (!contact) {
        return reply.status(404).send(buildError(404, 'Not Found', `Contact ${contactId} not found`, correlationId))
      }

      if (!contact.emrPatientId) {
        return reply.status(200).send({
          data: {
            available: false,
            reason: 'No EMR patient link configured for this contact',
            linked: false,
          },
        })
      }

      // Audit the cross-system access
      prisma.auditLog
        .create({
          data: {
            contactId,
            userId,
            action: 'READ',
            resourceType: 'EmrClinicalSummary',
            resourceId: contact.emrPatientId,
            ipAddress: request.ip ?? null,
            correlationId,
          },
        })
        .catch(() => null)

      // Forward the caller's JWT to the EMR service (same JWT secret)
      const authHeader = request.headers['authorization'] as string

      const result = await fetchEmr<{ data: { patient: unknown; activeProblems: unknown[]; medications: unknown[]; allergies: unknown[]; recentVitals: unknown; immunisations: unknown[] } }>(
        `/api/patients/${contact.emrPatientId}/chart`,
        authHeader,
        correlationId
      )

      if (!result.ok) {
        fastify.log.warn({ correlationId, contactId, reason: result.reason }, 'EMR integration unavailable')
        return reply.status(200).send({
          data: {
            available: false,
            linked: true,
            emrPatientId: contact.emrPatientId,
            reason: result.reason,
          },
        })
      }

      return reply.status(200).send({
        data: {
          available: true,
          linked: true,
          emrPatientId: contact.emrPatientId,
          summary: result.data.data,
        },
      })
    }
  )

  /**
   * POST /api/contacts/:contactId/emr-link
   * Link or update the EMR patient ID for a contact.
   */
  fastify.post(
    '/api/contacts/:contactId/emr-link',
    async (request: FastifyRequest<{ Params: { contactId: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { contactId } = request.params

      const body = request.body as { emrPatientId?: string }
      if (!body?.emrPatientId) {
        return reply.status(400).send(buildError(400, 'Bad Request', 'emrPatientId is required', correlationId))
      }

      const contact = await prisma.contact.findUnique({ where: { id: contactId }, select: { id: true } })
      if (!contact) {
        return reply.status(404).send(buildError(404, 'Not Found', `Contact ${contactId} not found`, correlationId))
      }

      // Verify the EMR patient exists before linking
      const authHeader = request.headers['authorization'] as string
      const emrCheck = await fetchEmr<unknown>(
        `/api/patients/${body.emrPatientId}`,
        authHeader,
        correlationId
      )

      if (!emrCheck.ok) {
        return reply.status(422).send(
          buildError(422, 'Unprocessable Entity', `EMR patient ${body.emrPatientId} not found or EMR unavailable`, correlationId)
        )
      }

      const updated = await prisma.contact.update({
        where: { id: contactId },
        data: { emrPatientId: body.emrPatientId },
        select: { id: true, emrPatientId: true },
      })

      prisma.auditLog
        .create({
          data: {
            contactId,
            userId,
            action: 'UPDATE',
            resourceType: 'Contact',
            resourceId: contactId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            changes: { emrPatientId: body.emrPatientId } as any,
            ipAddress: request.ip ?? null,
            correlationId,
          },
        })
        .catch(() => null)

      return reply.status(200).send({ data: updated })
    }
  )
}
