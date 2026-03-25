const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN ?? 'dev-internal-secret'
const EMR_URL = process.env.EMR_SERVICE_URL ?? 'http://emr-service:3002'
const CRM_URL = process.env.CRM_SERVICE_URL ?? 'http://crm-service:3003'

async function internalPost<T>(
  baseUrl: string,
  path: string,
  body: unknown,
  correlationId: string
): Promise<{ ok: true; data: T } | { ok: false; reason: string }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INTERNAL_TOKEN}`,
        'x-correlation-id': correlationId,
        'x-source-service': 'admin-service',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!response.ok) {
      const text = await response.text().catch(() => '')
      return { ok: false, reason: `${response.status}: ${text}` }
    }
    const data = await response.json() as T
    return { ok: true, data }
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : 'unknown' }
  }
}

async function internalPatch<T>(
  baseUrl: string,
  path: string,
  body: unknown,
  correlationId: string
): Promise<{ ok: true; data: T } | { ok: false; reason: string }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INTERNAL_TOKEN}`,
        'x-correlation-id': correlationId,
        'x-source-service': 'admin-service',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!response.ok) {
      const text = await response.text().catch(() => '')
      return { ok: false, reason: `${response.status}: ${text}` }
    }
    const data = await response.json() as T
    return { ok: true, data }
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : 'unknown' }
  }
}

export const emrClient = {
  createPatient: (body: {
    firstName: string; lastName: string; dateOfBirth?: string; gender?: string
    phone?: string; email?: string; adminMemberId: string
  }, correlationId: string) =>
    internalPost<{ patientId: string }>(EMR_URL, '/internal/patients', body, correlationId),
}

export const crmClient = {
  createContact: (body: {
    firstName: string; lastName: string; dateOfBirth?: string; sex?: string
    phone?: string; email?: string; riskLevel?: string; adminMemberId: string
  }, correlationId: string) =>
    internalPost<{ contactId: string }>(CRM_URL, '/internal/contacts', body, correlationId),

  updateProgramme: (crmContactId: string, body: {
    programmeId: string; programmeName: string; state: string; memberId: string
  }, correlationId: string) =>
    internalPatch<{ ok: boolean }>(CRM_URL, `/internal/contacts/${crmContactId}/programme-update`, body, correlationId),

  updateRiskLevel: (crmContactId: string, body: { riskLevel: string }, correlationId: string) =>
    internalPatch<{ ok: boolean }>(CRM_URL, `/internal/contacts/${crmContactId}/risk-update`, body, correlationId),

  linkEmrPatient: (crmContactId: string, body: { emrPatientId: string }, correlationId: string) =>
    internalPatch<{ ok: boolean }>(CRM_URL, `/internal/contacts/${crmContactId}/link-emr`, body, correlationId),
}
