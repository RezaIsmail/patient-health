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
  const parts = text.split('\n\n')
  const remainder = parts.pop() ?? ''

  for (const part of parts) {
    const event: Partial<ParsedEvent> = {}
    for (const line of part.split('\n')) {
      if (line.startsWith('event:')) event.type = line.slice(6).trim()
      else if (line.startsWith('data:')) event.data = line.slice(5).trim()
      else if (line.startsWith('id:')) event.id = line.slice(3).trim()
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
        queryClient.invalidateQueries({ queryKey: ['members'] })
        break
      case 'emr:patient:updated':
        queryClient.invalidateQueries({ queryKey: ['members'] })
        break
      case 'emr:clinical:synced':
        queryClient.invalidateQueries({ queryKey: ['members'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        break
      case 'admin:member:created':
        queryClient.invalidateQueries({ queryKey: ['members'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        break
      case 'crm:contact:risk_changed':
        // Risk level updated in CRM — member linked to this contact may need refreshing
        queryClient.invalidateQueries({ queryKey: ['members'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        break
      case 'crm:care_gap:opened':
        // New care gap — dashboard care gap counts should refresh
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        break
    }
  } catch {
    // Malformed event — ignore
  }
}

// ── Main hook ─────────────────────────────────────────────────────────────────

export function useServerEvents(): void {
  const accessToken = useAuthStore((s) => s.accessToken)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!accessToken) return

    let isDestroyed = false
    let retryDelay = 1_000
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
      const jitter = retryDelay * 0.2 * (Math.random() * 2 - 1)
      setTimeout(() => void connect(), retryDelay + jitter)
      retryDelay = Math.min(retryDelay * 1.5, 30_000)
    }

    void connect()

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
