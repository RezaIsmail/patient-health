import Fastify, { type FastifyError } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import jwt from '@fastify/jwt'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from './lib/prisma'
import { patientRoutes } from './routes/patients'

const PORT = parseInt(process.env.EMR_PORT ?? '3002', 10)
const NODE_ENV = process.env.NODE_ENV ?? 'development'
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret-change-in-prod'

async function bootstrap() {
  const fastify = Fastify({
    logger: {
      level: NODE_ENV === 'production' ? 'info' : 'debug',
      base: { service: 'emr-service', env: NODE_ENV },
      serializers: {
        req(req) {
          return {
            method: req.method,
            url: req.url,
            correlationId: req.headers['x-correlation-id'] ?? null,
          }
        },
      },
    },
    genReqId: () => uuidv4(),
  })

  // ── Security headers ──────────────────────────────────────────────────────
  await fastify.register(helmet, {
    contentSecurityPolicy: NODE_ENV === 'production',
  })

  // ── CORS ──────────────────────────────────────────────────────────────────
  await fastify.register(cors, {
    origin: NODE_ENV === 'production' ? ['https://app.patienthealth.io'] : true,
    credentials: true,
  })

  // ── Rate limiting ─────────────────────────────────────────────────────────
  await fastify.register(rateLimit, {
    max: 200,
    timeWindow: '1 minute',
    errorResponseBuilder: (_request, context) => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${context.after}`,
      correlationId: uuidv4(),
    }),
  })

  // ── JWT plugin ────────────────────────────────────────────────────────────
  await fastify.register(jwt, { secret: JWT_ACCESS_SECRET })

  // ── Correlation ID hook ───────────────────────────────────────────────────
  fastify.addHook('onRequest', async (request) => {
    if (!request.headers['x-correlation-id']) {
      request.headers['x-correlation-id'] = uuidv4()
    }
  })

  // ── JWT auth preHandler for all /api routes ───────────────────────────────
  fastify.addHook('preHandler', async (request, reply) => {
    // Skip auth for health endpoints
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
      const decoded = fastify.jwt.verify(token) as { sub: string; role: string }
      ;(request as typeof request & { userId: string; userRole: string }).userId = decoded.sub
      ;(request as typeof request & { userId: string; userRole: string }).userRole = decoded.role
    } catch {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid or expired access token',
        correlationId,
      })
    }
  })

  // ── Routes ────────────────────────────────────────────────────────────────
  await fastify.register(patientRoutes)

  // ── Health endpoints ──────────────────────────────────────────────────────
  fastify.get('/health', async (_request, reply) => {
    return reply.status(200).send({
      status: 'ok',
      service: 'emr-service',
      timestamp: new Date().toISOString(),
    })
  })

  fastify.get('/ready', async (_request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`
      return reply.status(200).send({
        status: 'ready',
        service: 'emr-service',
        database: 'connected',
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      fastify.log.error({ err }, 'Readiness check failed — DB unreachable')
      return reply.status(503).send({
        status: 'not ready',
        service: 'emr-service',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      })
    }
  })

  // ── Global error handler ──────────────────────────────────────────────────
  fastify.setErrorHandler((error: FastifyError, request, reply) => {
    const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
    fastify.log.error({ err: error, correlationId }, 'Unhandled error')

    const statusCode = error.statusCode ?? 500
    return reply.status(statusCode).send({
      statusCode,
      error: statusCode === 500 ? 'Internal Server Error' : error.name,
      message:
        NODE_ENV === 'production' && statusCode === 500
          ? 'An unexpected error occurred'
          : error.message,
      correlationId,
    })
  })

  await fastify.listen({ port: PORT, host: '0.0.0.0' })
  fastify.log.info({ port: PORT }, 'EMR service listening')
}

bootstrap().catch((err) => {
  console.error('Fatal: failed to start emr-service', err)
  process.exit(1)
})
