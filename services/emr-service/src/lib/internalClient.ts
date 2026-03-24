const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN ?? 'dev-internal-secret'
const CRM_URL = process.env.CRM_SERVICE_URL ?? 'http://crm-service:3003'

async function internalPost<T>(
  path: string,
  body: unknown,
  correlationId: string
): Promise<{ ok: true; data: T } | { ok: false; reason: string }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const response = await fetch(`${CRM_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INTERNAL_TOKEN}`,
        'x-correlation-id': correlationId,
        'x-source-service': 'emr-service',
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

export const crmClient = {
  // Called after any clinical write to sync relevant metadata to the CRM contact
  clinicalSync: (body: {
    emrPatientId: string
    riskLevel: string
    activeConditions: Array<{ code: string; display: string }>
    activeMedications: Array<{ name: string; dose?: string }>
    openCareGapCount: number
    triggerType: string // 'problem_added' | 'medication_added' | 'allergy_added' | 'care_gap_added'
  }, correlationId: string) =>
    internalPost<{ ok: boolean }>('/internal/clinical-sync', body, correlationId),
}
