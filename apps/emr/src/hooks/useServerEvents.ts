import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'
import type { SseEvent } from '@patient-health/events'

// ── SSE line parser ───────────────────────────────────────────────────────────

interface ParsedEvent {
  type: string
  data: string
  id?: string
}

function parseSseChunk(text: string): { events: ParsedEvent[]; remainder: string } {
  const events: ParsedEvent[] = []
  // SSE events are separated by double newline
  const parts = text.split('\n\n')
  // The last element is an incomplete event (or empty string) — keep as remainder
  const remainder = parts.pop() ?? ''

  for (const part of parts) {
    const event: Partial<ParsedEvent> = {}
    for (const line of part.split('\n')) {
      if (line.startsWith('event:')) event.type = line.slice(6).trim()
      else if (line.startsWith('data:')) event.data = line.slice(5).trim()
      else if (line.startsWith('id:')) event.id = line.slice(3).trim()
      // Comment lines (": ping") are intentionally ignored
    }
    if (event.type && event.data) {
      events.push(event as ParsedEvent)
    }
  }

  return { events, remainder }
}

// ── Query invalidation map ────────────────────────────────────────────────────

function handleSseEvent(event: ParsedEvent, queryClient: ReturnType<typeof useQueryClient>): void {
  try {
    const payload = JSON.parse(event.data) as SseEvent
    switch (payload.type) {
      case 'emr:patient:created':
        queryClient.invalidateQueries({ queryKey: ['patients'] })
        break
      case 'emr:patient:updated':
        queryClient.invalidateQueries({ queryKey: ['patients'] })
        queryClient.invalidateQueries({ queryKey: ['patient-chart', payload.payload.patientId] })
        break
      case 'emr:clinical:synced':
        queryClient.invalidateQueries({ queryKey: ['patient-chart', payload.payload.patientId] })
        break
      // 'connected' events are silently ignored
    }
  } catch {
    // Malformed event — ignore
  }
}

// ── Main hook ─────────────────────────────────────────────────────────────────

/**
 * Maintains a persistent SSE connection to the EMR service event stream.
 * Automatically reconnects with exponential backoff. Invalidates TanStack
 * Query caches when relevant domain events arrive, triggering live UI updates.
 *
 * Mount this hook inside any component that is within the QueryClientProvider
 * and only rendered when authenticated (e.g., Layout).
 */
export function useServerEvents(): void {
  const accessToken = useAuthStore((s) => s.accessToken)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!accessToken) return

    let isDestroyed = false
    let retryDelay = 1_000 // ms — reset on successful connection
    const controller = new AbortController()

    async function connect(): Promise<void> {
      if (isDestroyed) return
      try {
        const response = await fetch('/api/events/stream', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'text/event-stream',
          },
          signal: controller.signal,
        })

        if (!response.ok || !response.body) {
          scheduleReconnect()
          return
        }

        // Successful connection — reset backoff
        retryDelay = 1_000

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (!isDestroyed) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const { events, remainder } = parseSseChunk(buffer)
          buffer = remainder
          for (const event of events) {
            handleSseEvent(event, queryClient)
          }
        }

        if (!isDestroyed) scheduleReconnect()
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        scheduleReconnect()
      }
    }

    function scheduleReconnect(): void {
      if (isDestroyed) return
      // Exponential backoff with ±20% jitter, capped at 30s
      const jitter = retryDelay * 0.2 * (Math.random() * 2 - 1)
      setTimeout(() => void connect(), retryDelay + jitter)
      retryDelay = Math.min(retryDelay * 1.5, 30_000)
    }

    void connect()

    // Reconnect immediately when the tab becomes visible again
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        retryDelay = 1_000
        controller.abort()
        void connect()
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      isDestroyed = true
      controller.abort()
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [accessToken, queryClient])
}
