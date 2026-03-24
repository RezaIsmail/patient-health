import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { v4 as uuidv4 } from 'uuid'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function correlationId(request: FastifyRequest): string {
  return (request.headers['x-correlation-id'] as string) ?? uuidv4()
}

function buildError(statusCode: number, error: string, message: string, cid: string) {
  return { statusCode, error, message, correlationId: cid }
}

// ─── Mock integration data ────────────────────────────────────────────────────

const INTEGRATION_NAMES = ['emr-sync', 'crm-sync', 'auth-service', 'email-provider', 'sms-provider'] as const
type IntegrationName = (typeof INTEGRATION_NAMES)[number]

interface IntegrationStatus {
  name: IntegrationName
  displayName: string
  status: 'healthy' | 'degraded' | 'down'
  lastSync: string
  errorRateLastHour: number
  latencyP95Ms: number
  messageQueueDepth: number
  description: string
}

function getMockStatus(): IntegrationStatus[] {
  const now = new Date()
  return [
    {
      name: 'emr-sync',
      displayName: 'EMR Sync',
      status: 'healthy',
      lastSync: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
      errorRateLastHour: 0.0,
      latencyP95Ms: 142,
      messageQueueDepth: 0,
      description: 'Bidirectional patient data sync with EMR service',
    },
    {
      name: 'crm-sync',
      displayName: 'CRM Sync',
      status: 'healthy',
      lastSync: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
      errorRateLastHour: 0.2,
      latencyP95Ms: 187,
      messageQueueDepth: 3,
      description: 'Contact and care gap sync with CRM service',
    },
    {
      name: 'auth-service',
      displayName: 'Auth Service',
      status: 'healthy',
      lastSync: new Date(now.getTime() - 30 * 1000).toISOString(),
      errorRateLastHour: 0.0,
      latencyP95Ms: 45,
      messageQueueDepth: 0,
      description: 'JWT validation and SSO token exchange',
    },
    {
      name: 'email-provider',
      displayName: 'Email Provider (SendGrid)',
      status: 'healthy',
      lastSync: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
      errorRateLastHour: 0.5,
      latencyP95Ms: 320,
      messageQueueDepth: 12,
      description: 'Transactional and bulk email via SendGrid',
    },
    {
      name: 'sms-provider',
      displayName: 'SMS Provider (Twilio)',
      status: 'degraded',
      lastSync: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
      errorRateLastHour: 4.2,
      latencyP95Ms: 890,
      messageQueueDepth: 47,
      description: 'SMS notifications and outreach via Twilio',
    },
  ]
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function integrationRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/integrations/status
   */
  fastify.get(
    '/api/integrations/status',
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const integrations = getMockStatus()
      const overallStatus = integrations.some((i) => i.status === 'down')
        ? 'down'
        : integrations.some((i) => i.status === 'degraded')
          ? 'degraded'
          : 'healthy'

      return reply.status(200).send({
        data: {
          integrations,
          overall: overallStatus,
          checkedAt: new Date().toISOString(),
        },
      })
    }
  )

  /**
   * POST /api/integrations/:name/resync
   */
  fastify.post(
    '/api/integrations/:name/resync',
    async (request: FastifyRequest<{ Params: { name: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { name } = request.params

      if (!INTEGRATION_NAMES.includes(name as IntegrationName)) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Integration '${name}' not found`, cid))
      }

      // Mock: In production this would enqueue a resync job
      return reply.status(202).send({
        data: {
          integration: name,
          status: 'resync_queued',
          jobId: uuidv4(),
          queuedAt: new Date().toISOString(),
          message: `Resync for '${name}' has been queued and will complete within 2 minutes`,
        },
      })
    }
  )
}

