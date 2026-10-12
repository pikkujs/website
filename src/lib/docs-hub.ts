import { source } from './source'

/**
 * The /docs hub. Rows name a page by URL; the title and description are read from that page's
 * frontmatter, so the hub can never drift from the docs and a row pointing at a missing page
 * fails the build. Only the external-to-docs rows (SDK, catalogues) carry their own text.
 *
 * `icon` is a wiring id (`w:http`) or a lucide name (`l:Layers`); `hue` picks the tile colour.
 */
export type Hue = 'clay' | 'moss' | 'ochre' | 'slate' | 'rose'
type RowSpec = { url: string; icon: string; hue: Hue; title?: string; description?: string }
type GroupSpec = { id: string; title: string; blurb: string; rows: RowSpec[] }

export const GROUPS: GroupSpec[] = [
  {
    id: 'build',
    title: 'Build',
    blurb: 'The pieces you write: functions, the wires that expose them, and what guards them.',
    rows: [
      { url: '/docs/core-features', icon: 'l:Layers', hue: 'clay', title: 'Core features' },
      { url: '/docs/wiring', icon: 'w:rpc', hue: 'moss' },
      { url: '/docs/middleware', icon: 'l:ShieldCheck', hue: 'slate' },
      { url: '/docs/addon', icon: 'l:Package', hue: 'ochre' },
      { url: '/docs/frontend', icon: 'l:AppWindow', hue: 'rose' },
    ],
  },
  {
    id: 'run',
    title: 'Run it',
    blurb: 'Where it lives: deploy targets, runtimes and storage backends.',
    rows: [
      { url: '/docs/deploy', icon: 'l:Rocket', hue: 'clay' },
      { url: '/docs/runtimes', icon: 'l:Server', hue: 'moss' },
      { url: '/docs/storage', icon: 'l:Database', hue: 'slate', title: 'Storage' },
    ],
  },
  {
    id: 'reference',
    title: 'Reference',
    blurb: 'Look something up: the CLI, every export, every service, every catalogue.',
    rows: [
      { url: '/docs/pikku-cli', icon: 'w:cli', hue: 'clay' },
      { url: '/api', icon: 'l:BookOpen', hue: 'moss', title: 'SDK', description: 'Everything Pikku gives you to import, in the order you meet it while building a service' },
      { url: '/docs/api', icon: 'l:Boxes', hue: 'slate' },
      { url: '/docs/pikku-cli/errors', icon: 'l:TriangleAlert', hue: 'rose' },
      { url: '/addons', icon: 'l:Puzzle', hue: 'ochre', title: 'Addon catalogue', description: 'Every Pikku addon: typed functions for hundreds of services, ready to call over RPC' },
      { url: '/openapis', icon: 'l:FileJson', hue: 'moss', title: 'OpenAPI catalogue', description: 'Every OpenAPI specification pikku can generate a typed client for, searchable by provider and category' },
    ],
  },
  {
    id: 'concepts',
    title: 'Why Pikku',
    blurb: 'The ideas behind it, for when you want the reasoning before the reference.',
    rows: [
      { url: '/docs/philosophy', icon: 'l:Lightbulb', hue: 'ochre' },
      { url: '/docs/philosophy/architecture', icon: 'l:Workflow', hue: 'slate' },
      { url: '/docs/pikku-cli/tree-shaking', icon: 'l:Scissors', hue: 'rose' },
    ],
  },
]

/** Task rows: the question a developer actually has, and the one page that answers it. */
export const QUESTIONS: { q: string; url: string; icon: string; hue: Hue }[] = [
  { q: 'How do I run a cron job?', url: '/docs/wiring/scheduled-tasks', icon: 'w:cron', hue: 'ochre' },
  { q: 'How do I process work in the background?', url: '/docs/wiring/queue', icon: 'w:queue', hue: 'moss' },
  { q: 'How do I stream updates to the browser?', url: '/docs/wiring/http/server-sent-events', icon: 'w:sse', hue: 'slate' },
  { q: 'How do I authenticate requests?', url: '/docs/middleware', icon: 'l:KeyRound', hue: 'clay' },
  { q: 'How do I keep secrets out of my code?', url: '/docs/core-features/secrets', icon: 'l:Lock', hue: 'rose' },
  { q: 'How do I give AI agents access to my functions?', url: '/docs/wiring/mcp', icon: 'w:mcp', hue: 'moss' },
  { q: 'How do I build a multi-step, durable workflow?', url: '/docs/wiring/workflows', icon: 'w:workflow', hue: 'slate' },
  { q: 'How do I generate an OpenAPI spec?', url: '/docs/wiring/http/openapi', icon: 'l:FileJson', hue: 'ochre' },
  { q: 'How do I test a function?', url: '/docs/core-features/testing', icon: 'l:FlaskConical', hue: 'clay' },
  { q: 'How do I change a function without breaking clients?', url: '/docs/core-features/versioning', icon: 'l:GitCompare', hue: 'rose' },
  { q: 'What does this PKU error mean?', url: '/docs/pikku-cli/errors', icon: 'l:TriangleAlert', hue: 'rose' },
]

export type HubRowData = { url: string; title: string; description: string; icon: string; hue: Hue }
export type HubData = { wires: ChildRow[]; groups: { id: string; title: string; blurb: string; rows: HubRowData[] }[]; questions: (HubRowData & { q: string })[] }

const slugsOf = (url: string) => url.replace(/^\/docs\/?/, '').split('/').filter(Boolean)
const isDocs = (url: string) => url === '/docs' || url.startsWith('/docs/')

/** Resolves a docs URL to its page; throws (failing the build) if the page doesn't exist. */
const resolve = (url: string) => {
  const page = source.getPage(slugsOf(url))
  if (!page) throw new Error(`docs hub: no page at ${url}`)
  return page
}
const row = (r: RowSpec): HubRowData => {
  if (!isDocs(r.url)) {
    if (!r.title || !r.description) throw new Error(`docs hub: ${r.url} is outside /docs, so it needs a title and description`)
    return { url: r.url, title: r.title, description: r.description, icon: r.icon, hue: r.hue }
  }
  const page = resolve(r.url)
  const description = r.description ?? page.data.description ?? ''
  if (!description) throw new Error(`docs hub: ${r.url} has no description in its frontmatter`)
  return { url: r.url, title: r.title ?? page.data.title ?? '', description, icon: r.icon, hue: r.hue }
}
export const hubData = (): HubData => ({
  wires: childrenOf('/docs/wiring'),
  groups: GROUPS.map((g) => ({ id: g.id, title: g.title, blurb: g.blurb, rows: g.rows.map(row) })),
  questions: QUESTIONS.map((x) => ({ ...row({ url: x.url, icon: x.icon, hue: x.hue }), q: x.q })),
})

/* ---- section hubs: the children of a folder, from the page tree ---- */

export type ChildRow = { url: string; title: string; description: string; count?: number; icon?: string }

const countPages = (n: any): number => (n.type === 'page' ? 1 : (n.index ? 1 : 0) + n.children.reduce((a: number, c: any) => a + countPages(c), 0))
const firstUrl = (n: any): string | undefined => (n.type === 'page' ? n.url : n.index?.url ?? n.children.map(firstUrl).find(Boolean))
const findFolder = (nodes: any[], url: string): any =>
  nodes.reduce((hit: any, n: any) => hit ?? (n.type === 'folder' ? (n.index?.url === url ? n : findFolder(n.children, url)) : undefined), undefined)

/** Rows for the children of the folder whose index page is `url`, in meta.json order. */
export const childrenOf = (url: string): ChildRow[] => {
  const root = source.getPageTree() as any
  const folder = url === '/docs' ? root : findFolder(root.children, url)
  if (!folder) return []
  const out: ChildRow[] = []
  // a section that is itself a long list (the ~90 PKU codes) is browsed on its own page, not as rows
  if (url !== '/docs/wiring' && folder.children.length > 40) return []
  for (const n of folder.children) {
    if (n.type === 'separator') continue
    const to = firstUrl(n)
    if (!to || to === url) continue
    const page = source.getPage(slugsOf(to))
    const own = n.type === 'folder' && n.index ? source.getPage(slugsOf(n.index.url)) : page
    out.push({
      url: to,
      title: typeof n.name === 'string' ? n.name : (own?.data.title ?? ''),
      description: own?.data.description ?? '',
      count: n.type === 'folder' ? countPages(n) : undefined,
      icon: typeof n.icon === 'string' ? n.icon : undefined,
    })
  }
  return out
}
