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

const mockBroadcast = jest.fn()
const mockFormatSseEvent = jest.fn((_type: string, data: unknown, _id?: string) => JSON.stringify(data))

jest.mock('../../lib/sseRegistry', () => ({
  broadcast: mockBroadcast,
  formatSseEvent: mockFormatSseEvent,
}))

import { initEventSubscriber } from '../../lib/eventSubscriber'

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CRM initEventSubscriber', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('subscribes to all expected Redis channels', async () => {
    await initEventSubscriber()
    expect(mockSubscribe).toHaveBeenCalledWith(
      CHANNELS.EMR_PATIENT_CREATED,
      CHANNELS.EMR_PATIENT_UPDATED,
      CHANNELS.EMR_CLINICAL_SYNCED,
      CHANNELS.ADMIN_MEMBER_CREATED,
    )
  })

  it('registers a message handler on redisSub', async () => {
    await initEventSubscriber()
    expect(mockOn).toHaveBeenCalledWith('message', expect.any(Function))
  })

  it('broadcasts valid incoming events to SSE clients', async () => {
    await initEventSubscriber()
    const [, messageHandler] = mockOn.mock.calls[0]

    const event: DomainEvent = {
      id: 'evt-1',
      type: 'emr:patient:created',
      occurredAt: new Date().toISOString(),
      correlationId: 'cid-1',
      sourceService: 'emr-service',
      payload: { patientId: 'p1', mrn: 'MRN-001', firstName: 'Jane', lastName: 'Doe' },
    }

    messageHandler('ph:emr:patient:created', JSON.stringify(event))
    expect(mockBroadcast).toHaveBeenCalledTimes(1)
    expect(mockFormatSseEvent).toHaveBeenCalledWith('emr:patient:created', event, event.id)
  })

  it('silently drops malformed Redis messages', async () => {
    await initEventSubscriber()
    const [, messageHandler] = mockOn.mock.calls[0]
    expect(() => messageHandler('ph:emr:patient:created', 'not-valid-json')).not.toThrow()
    expect(mockBroadcast).not.toHaveBeenCalled()
  })

  it('silently drops empty Redis messages', async () => {
    await initEventSubscriber()
    const [, messageHandler] = mockOn.mock.calls[0]
    expect(() => messageHandler('ph:emr:patient:created', '')).not.toThrow()
    expect(mockBroadcast).not.toHaveBeenCalled()
  })
})
