/**
 * Pikku Website — Color Constants (JS/TSX layer)
 *
 * These mirror the CSS tokens in src/css/tokens.css.
 * Use these in component style props and chart configs.
 * For CSS-only contexts always prefer var(--xxx) instead.
 */

/* ── Primary accent ─────────────────────────────── */
export const accent = {
  DEFAULT:  '#60a5fa',
  dark:     '#3b82f6',
  darker:   '#2563eb',
  darkest:  '#1d4ed8',
  light:    '#93c5fd',
  lighter:  '#bfdbfe',
  lightest: '#dbeafe',
} as const

/* ── Page structure ─────────────────────────────── */
export const bg = {
  page:    '#0a0a0f',
  surface: '#0f0f18',
  overlay: '#0d0d14',
} as const

/* ── Wire-type protocol colors ──────────────────── */
export const wire = {
  http:      '#22c55e',
  websocket: '#a855f7',
  sse:       '#8b5cf6',
  queue:     '#ef4444',
  cron:      '#eab308',
  cli:       '#06b6d4',
  rpc:       '#6366f1',
  mcp:       '#ec4899',
  workflow:  '#10b981',
  trigger:   '#f59e0b',
  gateway:   '#f43f5e',
  bot:       '#8b5cf6',
  function:  '#60a5fa',
  security:  '#22c55e',
} as const

/* ── Cloud provider brand colors ────────────────── */
export const cloud = {
  aws:        '#FF9900',
  gcp:        '#4285F4',
  azure:      '#0078D4',
  cloudflare: '#F38020',
} as const

/* ── Mono-mode fallback ──────────────────────────── */
export const mono = '#888888'

/**
 * Returns the wire color for a given protocol key,
 * falling back to the accent color if unknown.
 */
export function wireColor(protocol: string): string {
  return (wire as Record<string, string>)[protocol] ?? accent.DEFAULT
}
