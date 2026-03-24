import Fastify, { type FastifyError } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from './lib/prisma'
import { authRoutes } from './routes/auth'

const PORT = parseInt(process.env.PORT ?? process.env.AUTH_PORT ?? '3001', 10)
const NODE_ENV = process.env.NODE_ENV ?? 'development'
const CORS_ORIGIN = process.env.CORS_ORIGIN

// ─── Bootstrap ────────────────────────────────────────────────────────────────

async function bootstrap() {
  const fastify = Fastify({
    logger: {
      level: NODE_ENV === 'production' ? 'info' : 'debug',
      // Structured JSON logging with service context on every line
      base: { service: 'auth-service', env: NODE_ENV },
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
    origin: CORS_ORIGIN
      ? CORS_ORIGIN.split(',').map((o) => o.trim())
      : NODE_ENV === 'production'
        ? ['https://app.patienthealth.io']
        : true,
    credentials: true,
  })

  // ── Rate limiting ─────────────────────────────────────────────────────────
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    // Custom key generator attaches correlationId for tracing
    keyGenerator: (req) => {
      return req.ip
    },
    errorResponseBuilder: (_request, context) => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${context.after}`,
      correlationId: uuidv4(),
    }),
  })

  // ── Correlation ID hook ───────────────────────────────────────────────────
  // Ensures every request has a correlationId for distributed tracing.
  fastify.addHook('onRequest', async (request) => {
    if (!request.headers['x-correlation-id']) {
      request.headers['x-correlation-id'] = uuidv4()
    }
  })

  // ── Routes ────────────────────────────────────────────────────────────────
  await fastify.register(authRoutes)

  // ── Health endpoints ──────────────────────────────────────────────────────

  fastify.get('/health', async (_request, reply) => {
    return reply.status(200).send({
      status: 'ok',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    })
  })

  fastify.get('/ready', async (_request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`
      return reply.status(200).send({
        status: 'ready',
        service: 'auth-service',
        database: 'connected',
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      fastify.log.error({ err }, 'Readiness check failed — DB unreachable')
      return reply.status(503).send({
        status: 'not ready',
        service: 'auth-service',
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

  // ── Start ─────────────────────────────────────────────────────────────────
  await fastify.listen({ port: PORT, host: '0.0.0.0' })
  fastify.log.info({ port: PORT }, 'Auth service listening')
}

bootstrap().catch((err) => {
  console.error('Fatal: failed to start auth-service', err)
  process.exit(1)
})
