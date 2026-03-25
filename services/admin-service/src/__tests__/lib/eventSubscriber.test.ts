import { CHANNELS } from '@patient-health/events'
import type { DomainEvent } from '@patient-health/events'

// ─── Mock dependencies ────────────────────────────────────────────────────────

const mockSubscribe = jest.fn().mockResolvedValue(undefined)
const mockOn = jest.fn()

jest.mock('../../lib/redis', () => ({
  redisSub: {
    subscribe: mockSubscribe,
    on: mockOn,
  },
}))

const mockBroadcastToAdminClients = jest.fn()

jest.mock('../../routes/events', () => ({
  broadcastToAdminClients: mockBroadcastToAdminClients,
}))

import { initEventSubscriber } from '../../lib/eventSubscriber'

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Admin initEventSubscriber', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('subscribes to all expected Redis channels', async () => {
    await initEventSubscriber()
    expect(mockSubscribe).toHaveBeenCalledWith(
      CHANNELS.EMR_PATIENT_CREATED,
      CHANNELS.EMR_PATIENT_UPDATED,
      CHANNELS.EMR_CLINICAL_SYNCED,
      CHANNELS.CRM_CONTACT_RISK_CHANGED,
      CHANNELS.CRM_CARE_GAP_OPENED,
    )
  })

  it('registers a message handler on redisSub', async () => {
    await initEventSubscriber()
    expect(mockOn).toHaveBeenCalledWith('message', expect.any(Function))
  })

  it('broadcasts valid incoming events to Admin SSE clients', async () => {
    await initEventSubscriber()
    const [, messageHandler] = mockOn.mock.calls[0]

    const event: DomainEvent = {
      id: 'evt-2',
      type: 'crm:contact:risk_changed',
      occurredAt: new Date().toISOString(),
      correlationId: 'cid-2',
      sourceService: 'crm-service',
      payload: { contactId: 'c1', emrPatientId: 'p1', riskLevel: 'high', previousRiskLevel: 'low' },
    }

    messageHandler(CHANNELS.CRM_CONTACT_RISK_CHANGED, JSON.stringify(event))
    expect(mockBroadcastToAdminClients).toHaveBeenCalledWith(
      'crm:contact:risk_changed',
      event,
      event.id,
    )
  })

  it('silently drops malformed Redis messages', async () => {
    await initEventSubscriber()
    const [, messageHandler] = mockOn.mock.calls[0]
    expect(() => messageHandler(CHANNELS.EMR_PATIENT_CREATED, 'bad-json')).not.toThrow()
    expect(mockBroadcastToAdminClients).not.toHaveBeenCalled()
  })
})
