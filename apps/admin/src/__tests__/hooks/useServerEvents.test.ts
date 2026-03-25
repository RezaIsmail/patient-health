import { renderHook } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockInvalidateQueries = vi.fn()

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}))

const mockAccessToken = vi.fn<[], string | null>(() => 'test-token')

vi.mock('../../stores/authStore', () => ({
  useAuthStore: (selector: (s: { accessToken: string | null }) => unknown) =>
    selector({ accessToken: mockAccessToken() }),
}))

// ─── SSE helpers ──────────────────────────────────────────────────────────────

function sseStream(...frames: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    start(controller) {
      for (const frame of frames) controller.enqueue(encoder.encode(frame))
      controller.close()
    },
  })
}

function makeSseFrame(type: string, payload: unknown): string {
  return `event: ${type}\ndata: ${JSON.stringify(payload)}\n\n`
}

function mockFetchOk(body: ReadableStream<Uint8Array>) {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, body })
}

// ─── Import hook after mocks ──────────────────────────────────────────────────

import { useServerEvents } from '../../hooks/useServerEvents'

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useServerEvents (Admin)', () => {
  beforeEach(() => {
    mockAccessToken.mockReturnValue('test-token')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not connect when there is no access token', () => {
    mockAccessToken.mockReturnValue(null)
    global.fetch = vi.fn()
    renderHook(() => useServerEvents())
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('invalidates members on emr:patient:created', async () => {
    const envelope = { type: 'emr:patient:created', payload: { patientId: 'p1', mrn: 'MRN-001', firstName: 'Jane', lastName: 'Doe' }, id: 'e1', occurredAt: '', correlationId: '', sourceService: 'emr-service' }
    mockFetchOk(sseStream(makeSseFrame('emr:patient:created', envelope)))

    renderHook(() => useServerEvents())
    await vi.waitFor(() =>
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['members'] })
    )
  })

  it('invalidates members and dashboard on emr:clinical:synced', async () => {
    const envelope = { type: 'emr:clinical:synced', payload: { patientId: 'p1', triggerType: 'condition_added', riskLevel: 'high', activeConditionCount: 2 }, id: 'e2', occurredAt: '', correlationId: '', sourceService: 'emr-service' }
    mockFetchOk(sseStream(makeSseFrame('emr:clinical:synced', envelope)))

    renderHook(() => useServerEvents())
    await vi.waitFor(() =>
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['members'] })
    )
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['dashboard'] })
  })

  it('invalidates members and dashboard on admin:member:created', async () => {
    const envelope = { type: 'admin:member:created', payload: { memberId: 'm1', memberNumber: 'MEM-001', firstName: 'Alice', lastName: 'Smith' }, id: 'e3', occurredAt: '', correlationId: '', sourceService: 'admin-service' }
    mockFetchOk(sseStream(makeSseFrame('admin:member:created', envelope)))

    renderHook(() => useServerEvents())
    await vi.waitFor(() =>
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['members'] })
    )
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['dashboard'] })
  })

  it('invalidates members and dashboard on crm:contact:risk_changed', async () => {
    const envelope = { type: 'crm:contact:risk_changed', payload: { contactId: 'c1', emrPatientId: 'p1', riskLevel: 'high', previousRiskLevel: 'low' }, id: 'e4', occurredAt: '', correlationId: '', sourceService: 'crm-service' }
    mockFetchOk(sseStream(makeSseFrame('crm:contact:risk_changed', envelope)))

    renderHook(() => useServerEvents())
    await vi.waitFor(() =>
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['members'] })
    )
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['dashboard'] })
  })

  it('invalidates dashboard on crm:care_gap:opened', async () => {
    const envelope = { type: 'crm:care_gap:opened', payload: { careGapId: 'g1', contactId: 'c1', title: 'HbA1c monitoring overdue' }, id: 'e5', occurredAt: '', correlationId: '', sourceService: 'crm-service' }
    mockFetchOk(sseStream(makeSseFrame('crm:care_gap:opened', envelope)))

    renderHook(() => useServerEvents())
    await vi.waitFor(() =>
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['dashboard'] })
    )
  })
})
