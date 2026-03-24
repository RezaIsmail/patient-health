import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { Prisma } from '../generated/prisma'
import { prisma } from '../lib/prisma'
import { startOfDay, subDays, subMinutes } from 'date-fns'

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function analyticsRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/analytics/dashboard
   */
  fastify.get('/api/analytics/dashboard', async (_request: FastifyRequest, reply: FastifyReply) => {
    const todayStart = startOfDay(new Date())

    const [
      totalMembers,
      activeMembers,
      membersByRisk,
      totalProgrammes,
      activeProgrammes,
      enrollmentsByState,
      auditEventsToday,
      totalRoles,
    ] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { status: 'active' } }),
      prisma.member.groupBy({
        by: ['riskLevel'],
        _count: { riskLevel: true },
        orderBy: { _count: { riskLevel: 'desc' } },
      }),
      prisma.programme.count(),
      prisma.programme.count({ where: { status: 'active' } }),
      prisma.programmeEnrollment.groupBy({
        by: ['state'],
        _count: { state: true },
        orderBy: { _count: { state: 'desc' } },
      }),
      prisma.auditEvent.count({
        where: { timestamp: { gte: todayStart } },
      }),
      prisma.role.count(),
    ])

    // Check active alert rules for any currently-breached thresholds
    const activeRules = await prisma.auditAlertRule.findMany({ where: { isActive: true } })
    const recentAlerts: Array<{ ruleId: string; name: string; severity: string; message: string; timestamp: string }> = []

    for (const rule of activeRules) {
      const windowStart = subMinutes(new Date(), rule.windowMinutes)
      const where: Record<string, unknown> = { timestamp: { gte: windowStart } }
      if (rule.service) where.service = rule.service
      if (rule.entityType) where.entityType = rule.entityType
      if (rule.action) where.action = rule.action
      if (rule.actorRole) where.actorRole = rule.actorRole

      const count = await prisma.auditEvent.count({ where: where as Prisma.AuditEventWhereInput })
      if (count >= rule.threshold) {
        recentAlerts.push({
          ruleId: rule.id,
          name: rule.name,
          severity: rule.severity,
          message: `Rule "${rule.name}" breached: ${count} events in last ${rule.windowMinutes}min (threshold: ${rule.threshold})`,
          timestamp: new Date().toISOString(),
        })
      }
    }

    return reply.status(200).send({
      data: {
        members: {
          total: totalMembers,
          active: activeMembers,
          byRisk: membersByRisk.map((r) => ({
            riskLevel: r.riskLevel,
            count: r._count.riskLevel,
          })),
        },
        programmes: {
          total: totalProgrammes,
          active: activeProgrammes,
          enrollmentsByState: enrollmentsByState.map((e) => ({
            state: e.state,
            count: e._count.state,
          })),
        },
        system: {
          auditEventsToday,
          recentAlerts,
        },
        users: {
          total: totalRoles,
          activeToday: 0,
        },
      },
    })
  })

  /**
   * GET /api/analytics/programmes
   * Programme performance dashboard: enrollment velocity, state funnel,
   * consent rates, and disenrollment reason breakdown per programme.
   */
  fastify.get('/api/analytics/programmes', async (_request: FastifyRequest, reply: FastifyReply) => {
    const thirtyDaysAgo = subDays(new Date(), 30)

    const [
      programmes,
      enrollmentsByProgrammeAndState,
      newEnrollmentsLast30d,
      consentsByEnrollment,
      disenrollmentReasons,
    ] = await Promise.all([
      // All active programmes
      prisma.programme.findMany({
        where: { status: 'active' },
        select: { id: true, name: true, programmeType: true, enrollmentCapacity: true },
        orderBy: { name: 'asc' },
      }),

      // Enrollment counts grouped by programme + state
      prisma.programmeEnrollment.groupBy({
        by: ['programmeId', 'state'],
        _count: { id: true },
      }),

      // New enrollments in the last 30 days per programme
      prisma.programmeEnrollment.groupBy({
        by: ['programmeId'],
        where: { createdAt: { gte: thirtyDaysAgo } },
        _count: { id: true },
      }),

      // Active consents per enrollment to compute consent rate
      prisma.consent.groupBy({
        by: ['enrollmentId'],
        where: {
          status: 'active',
          enrollmentId: { not: null },
        },
        _count: { id: true },
      }),

      // Disenrollment reason codes (non-null, last 30 days)
      prisma.programmeEnrollment.groupBy({
        by: ['programmeId', 'reasonCode'],
        where: {
          state: 'disenrolled',
          disenrolledAt: { gte: thirtyDaysAgo },
          reasonCode: { not: null },
        },
        _count: { id: true },
      }),
    ])

    // Build per-programme stats
    const enrolledEnrollmentIds = new Set(consentsByEnrollment.map((c) => c.enrollmentId))

    const programmeStats = programmes.map((prog) => {
      const states = enrollmentsByProgrammeAndState.filter((e) => e.programmeId === prog.id)
      const stateFunnel: Record<string, number> = {}
      let totalEnrollments = 0
      for (const s of states) {
        stateFunnel[s.state] = s._count.id
        totalEnrollments += s._count.id
      }

      const velocity = newEnrollmentsLast30d.find((e) => e.programmeId === prog.id)?._count.id ?? 0

      // Consent rate: consented + enrolled + active states / total
      const consentedCount = (stateFunnel['consented'] ?? 0) + (stateFunnel['enrolled'] ?? 0) + (stateFunnel['active'] ?? 0) + (stateFunnel['graduated'] ?? 0)
      const eligibleForConsent = totalEnrollments - (stateFunnel['referred'] ?? 0) - (stateFunnel['declined'] ?? 0)
      const consentRate = eligibleForConsent > 0
        ? Math.round((consentedCount / eligibleForConsent) * 100)
        : 0

      const disenrollReasons = disenrollmentReasons
        .filter((d) => d.programmeId === prog.id)
        .map((d) => ({ reason: d.reasonCode ?? 'unspecified', count: d._count.id }))
        .sort((a, b) => b.count - a.count)

      const capacityUtilisation = prog.enrollmentCapacity
        ? Math.round(((stateFunnel['active'] ?? 0) / prog.enrollmentCapacity) * 100)
        : null

      return {
        programmeId: prog.id,
        name: prog.name,
        type: prog.programmeType,
        totalEnrollments,
        stateFunnel,
        velocityLast30d: velocity,
        consentRate,
        capacityUtilisation,
        disenrollmentReasons: disenrollReasons,
      }
    })

    // Overall consent and disenrollment summary
    const totalActiveEnrollments = enrollmentsByProgrammeAndState
      .filter((e) => e.state === 'active')
      .reduce((sum, e) => sum + e._count.id, 0)

    const totalVelocity = newEnrollmentsLast30d.reduce((sum, e) => sum + e._count.id, 0)

    return reply.status(200).send({
      data: {
        summary: {
          activeProgrammes: programmes.length,
          totalActiveEnrollments,
          newEnrollmentsLast30d: totalVelocity,
          consentedEnrollmentCount: enrolledEnrollmentIds.size,
        },
        programmes: programmeStats,
      },
    })
  })

  /**
   * GET /api/analytics/compliance
   * Compliance dashboard: audit event volume trends, sensitive action breakdown,
   * role change activity, and service-level distribution.
   */
  fastify.get('/api/analytics/compliance', async (_request: FastifyRequest, reply: FastifyReply) => {
    const now = new Date()
    const thirtyDaysAgo = subDays(now, 30)
    const sevenDaysAgo = subDays(now, 7)
    const todayStart = startOfDay(now)

    const [
      totalLast30d,
      byService,
      byAction,
      byEntityType,
      deleteActionsLast30d,
      roleGrantsLast30d,
      roleRevocationsLast30d,
      sensitiveViewsToday,
      dailyVolume,
    ] = await Promise.all([
      // Total audit events last 30 days
      prisma.auditEvent.count({
        where: { timestamp: { gte: thirtyDaysAgo } },
      }),

      // By service (last 30d)
      prisma.auditEvent.groupBy({
        by: ['service'],
        where: { timestamp: { gte: thirtyDaysAgo } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),

      // By action (last 30d)
      prisma.auditEvent.groupBy({
        by: ['action'],
        where: { timestamp: { gte: thirtyDaysAgo } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),

      // By entity type (last 30d, top 10)
      prisma.auditEvent.groupBy({
        by: ['entityType'],
        where: { timestamp: { gte: thirtyDaysAgo } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),

      // Delete actions last 30d (high sensitivity)
      prisma.auditEvent.count({
        where: {
          action: 'delete',
          timestamp: { gte: thirtyDaysAgo },
        },
      }),

      // Role grants last 30d
      prisma.userRole.count({
        where: { grantedAt: { gte: thirtyDaysAgo } },
      }),

      // Role revocations last 30d
      prisma.userRole.count({
        where: {
          revokedAt: { gte: thirtyDaysAgo, not: null },
        },
      }),

      // Sensitive record views today (view actions on member/patient entities)
      prisma.auditEvent.count({
        where: {
          action: 'view',
          entityType: { in: ['member', 'patient', 'contact'] },
          timestamp: { gte: todayStart },
        },
      }),

      // Daily event volume for trend chart (last 7 days, grouped by day)
      prisma.$queryRaw<Array<{ day: Date; count: bigint }>>`
        SELECT DATE_TRUNC('day', "timestamp") AS day, COUNT(*) AS count
        FROM audit_events
        WHERE "timestamp" >= ${sevenDaysAgo}
        GROUP BY DATE_TRUNC('day', "timestamp")
        ORDER BY day ASC
      `,
    ])

    const trendData = dailyVolume.map((row) => ({
      date: row.day.toISOString().split('T')[0],
      count: Number(row.count),
    }))

    return reply.status(200).send({
      data: {
        summary: {
          totalEventsLast30d: totalLast30d,
          deleteActionsLast30d,
          roleGrantsLast30d,
          roleRevocationsLast30d,
          sensitiveViewsToday,
        },
        byService: byService.map((s) => ({ service: s.service, count: s._count.id })),
        byAction: byAction.map((a) => ({ action: a.action, count: a._count.id })),
        byEntityType: byEntityType.map((e) => ({ entityType: e.entityType, count: e._count.id })),
        trend: trendData,
      },
    })
  })
}
