import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../lib/prisma'
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getAccessTokenTtlSeconds,
} from '../lib/jwt'
import type { ApiError, AuthTokensDto, UserDto } from '@patient-health/types'

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildError(
  statusCode: number,
  error: string,
  message: string,
  correlationId: string
): ApiError {
  return { statusCode, error, message, correlationId }
}

function getRefreshTokenExpiry(): Date {
  const raw = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d'
  const match = raw.match(/^(\d+)d$/)
  const days = match ? parseInt(match[1], 10) : 7
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + days)
  return expiry
}

function getRolePermissions(role: string): string[] {
  const permissionMap: Record<string, string[]> = {
    physician: [
      'patient:read',
      'patient:write',
      'chart:read',
      'chart:write',
      'document:sign',
      'order:create',
      'order:sign',
      'prescription:create',
    ],
    app: [
      'patient:read',
      'patient:write',
      'chart:read',
      'chart:write',
      'document:sign',
      'order:create',
      'prescription:create',
    ],
    nurse: ['patient:read', 'chart:read', 'chart:write', 'vitals:write', 'document:read'],
    front_desk: ['patient:read', 'patient:write', 'appointment:read', 'appointment:write'],
    billing: [
      'patient:read',
      'insurance:read',
      'insurance:write',
      'billing:read',
      'billing:write',
    ],
    admin: ['*'],
    patient: ['patient:read:own', 'appointment:read:own'],
  }
  return permissionMap[role] ?? []
}

// ─── Route registration ───────────────────────────────────────────────────────

export async function authRoutes(fastify: FastifyInstance) {
  /**
   * POST /auth/login
   * Validates credentials, returns access + refresh tokens.
   */
  fastify.post('/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()

    const parseResult = loginSchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply
        .status(400)
        .send(buildError(400, 'Bad Request', parseResult.error.errors[0].message, correlationId))
    }

    const { email, password } = parseResult.data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.isActive) {
      // Constant-time comparison to prevent user enumeration timing attacks
      await bcrypt.compare(password, '$2b$12$invalidhashtopreventtimingattack00000000000')
      return reply
        .status(401)
        .send(buildError(401, 'Unauthorized', 'Invalid email or password', correlationId))
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash)
    if (!passwordValid) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN_FAILED',
          ipAddress: request.ip,
          correlationId,
        },
      })
      return reply
        .status(401)
        .send(buildError(401, 'Unauthorized', 'Invalid email or password', correlationId))
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessToken = signAccessToken(user.id, user.role as any)
    const refreshToken = signRefreshToken(user.id)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN_SUCCESS',
        ipAddress: request.ip,
        correlationId,
      },
    })

    const response: AuthTokensDto = {
      accessToken,
      refreshToken,
      expiresIn: getAccessTokenTtlSeconds(),
    }

    return reply.status(200).send(response)
  })

  /**
   * POST /auth/refresh
   * Validates a refresh token and issues a new access token.
   */
  fastify.post('/auth/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()

    const parseResult = refreshSchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply
        .status(400)
        .send(buildError(400, 'Bad Request', parseResult.error.errors[0].message, correlationId))
    }

    const { refreshToken } = parseResult.data

    let payload
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch {
      return reply
        .status(401)
        .send(
          buildError(401, 'Unauthorized', 'Invalid or expired refresh token', correlationId)
        )
    }

    const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      return reply
        .status(401)
        .send(buildError(401, 'Unauthorized', 'Refresh token has been revoked', correlationId))
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user || !user.isActive) {
      return reply
        .status(401)
        .send(buildError(401, 'Unauthorized', 'User account is inactive', correlationId))
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newAccessToken = signAccessToken(user.id, user.role as any)

    return reply.status(200).send({
      accessToken: newAccessToken,
      expiresIn: getAccessTokenTtlSeconds(),
    })
  })

  /**
   * POST /auth/logout
   * Revokes the provided refresh token. Idempotent — silently succeeds.
   */
  fastify.post('/auth/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()

    const parseResult = refreshSchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply
        .status(400)
        .send(buildError(400, 'Bad Request', 'Refresh token is required', correlationId))
    }

    await prisma.refreshToken.updateMany({
      where: { token: parseResult.data.refreshToken },
      data: { isRevoked: true },
    })

    return reply.status(204).send()
  })

  /**
   * GET /auth/me
   * Returns the authenticated user. Requires Bearer access token.
   */
  fastify.get('/auth/me', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
    const authHeader = request.headers['authorization']

    if (!authHeader?.startsWith('Bearer ')) {
      return reply
        .status(401)
        .send(buildError(401, 'Unauthorized', 'Missing authorization header', correlationId))
    }

    const token = authHeader.slice(7)
    let userId: string

    try {
      const payload = verifyAccessToken(token)
      userId = payload.sub
    } catch {
      return reply
        .status(401)
        .send(buildError(401, 'Unauthorized', 'Invalid or expired access token', correlationId))
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.isActive) {
      return reply
        .status(404)
        .send(buildError(404, 'Not Found', 'User not found', correlationId))
    }

    const response: UserDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      role: user.role as any,
      permissions: getRolePermissions(user.role),
    }

    return reply.status(200).send(response)
  })
}
