import { CHANNELS } from '@patient-health/events'

// ─── Mock dependencies ────────────────────────────────────────────────────────

jest.mock('../../lib/redis', () => ({
  redisPub: {
    publish: jest.fn().mockResolvedValue(1),
  },
}))

jest.mock('../../routes/events', () => ({
  broadcastToEmrClients: jest.fn(),
}))

import { redisPub } from '../../lib/redis'
import { broadcastToEmrClients } from '../../routes/events'
import {
  publishPatientCreated,
  publishPatientUpdated,
  publishClinicalSynced,
} from '../../lib/eventPublisher'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockRedisPub = redisPub as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockBroadcast = broadcastToEmrClients as jest.Mock

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('EMR eventPublisher', () => {
  const correlationId = 'test-correlation-id'

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('publishPatientCreated', () => {
    const payload = { patientId: 'p1', mrn: 'MRN-001', firstName: 'Jane', lastName: 'Doe' }

    it('broadcasts to local SSE clients', () => {
      publishPatientCreated(payload, correlationId)
      expect(mockBroadcast).toHaveBeenCalledTimes(1)
      const [eventType, envelope] = mockBroadcast.mock.calls[0]
      expect(eventType).toBe('emr:patient:created')
      expect(envelope).toMatchObject({ type: 'emr:patient:created', payload, sourceService: 'emr-service', correlationId })
    })

    it('publishes to the correct Redis channel', () => {
      publishPatientCreated(payload, correlationId)
      expect(mockRedisPub.publish).toHaveBeenCalledTimes(1)
      const [channel, json] = mockRedisPub.publish.mock.calls[0]
      expect(channel).toBe(CHANNELS.EMR_PATIENT_CREATED)
      const parsed = JSON.parse(json as string)
      expect(parsed).toMatchObject({ type: 'emr:patient:created', payload, correlationId })
    })

    it('includes an id and occurredAt in the envelope', () => {
      publishPatientCreated(payload, correlationId)
      const [, json] = mockRedisPub.publish.mock.calls[0]
      const parsed = JSON.parse(json as string)
      expect(typeof parsed.id).toBe('string')
      expect(typeof parsed.occurredAt).toBe('string')
    })
  })

  describe('publishPatientUpdated', () => {
    const payload = { patientId: 'p1', mrn: 'MRN-001', changes: { phone: '0700000001' } }

    it('publishes to EMR_PATIENT_UPDATED channel', () => {
      publishPatientUpdated(payload, correlationId)
      const [channel] = mockRedisPub.publish.mock.calls[0]
      expect(channel).toBe(CHANNELS.EMR_PATIENT_UPDATED)
    })

    it('sets the correct event type', () => {
      publishPatientUpdated(payload, correlationId)
      const [, json] = mockRedisPub.publish.mock.calls[0]
      expect(JSON.parse(json as string).type).toBe('emr:patient:updated')
    })
  })

  describe('publishClinicalSynced', () => {
    const payload = { patientId: 'p1', triggerType: 'condition_added', riskLevel: 'high' as const, activeConditionCount: 3 }

    it('publishes to EMR_CLINICAL_SYNCED channel', () => {
      publishClinicalSynced(payload, correlationId)
      const [channel] = mockRedisPub.publish.mock.calls[0]
      expect(channel).toBe(CHANNELS.EMR_CLINICAL_SYNCED)
    })

    it('does not throw when Redis publish fails', async () => {
      mockRedisPub.publish.mockRejectedValueOnce(new Error('Redis down'))
      expect(() => publishClinicalSynced(payload, correlationId)).not.toThrow()
      // Allow the rejected promise to settle
      await new Promise((r) => setTimeout(r, 0))
    })
  })
})
