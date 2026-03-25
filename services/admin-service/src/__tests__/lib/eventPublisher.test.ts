import { CHANNELS } from '@patient-health/events'

// ─── Mock dependencies ────────────────────────────────────────────────────────

jest.mock('../../lib/redis', () => ({
  redisPub: {
    publish: jest.fn().mockResolvedValue(1),
  },
}))

jest.mock('../../routes/events', () => ({
  broadcastToAdminClients: jest.fn(),
}))

import { redisPub } from '../../lib/redis'
import { broadcastToAdminClients } from '../../routes/events'
import { publishMemberCreated } from '../../lib/eventPublisher'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockRedisPub = redisPub as any
const mockBroadcast = broadcastToAdminClients as jest.Mock

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Admin eventPublisher', () => {
  const correlationId = 'test-cid'
  const payload = { memberId: 'm1', memberNumber: 'MEM-20260325-0001', firstName: 'Alice', lastName: 'Smith' }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('broadcasts to local Admin SSE clients', () => {
    publishMemberCreated(payload, correlationId)
    expect(mockBroadcast).toHaveBeenCalledTimes(1)
    const [eventType, envelope] = mockBroadcast.mock.calls[0]
    expect(eventType).toBe('admin:member:created')
    expect(envelope).toMatchObject({ type: 'admin:member:created', payload, sourceService: 'admin-service', correlationId })
  })

  it('publishes to the correct Redis channel', () => {
    publishMemberCreated(payload, correlationId)
    const [channel, json] = mockRedisPub.publish.mock.calls[0]
    expect(channel).toBe(CHANNELS.ADMIN_MEMBER_CREATED)
    const parsed = JSON.parse(json as string)
    expect(parsed).toMatchObject({ type: 'admin:member:created', payload, correlationId })
  })

  it('includes id, occurredAt, and sourceService', () => {
    publishMemberCreated(payload, correlationId)
    const [, json] = mockRedisPub.publish.mock.calls[0]
    const parsed = JSON.parse(json as string)
    expect(typeof parsed.id).toBe('string')
    expect(typeof parsed.occurredAt).toBe('string')
    expect(parsed.sourceService).toBe('admin-service')
  })

  it('does not throw when Redis publish fails', async () => {
    mockRedisPub.publish.mockRejectedValueOnce(new Error('Redis down'))
    expect(() => publishMemberCreated(payload, correlationId)).not.toThrow()
    await new Promise((r) => setTimeout(r, 0))
  })
})
