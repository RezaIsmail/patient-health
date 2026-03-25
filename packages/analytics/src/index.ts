import type { AnalyticsEvent } from './events'

export type { AnalyticsEvent } from './events'
export * from './events'

// ── GA4 gtag type shim ─────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

// ── State ─────────────────────────────────────────────────────────────────────

let measurementId: string | null = null
let initialized = false

// ── Initialisation ────────────────────────────────────────────────────────────

/**
 * Initialise GA4. Call once at app startup (e.g. in main.tsx).
 * No-ops silently if `id` is falsy — safe to call in all environments.
 *
 * @param id - GA4 Measurement ID (e.g. "G-XXXXXXXXXX")
 */
export function initAnalytics(id: string | undefined | null): void {
  if (!id || initialized) return
  measurementId = id
  initialized = true

  // Inject the gtag snippet if not already present
  if (!window.gtag) {
    window.dataLayer = window.dataLayer ?? []
    window.gtag = function (...args: unknown[]) {
      window.dataLayer!.push(args)
    }
    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      // Disable automatic PII collection
      send_page_view: false, // We send page views manually
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    })

    // Inject the GA4 script tag
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)
  }
}

// ── Page views ────────────────────────────────────────────────────────────────

/**
 * Send a page_view hit to GA4.
 * Call on every route change (e.g. from a useEffect watching location.pathname).
 *
 * @param path - The current pathname (e.g. "/patients/p1")
 * @param title - Optional page title
 */
export function trackPageView(path: string, title?: string): void {
  if (!initialized || !window.gtag) return
  window.gtag('event', 'page_view', {
    page_location: path,
    page_title: title ?? document.title,
    send_to: measurementId,
  })
}

// ── Custom events ─────────────────────────────────────────────────────────────

/**
 * Track a typed domain event.
 * The `event` field of the payload becomes the GA4 event name.
 * All other fields become event parameters.
 *
 * No PII must be passed — use internal IDs only.
 */
export function trackEvent(payload: AnalyticsEvent): void {
  if (!initialized || !window.gtag) return
  const { event, ...params } = payload
  window.gtag('event', event, { ...params, send_to: measurementId })
}
