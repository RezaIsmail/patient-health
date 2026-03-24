import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../lib/prisma'

/**
 * FHIR R4 Export Routes
 *
 * Exposes CRM data in HL7 FHIR R4 format for interoperability with external
 * health systems, EHR vendors, and integration middleware (MuleSoft, etc.).
 *
 * Supported resources:
 *   Patient    → CRM Contact
 *   CarePlan   → CRM CarePlan
 *   ServiceRequest → CRM Referral
 *   Bundle     → collection response for search operations
 *
 * Base URL: /fhir/r4/
 */

const SYSTEM_CONTACT_ID = 'https://patienthealth.io/fhir/contact-id'
const SYSTEM_REFERRAL_NUMBER = 'https://patienthealth.io/fhir/referral-number'
const SYSTEM_ICD10 = 'http://hl7.org/fhir/sid/icd-10-cm'
const SYSTEM_SNOMED = 'http://snomed.info/sct'
const SERVER_BASE = process.env.FHIR_BASE_URL ?? 'https://crm.patienthealth.io/fhir/r4'

function cid(request: FastifyRequest): string {
  return (request.headers['x-correlation-id'] as string) ?? uuidv4()
}

function buildError(statusCode: number, error: string, message: string, correlationId: string) {
  return { statusCode, error, message, correlationId }
}

function fhirError(statusCode: number, severity: 'error' | 'warning', code: string, diagnostics: string) {
  return {
    resourceType: 'OperationOutcome',
    issue: [{ severity, code, diagnostics }],
  }
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function contactToFhirPatient(contact: {
  id: string
  firstName: string
  lastName: string
  preferredName?: string | null
  dateOfBirth?: Date | null
  sex?: string | null
  phone?: string | null
  email?: string | null
  addressLine1?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string
  status?: string
  updatedAt: Date
  createdAt: Date
}) {
  const telecom: Array<{ system: string; value: string; use?: string }> = []
  if (contact.phone) telecom.push({ system: 'phone', value: contact.phone, use: 'home' })
  if (contact.email) telecom.push({ system: 'email', value: contact.email })

  const address = contact.addressLine1
    ? [{
        use: 'home',
        line: [contact.addressLine1],
        city: contact.city ?? undefined,
        state: contact.state ?? undefined,
        postalCode: contact.postalCode ?? undefined,
        country: contact.country ?? 'US',
      }]
    : []

  const genderMap: Record<string, string> = {
    male: 'male', female: 'female', unknown: 'unknown', other: 'other',
  }

  return {
    resourceType: 'Patient',
    id: contact.id,
    meta: {
      lastUpdated: contact.updatedAt.toISOString(),
      profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient'],
    },
    identifier: [{ system: SYSTEM_CONTACT_ID, value: contact.id }],
    active: contact.status !== 'inactive' && contact.status !== 'deceased',
    name: [
      {
        use: 'official',
        family: contact.lastName,
        given: [contact.firstName, ...(contact.preferredName ? [] : [])],
      },
      ...(contact.preferredName
        ? [{ use: 'nickname', given: [contact.preferredName] }]
        : []),
    ],
    telecom,
    gender: contact.sex ? (genderMap[contact.sex] ?? 'unknown') : undefined,
    birthDate: contact.dateOfBirth ? contact.dateOfBirth.toISOString().split('T')[0] : undefined,
    address,
    deceasedBoolean: contact.status === 'deceased',
  }
}

function carePlanToFhir(plan: {
  id: string
  contactId: string
  title: string
  description?: string | null
  status: string
  startDate?: Date | null
  endDate?: Date | null
  updatedAt: Date
  problems?: Array<{ id: string; description: string; snomedCode?: string | null; icd10Code?: string | null; status: string }>
  goals?: Array<{ id: string; description: string; status: string; targetDate?: Date | null }>
  interventions?: Array<{ id: string; description: string; type: string; status: string }>
}) {
  const fhirStatusMap: Record<string, string> = {
    draft: 'draft',
    active: 'active',
    completed: 'completed',
    cancelled: 'revoked',
  }

  const addresses = (plan.problems ?? []).map((p) => ({
    reference: { display: p.description },
    code: {
      coding: [
        ...(p.snomedCode ? [{ system: SYSTEM_SNOMED, code: p.snomedCode, display: p.description }] : []),
        ...(p.icd10Code ? [{ system: SYSTEM_ICD10, code: p.icd10Code, display: p.description }] : []),
      ],
      text: p.description,
    },
  }))

  const goal = (plan.goals ?? []).map((g) => ({
    id: g.id,
    lifecycleStatus: g.status === 'achieved' ? 'completed' : g.status === 'not_achieved' ? 'cancelled' : 'active',
    description: { text: g.description },
    target: g.targetDate ? [{ dueDate: g.targetDate.toISOString().split('T')[0] }] : undefined,
  }))

  const activity = (plan.interventions ?? []).map((i) => ({
    detail: {
      status: i.status === 'completed' ? 'completed' : i.status === 'cancelled' ? 'cancelled' : 'in-progress',
      description: i.description,
      code: { text: i.type },
    },
  }))

  return {
    resourceType: 'CarePlan',
    id: plan.id,
    meta: { lastUpdated: plan.updatedAt.toISOString() },
    status: fhirStatusMap[plan.status] ?? 'unknown',
    intent: 'plan',
    title: plan.title,
    description: plan.description ?? undefined,
    subject: { reference: `Patient/${plan.contactId}` },
    period: {
      start: plan.startDate?.toISOString().split('T')[0],
      end: plan.endDate?.toISOString().split('T')[0],
    },
    addresses,
    goal,
    activity,
  }
}

function referralToFhirServiceRequest(ref: {
  id: string
  referralNumber: string
  contactId: string
  type: string
  stage: string
  priority: string
  reasonDisplay: string
  reasonCode?: string | null
  referringProvider?: string | null
  referringOrgName?: string | null
  receivingProvider?: string | null
  receivingOrgName?: string | null
  authorizationNumber?: string | null
  dueDate?: Date | null
  updatedAt: Date
  createdAt: Date
}) {
  const fhirStatusMap: Record<string, string> = {
    received: 'active',
    reviewing: 'active',
    authorized: 'active',
    scheduled: 'active',
    completed: 'completed',
    declined: 'revoked',
    cancelled: 'revoked',
  }

  const fhirPriorityMap: Record<string, string> = {
    emergent: 'stat',
    urgent: 'urgent',
    routine: 'routine',
  }

  return {
    resourceType: 'ServiceRequest',
    id: ref.id,
    meta: { lastUpdated: ref.updatedAt.toISOString() },
    identifier: [{ system: SYSTEM_REFERRAL_NUMBER, value: ref.referralNumber }],
    status: fhirStatusMap[ref.stage] ?? 'unknown',
    intent: 'order',
    priority: fhirPriorityMap[ref.priority] ?? 'routine',
    code: {
      coding: ref.reasonCode
        ? [{ system: SYSTEM_ICD10, code: ref.reasonCode, display: ref.reasonDisplay }]
        : [],
      text: ref.reasonDisplay,
    },
    subject: { reference: `Patient/${ref.contactId}` },
    authoredOn: ref.createdAt.toISOString(),
    occurrenceDateTime: ref.dueDate?.toISOString(),
    requester: ref.referringProvider
      ? { display: ref.referringProvider }
      : ref.referringOrgName
        ? { display: ref.referringOrgName }
        : undefined,
    performer: ref.receivingProvider
      ? [{ display: ref.receivingProvider }]
      : ref.receivingOrgName
        ? [{ display: ref.receivingOrgName }]
        : undefined,
    insurance: ref.authorizationNumber
      ? [{ display: `Auth: ${ref.authorizationNumber}` }]
      : undefined,
  }
}

function toBundle(resourceType: string, resources: unknown[], total: number, page: number, pageSize: number) {
  return {
    resourceType: 'Bundle',
    type: 'searchset',
    total,
    link: [
      { relation: 'self', url: `${SERVER_BASE}/${resourceType}?page=${page}&pageSize=${pageSize}` },
      ...(page > 1 ? [{ relation: 'previous', url: `${SERVER_BASE}/${resourceType}?page=${page - 1}&pageSize=${pageSize}` }] : []),
      ...(resources.length === pageSize ? [{ relation: 'next', url: `${SERVER_BASE}/${resourceType}?page=${page + 1}&pageSize=${pageSize}` }] : []),
    ],
    entry: resources.map((r) => ({ fullUrl: `${SERVER_BASE}/${(r as { resourceType: string }).resourceType}/${(r as { id: string }).id}`, resource: r })),
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

export async function fhirRoutes(fastify: FastifyInstance) {
  // Set FHIR JSON content type on all /fhir responses
  fastify.addHook('onSend', async (request, reply) => {
    if (request.url.startsWith('/fhir/')) {
      reply.header('Content-Type', 'application/fhir+json; charset=utf-8')
    }
  })

  /**
   * GET /fhir/r4/Patient/:id
   */
  fastify.get(
    '/fhir/r4/Patient/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const { id } = request.params

      const contact = await prisma.contact.findUnique({ where: { id } })
      if (!contact) {
        return reply.status(404).send(fhirError(404, 'error', 'not-found', `Patient/${id} not found`))
      }

      return reply.status(200).send(contactToFhirPatient(contact))
    }
  )

  /**
   * GET /fhir/r4/Patient
   * Basic search: ?family=Smith&given=John&birthdate=1980-01-01
   */
  fastify.get('/fhir/r4/Patient', async (request: FastifyRequest, reply: FastifyReply) => {
    const q = request.query as Record<string, string>
    const family = q.family
    const given = q.given
    const page = parseInt(q.page ?? '1', 10)
    const pageSize = Math.min(parseInt(q.pageSize ?? '20', 10), 100)
    const skip = (page - 1) * pageSize

    const where = {
      ...(family && { lastName: { contains: family, mode: 'insensitive' as const } }),
      ...(given && { firstName: { contains: given, mode: 'insensitive' as const } }),
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({ where, skip, take: pageSize, orderBy: { lastName: 'asc' } }),
      prisma.contact.count({ where }),
    ])

    const resources = contacts.map(contactToFhirPatient)
    return reply.status(200).send(toBundle('Patient', resources, total, page, pageSize))
  })

  /**
   * GET /fhir/r4/CarePlan/:id
   */
  fastify.get(
    '/fhir/r4/CarePlan/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params

      const plan = await prisma.carePlan.findUnique({
        where: { id },
        include: { problems: true, goals: true, interventions: true },
      })
      if (!plan) {
        return reply.status(404).send(fhirError(404, 'error', 'not-found', `CarePlan/${id} not found`))
      }

      return reply.status(200).send(carePlanToFhir(plan))
    }
  )

  /**
   * GET /fhir/r4/CarePlan
   * Search: ?subject=Patient/abc123
   */
  fastify.get('/fhir/r4/CarePlan', async (request: FastifyRequest, reply: FastifyReply) => {
    const q = request.query as Record<string, string>
    const subjectRef = q.subject // e.g. "Patient/abc123"
    const status = q.status
    const page = parseInt(q.page ?? '1', 10)
    const pageSize = Math.min(parseInt(q.pageSize ?? '20', 10), 100)
    const skip = (page - 1) * pageSize

    const contactId = subjectRef?.startsWith('Patient/') ? subjectRef.slice(8) : undefined

    const fhirStatusReverse: Record<string, string> = {
      draft: 'draft', active: 'active', completed: 'completed', revoked: 'cancelled',
    }

    const where = {
      ...(contactId && { contactId }),
      ...(status && { status: fhirStatusReverse[status] ?? status }),
    }

    const [plans, total] = await Promise.all([
      prisma.carePlan.findMany({
        where, skip, take: pageSize, orderBy: { createdAt: 'desc' },
        include: { problems: true, goals: true, interventions: true },
      }),
      prisma.carePlan.count({ where }),
    ])

    const resources = plans.map(carePlanToFhir)
    return reply.status(200).send(toBundle('CarePlan', resources, total, page, pageSize))
  })

  /**
   * GET /fhir/r4/ServiceRequest/:id
   */
  fastify.get(
    '/fhir/r4/ServiceRequest/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params

      const referral = await prisma.referral.findUnique({ where: { id } })
      if (!referral) {
        return reply.status(404).send(fhirError(404, 'error', 'not-found', `ServiceRequest/${id} not found`))
      }

      return reply.status(200).send(referralToFhirServiceRequest(referral))
    }
  )

  /**
   * GET /fhir/r4/ServiceRequest
   * Search: ?subject=Patient/abc123&status=active
   */
  fastify.get('/fhir/r4/ServiceRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const q = request.query as Record<string, string>
    const subjectRef = q.subject
    const status = q.status
    const page = parseInt(q.page ?? '1', 10)
    const pageSize = Math.min(parseInt(q.pageSize ?? '20', 10), 100)
    const skip = (page - 1) * pageSize

    const contactId = subjectRef?.startsWith('Patient/') ? subjectRef.slice(8) : undefined

    // Map FHIR status back to CRM stages
    const stagesByFhirStatus: Record<string, string[]> = {
      active: ['received', 'reviewing', 'authorized', 'scheduled'],
      completed: ['completed'],
      revoked: ['declined', 'cancelled'],
    }

    const where = {
      ...(contactId && { contactId }),
      ...(status && stagesByFhirStatus[status]
        ? { stage: { in: stagesByFhirStatus[status] } }
        : {}),
    }

    const [referrals, total] = await Promise.all([
      prisma.referral.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      prisma.referral.count({ where }),
    ])

    const resources = referrals.map(referralToFhirServiceRequest)
    return reply.status(200).send(toBundle('ServiceRequest', resources, total, page, pageSize))
  })

  /**
   * GET /fhir/r4/metadata
   * FHIR Capability Statement — declares what this server supports.
   */
  fastify.get('/fhir/r4/metadata', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      resourceType: 'CapabilityStatement',
      status: 'active',
      date: new Date().toISOString().split('T')[0],
      kind: 'instance',
      fhirVersion: '4.0.1',
      format: ['application/fhir+json'],
      implementationGuide: ['http://hl7.org/fhir/us/core/'],
      rest: [
        {
          mode: 'server',
          resource: [
            {
              type: 'Patient',
              interaction: [{ code: 'read' }, { code: 'search-type' }],
              searchParam: [
                { name: 'family', type: 'string' },
                { name: 'given', type: 'string' },
              ],
            },
            {
              type: 'CarePlan',
              interaction: [{ code: 'read' }, { code: 'search-type' }],
              searchParam: [
                { name: 'subject', type: 'reference' },
                { name: 'status', type: 'token' },
              ],
            },
            {
              type: 'ServiceRequest',
              interaction: [{ code: 'read' }, { code: 'search-type' }],
              searchParam: [
                { name: 'subject', type: 'reference' },
                { name: 'status', type: 'token' },
              ],
            },
          ],
        },
      ],
    })
  })
}
