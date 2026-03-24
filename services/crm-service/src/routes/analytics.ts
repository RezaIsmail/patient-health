import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

export async function analyticsRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/analytics/dashboard
   * Returns operational KPIs for the main CRM dashboard.
   */
  fastify.get('/api/analytics/dashboard', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request as FastifyRequest & { userId: string }).userId ?? 'unknown'

    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const [
      // Referral pipeline
      referralsByStage,
      // Tasks
      overdueTasksCount,
      myOpenTasksCount,
      // Contacts by risk
      contactsByRisk,
      // Care gaps
      openGapsByType,
      // Active care plans
      activeCarePlansCount,
      // Campaign stats
      recentCampaigns,
      // My activity this week
      myTasksCompletedThisWeek,
      myContactsTouchedThisWeek,
    ] = await Promise.all([
      // Referrals grouped by stage (excluding terminal stages)
      prisma.referral.groupBy({
        by: ['stage'],
        where: { stage: { notIn: ['completed', 'declined', 'cancelled'] } },
        _count: { id: true },
      }),

      // Overdue tasks (pending/in_progress past due date)
      prisma.task.count({
        where: {
          status: { in: ['pending', 'in_progress'] },
          dueDate: { lt: now },
        },
      }),

      // My open tasks
      prisma.task.count({
        where: {
          assignedTo: userId,
          status: { in: ['pending', 'in_progress'] },
        },
      }),

      // Active contacts by risk level
      prisma.contact.groupBy({
        by: ['riskLevel'],
        where: { status: 'active' },
        _count: { id: true },
      }),

      // Open care gaps by type
      prisma.careGap.groupBy({
        by: ['gapType'],
        where: { status: { in: ['open', 'in_progress'] } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),

      // Active care plans
      prisma.carePlan.count({ where: { status: 'active' } }),

      // Recent campaigns
      prisma.campaign.findMany({
        where: { status: { in: ['active', 'completed'] } },
        orderBy: { launchedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
          sentCount: true,
          deliveredCount: true,
          openedCount: true,
          respondedCount: true,
          launchedAt: true,
        },
      }),

      // My tasks completed this week
      prisma.task.count({
        where: {
          assignedTo: userId,
          status: 'completed',
          completedAt: { gte: startOfWeek },
        },
      }),

      // My contacts touched this week (created communications)
      prisma.communication.groupBy({
        by: ['contactId'],
        where: {
          sentBy: userId,
          createdAt: { gte: startOfWeek },
        },
        _count: { id: true },
      }),
    ])

    // Build pipeline stage breakdown
    const stageOrder = ['received', 'reviewing', 'authorized', 'scheduled']
    const pipeline = stageOrder.map((stage) => ({
      stage,
      count: referralsByStage.find((r) => r.stage === stage)?._count.id ?? 0,
    }))

    // Compute total open referrals
    const openReferralsCount = pipeline.reduce((sum, s) => sum + s.count, 0)

    // Risk breakdown
    const riskOrder = ['critical', 'high', 'medium', 'low']
    const riskBreakdown = riskOrder.map((level) => ({
      riskLevel: level,
      count: contactsByRisk.find((r) => r.riskLevel === level)?._count.id ?? 0,
    }))
    const totalActiveContacts = contactsByRisk.reduce((sum, r) => sum + r._count.id, 0)

    // Care gap summary (top 5 gap types)
    const gapSummary = openGapsByType.slice(0, 5).map((g) => ({
      gapType: g.gapType,
      count: g._count.id,
    }))
    const totalOpenGaps = openGapsByType.reduce((sum, g) => sum + g._count.id, 0)

    // Campaign performance
    const campaignStats = recentCampaigns.map((c) => ({
      ...c,
      deliveryRate: c.sentCount > 0 ? Math.round((c.deliveredCount / c.sentCount) * 100) : 0,
      openRate: c.deliveredCount > 0 ? Math.round((c.openedCount / c.deliveredCount) * 100) : 0,
      responseRate: c.deliveredCount > 0 ? Math.round((c.respondedCount / c.deliveredCount) * 100) : 0,
    }))

    return reply.status(200).send({
      data: {
        referrals: {
          pipeline,
          openTotal: openReferralsCount,
        },
        tasks: {
          overdueCount: overdueTasksCount,
          myOpenCount: myOpenTasksCount,
        },
        contacts: {
          totalActive: totalActiveContacts,
          byRisk: riskBreakdown,
        },
        careGaps: {
          totalOpen: totalOpenGaps,
          byType: gapSummary,
        },
        carePlans: {
          activeCount: activeCarePlansCount,
        },
        campaigns: campaignStats,
        myActivity: {
          tasksCompletedThisWeek: myTasksCompletedThisWeek,
          contactsTouchedThisWeek: myContactsTouchedThisWeek.length,
        },
      },
    })
  })

  /**
   * GET /api/analytics/referrals
   * Referral source analytics and conversion funnel.
   */
  fastify.get('/api/analytics/referrals', async (_request: FastifyRequest, reply: FastifyReply) => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [byStage, byPriority, recentVolume] = await Promise.all([
      prisma.referral.groupBy({
        by: ['stage'],
        _count: { id: true },
      }),

      prisma.referral.groupBy({
        by: ['priority'],
        where: { stage: { notIn: ['completed', 'declined', 'cancelled'] } },
        _count: { id: true },
      }),

      prisma.referral.groupBy({
        by: ['type'],
        where: { createdAt: { gte: thirtyDaysAgo } },
        _count: { id: true },
      }),
    ])

    return reply.status(200).send({
      data: { byStage, byPriority, recentVolume },
    })
  })

  /**
   * GET /api/analytics/care-gaps
   * Care gap closure rates and open gaps by type.
   */
  fastify.get('/api/analytics/care-gaps', async (_request: FastifyRequest, reply: FastifyReply) => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [openByType, closedThisMonth, totalOpen] = await Promise.all([
      prisma.careGap.groupBy({
        by: ['gapType'],
        where: { status: { in: ['open', 'in_progress'] } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),

      prisma.careGap.count({
        where: {
          status: 'closed',
          closedAt: { gte: thirtyDaysAgo },
        },
      }),

      prisma.careGap.count({
        where: { status: { in: ['open', 'in_progress'] } },
      }),
    ])

    return reply.status(200).send({
      data: { openByType, closedThisMonth, totalOpen },
    })
  })

  /**
   * GET /api/analytics/population-health
   * Population-level cohort breakdown — risk distribution, SDoH flags, care gap burden,
   * care plan coverage, and coordinator workload.
   */
  fastify.get('/api/analytics/population-health', async (_request: FastifyRequest, reply: FastifyReply) => {
    const [
      totalContacts,
      byRiskLevel,
      byStatus,
      sdohFlagCounts,
      gapBurden,
      coordinatorWorkload,
      carePlanCoverage,
      highRiskNoCarePlan,
    ] = await Promise.all([
      // Total active contacts
      prisma.contact.count({ where: { status: 'active' } }),

      // Risk level distribution (all active contacts)
      prisma.contact.groupBy({
        by: ['riskLevel'],
        where: { status: 'active' },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),

      // Contact status breakdown
      prisma.contact.groupBy({
        by: ['status'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),

      // SDoH flag distribution (contacts with each flag)
      prisma.$queryRaw<Array<{ flag: string; count: bigint }>>`
        SELECT unnest("sdoh_flags") AS flag, COUNT(*) AS count
        FROM contacts
        WHERE status = 'active'
        GROUP BY flag
        ORDER BY count DESC
      `,

      // Average care gaps per contact by risk level
      prisma.careGap.groupBy({
        by: ['priority'],
        where: { status: { in: ['open', 'in_progress'] } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),

      // Coordinator workload (contacts assigned per coordinator, top 10)
      prisma.contact.groupBy({
        by: ['assignedTo'],
        where: { status: 'active', assignedTo: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),

      // Care plan coverage: % of active contacts with an active care plan
      prisma.carePlan.groupBy({
        by: ['contactId'],
        where: { status: 'active' },
        _count: { id: true },
      }),

      // High/critical risk contacts with no active care plan
      prisma.contact.count({
        where: {
          status: 'active',
          riskLevel: { in: ['high', 'critical'] },
          carePlans: { none: { status: 'active' } },
        },
      }),
    ])

    const contactsWithCarePlan = carePlanCoverage.length
    const carePlanCoverageRate = totalContacts > 0
      ? Math.round((contactsWithCarePlan / totalContacts) * 100)
      : 0

    return reply.status(200).send({
      data: {
        population: {
          totalActive: totalContacts,
          byRiskLevel: byRiskLevel.map((r) => ({
            riskLevel: r.riskLevel,
            count: r._count.id,
            percentage: totalContacts > 0 ? Math.round((r._count.id / totalContacts) * 100) : 0,
          })),
          byStatus,
        },
        sdohFlags: sdohFlagCounts.map((f) => ({
          flag: f.flag,
          count: Number(f.count),
        })),
        careGaps: {
          openByPriority: gapBurden,
        },
        carePlans: {
          coverageRate: carePlanCoverageRate,
          contactsWithActivePlan: contactsWithCarePlan,
          highRiskWithoutPlan: highRiskNoCarePlan,
        },
        coordinatorWorkload: coordinatorWorkload.map((c) => ({
          coordinatorId: c.assignedTo,
          contactCount: c._count.id,
        })),
      },
    })
  })
}
