/**
 * First-party page views for pikku.dev, sent to the Pikku Studio control plane.
 *
 * OFF unless VITE_SITE_ANALYTICS_URL is set at build time (for example https://api.pikkustudio.app). Memory-only: no
 * cookie, no localStorage; the server derives device/browser/os/visitor id itself. Does nothing during SSR/prerender
 * and when Do Not Track or Global Privacy Control is on. A failed send never reaches the page.
 */
type Event = { name: 'page_viewed'; path: string; referrer?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string; lang?: string }

const BASE = import.meta.env.VITE_SITE_ANALYTICS_URL as string | undefined
const FLUSH_MS = 5000
const FLUSH_AT = 20
const MAX_BATCH = 50

let buffer: { at: number; event: Event }[] = []
let timer: ReturnType<typeof setTimeout> | undefined
let first = true

const enabled = () =>
  !!BASE && typeof window !== 'undefined' && navigator.doNotTrack !== '1' && !(navigator as { globalPrivacyControl?: boolean }).globalPrivacyControl

function flush() {
  if (timer) clearTimeout(timer)
  timer = undefined
  while (buffer.length) {
    const events = buffer.slice(0, MAX_BATCH)
    buffer = buffer.slice(MAX_BATCH)
    try {
      void fetch(`${BASE}/rpc/recordSiteAnalyticsEvents`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data: { events } }),
        keepalive: true,
        credentials: 'omit',
      }).catch(() => {})
    } catch { /* analytics must never break the page */ }
  }
}

function push(event: Event) {
  buffer.push({ at: Date.now(), event })
  if (buffer.length >= FLUSH_AT) flush()
  else timer ??= setTimeout(flush, FLUSH_MS)
}

/** Call once per route resolution. Pathname only; the referrer goes out on the first view of the page load. */
export function trackPageView(pathname: string) {
  if (!enabled()) return
  const q = new URLSearchParams(location.search)
  const cap = (v: string | null, n: number) => (v ? v.slice(0, n) : undefined)
  const event: Event = { name: 'page_viewed', path: pathname.slice(0, 512), lang: cap(document.documentElement.lang, 16) }
  if (first) {
    first = false
    event.referrer = cap(document.referrer, 512)
    window.addEventListener('pagehide', flush)
  }
  event.utm_source = cap(q.get('utm_source'), 128)
  event.utm_medium = cap(q.get('utm_medium'), 128)
  event.utm_campaign = cap(q.get('utm_campaign'), 128)
  push(JSON.parse(JSON.stringify(event)) as Event) // drops undefined keys: the server schema rejects unknown ones
}
