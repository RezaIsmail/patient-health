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

// ─── SSE stream helper ────────────────────────────────────────────────────────

/**
 * Creates a ReadableStream that emits the given SSE frames then closes.
 * Frames are strings like "event: foo\ndata: {}\n\n"
 */
function sseStream(...frames: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    start(controller) {
      for (const frame of frames) {
        controller.enqueue(encoder.encode(frame))
      }
      controller.close()
    },
  })
}

function makeSseFrame(type: string, payload: unknown, id = 'evt-1'): string {
  return `id: ${id}\nevent: ${type}\ndata: ${JSON.stringify(payload)}\n\n`
}

function mockFetchOk(body: ReadableStream<Uint8Array>) {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, body })
}

// ─── Import hook after mocks ──────────────────────────────────────────────────

import { useServerEvents } from '../../hooks/useServerEvents'

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useServerEvents (EMR)', () => {
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

  it('connects to /api/events/stream with Bearer token', async () => {
    mockFetchOk(sseStream())
    const { unmount } = renderHook(() => useServerEvents())
    await vi.waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))
    const [url, init] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toBe('/api/events/stream')
    expect((init as RequestInit).headers).toMatchObject({ Authorization: 'Bearer test-token' })
    unmount()
  })

  it('invalidates patients on emr:patient:created', async () => {
    const envelope = { type: 'emr:patient:created', payload: { patientId: 'p1', mrn: 'MRN-001', firstName: 'Jane', lastName: 'Doe' }, id: 'e1', occurredAt: '', correlationId: '', sourceService: 'emr-service' }
    mockFetchOk(sseStream(makeSseFrame('emr:patient:created', envelope)))

    renderHook(() => useServerEvents())
    await vi.waitFor(() =>
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['patients'] })
    )
  })

  it('invalidates patients and patient-chart on emr:patient:updated', async () => {
    const envelope = { type: 'emr:patient:updated', payload: { patientId: 'p1', mrn: 'MRN-001', changes: {} }, id: 'e2', occurredAt: '', correlationId: '', sourceService: 'emr-service' }
    mockFetchOk(sseStream(makeSseFrame('emr:patient:updated', envelope)))

    renderHook(() => useServerEvents())
    await vi.waitFor(() =>
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['patients'] })
    )
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['patient-chart', 'p1'] })
  })

  it('invalidates patient-chart on emr:clinical:synced', async () => {
    const envelope = { type: 'emr:clinical:synced', payload: { patientId: 'p2', triggerType: 'condition_added', riskLevel: 'high', activeConditionCount: 2 }, id: 'e3', occurredAt: '', correlationId: '', sourceService: 'emr-service' }
    mockFetchOk(sseStream(makeSseFrame('emr:clinical:synced', envelope)))

    renderHook(() => useServerEvents())
    await vi.waitFor(() =>
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['patient-chart', 'p2'] })
    )
  })

  it('silently ignores malformed event data', async () => {
    const stream = sseStream('event: emr:patient:created\ndata: not-valid-json\n\n')
    mockFetchOk(stream)
    renderHook(() => useServerEvents())
    // Give the hook time to process
    await new Promise((r) => setTimeout(r, 20))
    expect(mockInvalidateQueries).not.toHaveBeenCalled()
  })

  it('does not connect when fetch returns a non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, body: null })
    renderHook(() => useServerEvents())
    await vi.waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(mockInvalidateQueries).not.toHaveBeenCalled()
  })
})
