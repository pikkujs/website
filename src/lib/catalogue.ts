import { fetchPayload } from '@/lib/payload-client'

/**
 * The catalogue is static: scripts/gen-data.mjs writes small JSON files to __data/, prerender reads them
 * from disk and client-side navigation fetches them from the same URLs. Nothing here runs on a server at
 * runtime. The data is the vendored snapshot, refreshed by `npm run sync-registry` in CI.
 */
async function read<T>(rel: string): Promise<T> {
  if (import.meta.env.SSR) {
    const fs = await import(/* @vite-ignore */ 'node:fs/promises')
    const path = await import(/* @vite-ignore */ 'node:path')
    for (const base of ['public', 'dist/client']) {
      try { return JSON.parse(await fs.readFile(path.join(process.cwd(), base, '__data', rel), 'utf8')) as T } catch { /* next */ }
    }
    const { notFound } = await import('@tanstack/react-router')
    throw notFound()
  }
  // Detail pages are live from the registry (the Worker's /live/<kind>/<slug>); the browse lists stay on the
  // static snapshot in /__data, which is deployed as ordinary assets.
  const live = import.meta.env.VITE_CATALOGUE_SOURCE === 'registry' && /^(addons|openapis)\/[^/]+\.json$/.test(rel)
  return fetchPayload<T>(live ? `/live/${rel.replace(/\.json$/, '')}` : `/__data/${rel}`)
}

const LABELS: Record<string, string> = { ai: 'AI', crm: 'CRM', devops: 'DevOps', ecommerce: 'E-commerce' }
export const labelOf = (c: string) => LABELS[c] ?? c.charAt(0).toUpperCase() + c.slice(1)

export const listAddons = async () =>
  (await read<any[]>('addons.json')).map((a) => ({ ...a, categoryLabel: labelOf(a.category) }) as {
    slug: string; name: string; title: string; category: string; categoryLabel: string; description: string | null; functionCount: number
  })

/** The Worker build (vite.config.worker.ts) reads detail pages live from the Studio registry instead of the snapshot. */
const LIVE = import.meta.env.VITE_CATALOGUE_SOURCE === 'registry'

export const getAddon = async (slug: string) => {
  if (!/^[\w-]+$/.test(slug)) return null
  if (LIVE && import.meta.env.SSR) {
    const a = await (await import('./registry')).registryAddon(slug)
    return a ? ({ ...a, categoryLabel: labelOf(a.category) } as AddonDetail) : null
  }
  const a = await read<any>(`addons/${slug}.json`)
  return { ...a, categoryLabel: labelOf(a.category), functions: (a.functions ?? []) as Fn[], secrets: (a.secrets ?? []) as Secret[] } as AddonDetail
}

export const getOpenApi = async (slug: string) => {
  if (!/^[\w-]+$/.test(slug)) return null
  if (LIVE && import.meta.env.SSR) return (await import('./registry')).registryOpenApi(slug) as any
  return read<Record<string, any> & { slug: string; name: string }>(`openapis/${slug}.json`)
}

export type Fn = { name: string; description?: string; input?: string; output?: string; rpc?: string }
export type Secret = { name: string; displayName?: string; description?: string; secretId: string; optional?: boolean }
export type AddonDetail = { name: string; slug: string; title: string; version?: string; description?: string; categoryLabel: string; category: string; functions: Fn[]; secrets: Secret[] }
