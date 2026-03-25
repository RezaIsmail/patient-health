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
      // EMR patient changes — refresh contact list and any open contact record
      case 'emr:patient:created':
        queryClient.invalidateQueries({ queryKey: ['contacts'] })
        break
      case 'emr:patient:updated':
        queryClient.invalidateQueries({ queryKey: ['contacts'] })
        queryClient.invalidateQueries({ queryKey: ['contact'] }) // invalidates all contact detail queries
        break
      // Clinical sync — risk level may have changed; refresh contacts and care gaps
      case 'emr:clinical:synced':
        queryClient.invalidateQueries({ queryKey: ['contacts'] })
        queryClient.invalidateQueries({ queryKey: ['care-gaps'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        break
      // CRM-internal events
      case 'crm:contact:risk_changed':
        queryClient.invalidateQueries({ queryKey: ['contacts'] })
        queryClient.invalidateQueries({ queryKey: ['contact', payload.payload.contactId] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        break
      case 'crm:care_gap:opened':
        queryClient.invalidateQueries({ queryKey: ['care-gaps'] })
        queryClient.invalidateQueries({ queryKey: ['contact', payload.payload.contactId] })
        break
      // Admin member created — new contact may have been provisioned
      case 'admin:member:created':
        queryClient.invalidateQueries({ queryKey: ['contacts'] })
        break
    }
  } catch {
    // Malformed event — ignore
  }
}

// ── Main hook ─────────────────────────────────────────────────────────────────

/**
 * Maintains a persistent SSE connection to the CRM service event stream.
 * This is the key real-time bridge: EMR events (patient updates, clinical syncs)
 * are forwarded via Redis → CRM service → SSE → this hook → TanStack Query
 * invalidation, so the CRM UI reflects EMR changes without a page refresh.
 */
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
