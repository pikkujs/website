import { menuColumns, type MenuEntry } from '@/components/site/nav-data'
import { wireTypes } from '@/data/wireTypes'

/**
 * The /features section: the same groups and pages as the "Features" mega menu (nav-data.ts is the one source),
 * shaped like the docs page tree so the docs sidebar (TreeNav) renders it unchanged.
 */
export const FEATURES_URL = '/features'

/** Longer copy for the overview rows; anything not listed falls back to the mega-menu description. */
const LONG: Record<string, string> = {
  '/core/services': "Inject what you need. Tree-shake what you don't. Type-safe dependency injection without decorators.",
  '/core/security': 'Sessions, permissions, and auth middleware, one API across every transport.',
  '/core/versioning': 'Evolve functions, keep workflows running. Contract hashing and CI enforcement.',
  '/core/secrets': 'Type-safe config with Zod schemas, validated at startup, managed from code.',
  '/core/treeshaking': 'Filter by routes, tags, or types. Deploy only what each service needs.',
  '/core/built-in-services': 'JWT, queues, workflows, AI storage, secrets: every interface and provider.',
  '/wires/agent#scoring': 'Grade what an agent actually did, in code or with a second model, in tests and on live traffic.',
  '/core/addons': 'Bundle functions, services, and secrets into npm packages. Install once, wire once.',
}

/** Sidebar icons are wiring icons only (as in the docs tree); the agent wire's icon id is `bot`. */
const WIRE_ICON: Record<string, string> = Object.fromEntries(wireTypes.map((w) => [w.url, w.id === 'agent' ? 'bot' : w.id]))

export type FeatureEntry = MenuEntry & { group: string; long: string; badge?: string; snippet?: string; wireIcon?: string }
export type FeatureGroup = { id: string; label: string; entries: FeatureEntry[] }

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const featureGroups: FeatureGroup[] = menuColumns.map((col) => ({
  id: slug(col.label),
  label: col.label,
  entries: col.entries.map((e) => {
    const wire = wireTypes.find((w) => w.url === e.url)
    return { ...e, group: col.label, long: LONG[e.url] ?? e.description, badge: wire?.badge, snippet: wire?.snippet, wireIcon: WIRE_ICON[e.url] }
  }),
}))

/** Pages in reading order, for breadcrumbs and previous/next (anchor links into another page are skipped). */
export const featurePages: FeatureEntry[] = featureGroups.flatMap((g) => g.entries).filter((e) => !e.url.includes('#'))

/** Page-tree nodes for TreeNav: an overview page, then one labelled run of pages per group. */
export const featuresTree: any[] = [
  { type: 'page', name: 'Overview', url: FEATURES_URL },
  ...featureGroups.flatMap((g) => [
    { type: 'separator', name: g.label },
    ...g.entries.map((e) => ({ type: 'page', name: e.label, url: e.url, icon: e.wireIcon })),
  ]),
]
