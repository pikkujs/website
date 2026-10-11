import { createServerFn } from '@tanstack/react-start'

/**
 * Server-only catalogue access. Everything here runs in the SSR/Worker bundle; the JSON
 * fixtures never reach the client (they are imported inside the handlers).
 *
 * OpenAPI: the hosted registry (REGISTRY_URL, default https://api.pikkustudio.app) is the source,
 * with a hard timeout. If it errors or is slow we serve the recorded fixture (a snapshot of the
 * same API's /registry/openapis response) and flag `stale: true`, so the page degrades, not 500s.
 * Addons: the registry has no addon endpoint that we could confirm, so they stay on the vendored JSON.
 */
const REGISTRY = (process.env.REGISTRY_URL ?? 'https://api.pikkustudio.app').replace(/\/$/, '')
const TIMEOUT_MS = 4000

export type ApiRow = {
  name: string; title?: string; provider?: string; categories?: string[]; logo?: string
  operations?: number; version?: string; openapiVer?: string; specUrl?: string
  accessStatus?: string; updated?: string; authType?: string; pricingModel?: string; freeTier?: boolean; docsUrl?: string
}
export type Operation = { method?: string; path?: string; operationId?: string; summary?: string }

async function registryGet<T>(path: string): Promise<T> {
  const res = await fetch(REGISTRY + path, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`registry ${path} -> HTTP ${res.status}`)
  return res.json() as Promise<T>
}

/**
 * Static JSON from public/__data, read per request. On Workers that is the ASSETS binding (the
 * files live in the static assets, not in the Worker bundle); under Node (vite dev, the prerender)
 * it is the file on disk.
 */
async function asset<T>(rel: string): Promise<T | null> {
  try {
    const spec = 'cloudflare:workers'
    const { env } = await import(/* @vite-ignore */ spec)
    if (env?.ASSETS) {
      const r = await env.ASSETS.fetch(new Request('https://assets.invalid/__data/' + rel))
      return r.ok ? ((await r.json()) as T) : null
    }
  } catch { /* not on Workers */ }
  const fs = await import(/* @vite-ignore */ 'node:fs/promises')
  const path = await import(/* @vite-ignore */ 'node:path')
  for (const base of ['public', 'dist/client']) {
    try { return JSON.parse(await fs.readFile(path.join(process.cwd(), base, '__data', rel), 'utf8')) as T } catch { /* next */ }
  }
  return null
}
const fixture = async () => (await asset<{ apis: ApiRow[] }>('openapis.json')) ?? { apis: [] }

export const specSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+/, '')

/** Full rows + provider counts, for the browse view (fetched by the client from /registry-data/openapis.json). */
export async function openApiCatalogue() {
  let rows: ApiRow[]; let stale = false
  try {
    rows = []
    for (let offset = 0; ; offset += 1000) {
      const page = await registryGet<{ apis?: ApiRow[]; total?: number }>(`/registry/openapis?limit=1000&offset=${offset}`)
      const apis = page.apis ?? []
      rows.push(...apis)
      if (apis.length < 1000 || rows.length >= (page.total ?? Infinity)) break
    }
  } catch (err) {
    console.warn('[registry] falling back to fixture:', (err as Error).message)
    rows = (await fixture()).apis; stale = true
  }
  const counts = new Map<string, number>()
  for (const r of rows) if (r.provider) counts.set(r.provider, (counts.get(r.provider) ?? 0) + 1)
  return { apis: rows, providers: [...counts.entries()].map(([provider, apiCount]) => ({ provider, apiCount })).sort((a, b) => a.provider.localeCompare(b.provider)), stale }
}

export const listOpenApis = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const rows: ApiRow[] = []
    for (let offset = 0; ; offset += 1000) {
      const page = await registryGet<{ apis?: ApiRow[]; total?: number }>(`/registry/openapis?limit=1000&offset=${offset}`)
      const apis = page.apis ?? []
      rows.push(...apis)
      if (apis.length < 1000 || rows.length >= (page.total ?? Infinity)) break
    }
    return { apis: slim(rows), stale: false }
  } catch (err) {
    console.warn('[registry] falling back to fixture:', (err as Error).message)
    return { apis: slim((await fixture()).apis), stale: true }
  }
})

export const getOpenApi = createServerFn({ method: 'GET' })
  .inputValidator((name: string) => name)
  .handler(async ({ data: slug }) => {
    const fx = (await fixture()).apis
    const name = fx.find((a) => a.name === slug || specSlug(a.name) === slug)?.name ?? slug
    try {
      const row = await registryGet<ApiRow>(`/registry/openapis/${encodeURIComponent(name)}`)
      return { api: row, stale: false }
    } catch (err) {
      console.warn('[registry] detail fallback:', (err as Error).message)
      const row = (await fixture()).apis.find((a) => a.name === name)
      return row ? { api: row, stale: true } : null
    }
  })

const slim = (rows: ApiRow[]) => rows.map(({ name, title, operations, provider, categories }) => ({ name, title, operations, provider, categories }))

/* ── addons (vendored, served from static assets) ─────────── */
const LABELS: Record<string, string> = { ai: 'AI', crm: 'CRM', devops: 'DevOps', ecommerce: 'E-commerce' }
export const labelOf = (c: string) => LABELS[c] ?? c.charAt(0).toUpperCase() + c.slice(1)

export const listAddons = createServerFn({ method: 'GET' }).handler(async () =>
  ((await asset<any[]>('addons.json')) ?? []).map((a) => ({ ...a, categoryLabel: labelOf(a.category) }) as {
    slug: string; name: string; title: string; category: string; categoryLabel: string; description: string | null; functionCount: number
  }),
)

export const getAddon = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    if (!/^[\w-]+$/.test(slug)) return null
    const a = await asset<any>(`addons/${slug}.json`)
    if (!a) return null
    return { ...a, categoryLabel: labelOf(a.category), functions: (a.functions ?? []) as Fn[], secrets: (a.secrets ?? []) as Secret[] } as AddonDetail
  })

export type Fn = { name: string; description?: string; input?: string; output?: string; rpc?: string }
export type Secret = { name: string; displayName?: string; description?: string; secretId: string; optional?: boolean }
export type AddonDetail = { name: string; slug: string; title: string; version?: string; description?: string; categoryLabel: string; category: string; functions: Fn[]; secrets: Secret[] }
