import { CHANNELS } from '@patient-health/events'

// ─── Mock dependencies ────────────────────────────────────────────────────────

jest.mock('../../lib/redis', () => ({
  redisPub: {
    publish: jest.fn().mockResolvedValue(1),
  },
}))

jest.mock('../../lib/sseRegistry', () => ({
  broadcast: jest.fn(),
  formatSseEvent: jest.fn((_type: string, data: unknown) => JSON.stringify(data)),
}))

import { redisPub } from '../../lib/redis'
import { broadcast } from '../../lib/sseRegistry'
import { publishContactRiskChanged, publishCareGapOpened } from '../../lib/eventPublisher'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockRedisPub = redisPub as any
const mockBroadcast = broadcast as jest.Mock

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CRM eventPublisher', () => {
  const correlationId = 'test-cid'

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('publishContactRiskChanged', () => {
    const payload = {
      contactId: 'c1',
      emrPatientId: 'p1',
      riskLevel: 'high',
      previousRiskLevel: 'low',
    }

    it('broadcasts to local CRM SSE clients', () => {
      publishContactRiskChanged(payload, correlationId)
      expect(mockBroadcast).toHaveBeenCalledTimes(1)
    })

    it('publishes to the correct Redis channel', () => {
      publishContactRiskChanged(payload, correlationId)
      const [channel, json] = mockRedisPub.publish.mock.calls[0]
      expect(channel).toBe(CHANNELS.CRM_CONTACT_RISK_CHANGED)
      const parsed = JSON.parse(json as string)
      expect(parsed).toMatchObject({ type: 'crm:contact:risk_changed', payload, sourceService: 'crm-service', correlationId })
    })

    it('includes id, occurredAt, and sourceService in the envelope', () => {
      publishContactRiskChanged(payload, correlationId)
      const [, json] = mockRedisPub.publish.mock.calls[0]
      const parsed = JSON.parse(json as string)
      expect(typeof parsed.id).toBe('string')
      expect(typeof parsed.occurredAt).toBe('string')
      expect(parsed.sourceService).toBe('crm-service')
    })

    it('does not throw when Redis publish fails', async () => {
      mockRedisPub.publish.mockRejectedValueOnce(new Error('Redis down'))
      expect(() => publishContactRiskChanged(payload, correlationId)).not.toThrow()
      await new Promise((r) => setTimeout(r, 0))
    })
  })

  describe('publishCareGapOpened', () => {
    const payload = { careGapId: 'g1', contactId: 'c1', title: 'HbA1c monitoring overdue' }

    it('publishes to the correct Redis channel', () => {
      publishCareGapOpened(payload, correlationId)
      const [channel, json] = mockRedisPub.publish.mock.calls[0]
      expect(channel).toBe(CHANNELS.CRM_CARE_GAP_OPENED)
      const parsed = JSON.parse(json as string)
      expect(parsed).toMatchObject({ type: 'crm:care_gap:opened', payload, correlationId })
    })

    it('broadcasts to local SSE clients', () => {
      publishCareGapOpened(payload, correlationId)
      expect(mockBroadcast).toHaveBeenCalledTimes(1)
    })
  })
})
