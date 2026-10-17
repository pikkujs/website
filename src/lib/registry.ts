/**
 * The live catalogue, read from the Studio registry. Only the Worker uses this: the static site has no server
 * at runtime, so its addon and OpenAPI detail pages come from here instead of a build-time snapshot.
 *
 * Shapes are mapped onto what the existing detail components already render (see src/lib/catalogue.ts), so the
 * pages look the same whether they were prerendered or rendered on demand.
 */
export const REGISTRY = 'https://api.pikkustudio.app'

/** Shown where the registry has no description yet (older publishes predate the node description meta). */
export const DESCRIPTION_PLACEHOLDER = 'Description coming soon.'

const specSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+/, '')

async function get<T>(path: string): Promise<T | null> {
  const res = await fetch(REGISTRY + path, { headers: { accept: 'application/json' } })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`registry ${path} -> HTTP ${res.status}`)
  const text = await res.text()
  return text ? (JSON.parse(text) as T) : null // an unknown id answers 200 with an empty body
}

/* ---- addons ---- */

type RegistryFn = { name: string; description?: string; sessionless?: boolean; inputSchemaName?: string; outputSchemaName?: string; services?: { services?: string[] } | string[] }
type RegistrySecret = { name?: string; displayName?: string; description?: string; secretId?: string; optional?: boolean }
type RegistryPackage = {
  id: string; name: string; displayName?: string; description?: string; version?: string; categories?: string[]
  functions?: Record<string, RegistryFn>; secrets?: Record<string, RegistrySecret>
}

const addonId = (slug: string) => `pikku-addon-${slug}`

const toAddon = (p: RegistryPackage, slug: string) => {
  const category = p.categories?.[0] ?? 'other'
  return {
    name: p.name,
    slug,
    title: p.displayName ?? slug,
    version: p.version,
    description: p.description || undefined,
    category,
    logo: `${REGISTRY}/registry/addons/${p.id}/icon`,
    functions: Object.entries(p.functions ?? {}).map(([name, f]) => ({
      name,
      description: f.description || DESCRIPTION_PLACEHOLDER,
      sessionless: f.sessionless,
      services: Array.isArray(f.services) ? f.services : f.services?.services ?? [],
      input: f.inputSchemaName,
      output: f.outputSchemaName,
      rpc: name,
    })),
    secrets: Object.entries(p.secrets ?? {}).map(([key, s]) => ({
      name: s.name ?? key, displayName: s.displayName, description: s.description, secretId: s.secretId ?? key, optional: s.optional,
    })),
  }
}

export async function registryAddon(slug: string) {
  if (!/^[\w-]+$/.test(slug)) return null
  const p = await get<RegistryPackage>(`/registry/addons/${addonId(slug)}`)
  return p ? toAddon(p, slug) : null
}

/* ---- OpenAPIs ---- */

type RegistryApi = { name: string; version?: string } & Record<string, unknown>

/** The whole list is one request (limit=5000 returns every spec), used to turn our lossy slugs back into names. */
async function listApis(): Promise<RegistryApi[]> {
  return (await get<{ apis: RegistryApi[] }>('/registry/openapis?limit=5000'))?.apis ?? []
}

export async function registryOpenApi(slug: string) {
  if (!/^[\w-]+$/.test(slug)) return null
  const row = (await listApis()).find((a) => specSlug(a.name) === slug)
  if (!row) return null
  const detail = await get<RegistryApi>(`/registry/openapis/${encodeURIComponent(row.name)}`)
  return { ...(detail ?? row), slug }
}

/** Every addon and spec slug, for the Worker's sitemap. */
export async function registrySlugs() {
  const [pkgs, apis] = await Promise.all([get<{ packages: { id: string }[] }>('/registry/addons?limit=5000'), listApis()])
  return {
    addons: (pkgs?.packages ?? []).map((p) => p.id.replace(/^pikku-addon-/, '')),
    openapis: apis.map((a) => specSlug(a.name)),
  }
}
