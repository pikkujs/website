#!/usr/bin/env node
/**
 * Vendors the two public catalogues and generates the addon pages from them.
 *
 * Run via:  npm run sync-registry
 *
 * Same shape as scripts/generate-api-surface.mjs, and for the same reason: the
 * catalogues are build artifacts of other repos, so we read them where they are
 * authored, vendor a copy into src/data/, and generate from the vendored copy.
 * The site then builds with no network and no sibling checkout — which is what
 * CI has.
 *
 *   addons   ← the addons monorepo's per-package .pikku artifacts (local)
 *   openapis ← registry:listOpenApis on the fabric API (network)
 *
 * The pages themselves are React routes created by plugins/addon-catalogue.js
 * and plugins/openapi-catalogue.js from the vendored data — nothing here writes
 * markdown.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync } from 'node:fs'
import { dirname, resolve, basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * In preference order, like the api-surface script. The artifacts live under
 * each package's `.pikku/addon/`, which only exists once that package has been
 * built — an unbuilt checkout falls through to the vendored copy rather than
 * regenerating the catalogue with holes in it.
 */
const ADDON_SOURCES = [
  resolve(root, '../addons/packages'),
  resolve(root, '.addons/packages'),
]
const VENDORED_ADDONS = resolve(root, 'src/data/addons.json')
const VENDORED_OPENAPIS = resolve(root, 'public/registry/openapis.json')
const LOGO_DIR = resolve(root, 'public/addons')

const FABRIC = process.env.PIKKU_FABRIC_URL ?? 'https://api.pikkufabric.com'

/** Category dir name -> how it reads as a sidebar label. */
const CATEGORY_LABELS = {
  ai: 'AI',
  analytics: 'Analytics',
  automation: 'Automation',
  cache: 'Cache',
  cloud: 'Cloud',
  communication: 'Communication',
  crm: 'CRM',
  crypto: 'Crypto',
  data: 'Data',
  database: 'Database',
  devops: 'DevOps',
  documents: 'Documents',
  ecommerce: 'E-commerce',
  email: 'Email',
  esoteric: 'Esoteric',
  forms: 'Forms',
  infrastructure: 'Infrastructure',
  media: 'Media',
  monitoring: 'Monitoring',
}

// ── helpers ────────────────────────────────────────────────

const readJson = (path) => (existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : undefined)

/** The addon's one-line pitch: the first prose line of its README, under the H1. */
const readmeSummary = (dir) => {
  const path = join(dir, 'README.md')
  if (!existsSync(path)) return undefined
  const lines = readFileSync(path, 'utf8').split('\n')
  const start = lines.findIndex((line) => line.startsWith('# '))
  const paragraph = []
  for (const line of lines.slice(start + 1)) {
    const text = line.trim()
    if (!text) {
      if (paragraph.length) break
      continue
    }
    if (text.startsWith('#')) break
    // These summaries are hard-wrapped in the source READMEs, so a single line
    // ends mid-sentence; take the whole paragraph and unwrap it.
    paragraph.push(text)
  }
  return paragraph.length ? paragraph.join(' ').replace(/\s+/g, ' ') : undefined
}

/** `mailer-lite` -> `Mailer Lite`, `aws-ses` -> `AWS SES`. */
const UPPER = new Set(['aws', 'gcp', 'api', 'ai', 'crm', 'sms', 'ses', 'sns', 's3', 'db', 'ftp', 'id'])
const titleise = (slug) =>
  slug
    .split('-')
    .map((word) => (UPPER.has(word) ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1)))
    .join(' ')

/** Absolute paths from the authoring machine must never reach a public page. */
const stripPath = (file) => (typeof file === 'string' ? file.replace(/^.*?\/packages\/[^/]+\/[^/]+\//, '') : undefined)

/**
 * Generated prose is arbitrary upstream text. `{id}` from a URL template is a
 * JSX expression to MDX and `<T>` is a tag, and frontmatter `format: md` does
 * not reliably stop either — so neutralise them as entities, which render as
 * themselves either way. Pipes would end a table cell.
 */
const escape = (text) =>
  String(text ?? '')
    .replace(/\|/g, '\\|')
    .replace(/[{}]/g, (brace) => (brace === '{' ? '&#123;' : '&#125;'))
    .replace(/</g, '&lt;')
    .replace(/\n+/g, ' ')
    .trim()

/**
 * Addon JSDoc frequently carries a whole usage sample after the summary line.
 * A table cell wants the summary; the sample belongs in the addon's own README.
 */
const summarise = (text, limit = 160) => {
  // Work on the raw text — strip, then truncate, and only escape at the end so
  // truncation can never cut an entity in half and the strippers can never eat
  // the `#` out of one.
  const raw = String(text ?? '')
    // Upstream prose links into the vendor's own docs, often root-relative
    // (`/api-reference/...`), which Docusaurus would resolve against pikku.dev
    // and report as broken. Keep the words, drop the link.
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // URLs are noise in a one-line cell, and truncating one mid-string leaves a
    // fragment that CommonMark still autolinks — which then fails to parse.
    .replace(/<?https?:\/\/\S+>?/g, '')
    .replace(/#{1,6}\s+/g, '') // upstream JSDoc often carries its own headings
    .replace(/\s+/g, ' ')
    .trim()
  if (!raw) return ''
  const sentence = raw.match(/^.*?[.!?](?=\s|$)/)
  const short = sentence ? sentence[0] : raw
  return escape(short.length > limit ? `${short.slice(0, limit - 1).trimEnd()}…` : short)
}

// ── collecting the addons ──────────────────────────────────

const collectAddons = (packagesDir) => {
  const addons = []
  for (const category of readdirSync(packagesDir).sort()) {
    if (category === 'node_modules') continue
    const categoryDir = join(packagesDir, category)
    let entries
    try {
      entries = readdirSync(categoryDir).sort()
    } catch {
      continue // a stray file among the category dirs
    }
    for (const slug of entries) {
      const dir = join(categoryDir, slug)
      const pkg = readJson(join(dir, 'package.json'))
      if (!pkg?.name) continue

      /* Every addon declares its own `addon.displayName` here — the brand as its
         authors spell it (`DeepL`, `ElevenLabs`, `GitHub`). Trust that over
         anything derived from the slug, which cannot carry inner capitals. */
      const config = readJson(join(dir, 'pikku.config.json'))?.addon ?? {}

      const meta = join(dir, '.pikku/addon')
      const verbose = readJson(join(meta, 'function/pikku-functions-meta-verbose.gen.json')) ?? {}
      const plain = readJson(join(meta, 'function/pikku-functions-meta.gen.json')) ?? {}
      const secretsMeta = readJson(join(meta, 'secrets/pikku-secrets-meta.gen.json')) ?? {}
      const rpc = readJson(join(meta, 'rpc/pikku-rpc-wirings-meta.internal.gen.json')) ?? {}

      const functions = Object.entries({ ...plain, ...verbose })
        .map(([name, fn]) => ({
          name,
          description: fn.description,
          sessionless: fn.sessionless ?? undefined,
          services: fn.services?.services ?? [],
          input: fn.inputSchemaName ?? undefined,
          output: fn.outputSchemaName ?? undefined,
          rpc: rpc[name] ?? undefined,
          sourceFile: stripPath(fn.sourceFile),
        }))
        .sort((a, b) => a.name.localeCompare(b.name))

      const secrets = Object.values(secretsMeta)
        .map((secret) => ({
          name: secret.name,
          displayName: secret.displayName,
          description: secret.description,
          secretId: secret.secretId,
          optional: secret.optional ?? undefined,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))

      const svg = readdirSync(dir).find((file) => file.endsWith('.svg'))

      addons.push({
        name: pkg.name,
        slug,
        category,
        version: pkg.version,
        title: config.displayName ?? titleise(slug),
        description: readmeSummary(dir) ?? config.description,
        logo: svg ? `/addons/${slug}.svg` : undefined,
        functions,
        secrets,
        _svgPath: svg ? join(dir, svg) : undefined,
      })
    }
  }
  return addons.sort((a, b) => a.slug.localeCompare(b.slug))
}

// ── the OpenAPI catalogue ──────────────────────────────────

const get = async (path) => {
  const response = await fetch(`${FABRIC}${path}`)
  if (!response.ok) throw new Error(`GET ${path} -> HTTP ${response.status}`)
  return response.json()
}

const rpc = async (name) => {
  const response = await fetch(`${FABRIC}/rpc/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  })
  if (!response.ok) throw new Error(`${name} -> HTTP ${response.status} ${await response.text()}`)
  return response.json()
}

/**
 * The browse page fetches this whole file, so it carries only what the tiles and
 * the filters read. `description` alone was 2.25MB of 3.6MB and nothing renders
 * it — a detail page can fetch one spec from /registry/openapis/:name instead.
 */
/**
 * Every classification column defaults to the string 'unknown' rather than to
 * NULL, so an unenriched row still answers each of them. Rendering that would
 * put "unknown" on two thirds of the catalogue as though it meant something.
 */
const classified = (value) => (value && value !== 'unknown' ? value : undefined)

const trimOpenApi = (entry) => ({
  name: entry.name,
  title: entry.title,
  provider: entry.provider,
  categories: entry.categories ?? [],
  logo: entry.logo,
  /* Filled by fabric's meta-extraction pass. Rows it has not reached yet come
     back 0, and the spec pass below fills those in from the spec itself. */
  operations: entry.totalOperations || undefined,
  /* Security schemes the spec declares — same shape the spec pass produces. */
  auth: entry.securitySchemes?.length ? entry.securitySchemes : undefined,
  version: entry.version,
  openapiVer: entry.openapiVer,
  /* The spec itself. `pikku new addon --openapi` reads a local path, so this is
     what a detail page has to hand the reader before the command can run. */
  specUrl: entry.swaggerUrl,
  /* 'public' | 'auth_required' | 'offline' | 'error' | 'unknown' */
  accessStatus: entry.accessStatus,
  updated: entry.updated,
  /* ── from the enricher ─────────────────────────────────────────────────
     A model reads each spec's docs and classifies it. Only the handful the
     browse page filters or labels on travels in this file; the rest lands in
     the per-spec detail file, which is fetched one at a time. */
  authType: classified(entry.authType),
  apiStatus: classified(entry.apiStatus),
  pricingModel: classified(entry.pricingModel),
  freeTier: entry.freeTier || undefined,
  docsUrl: entry.enrichment?.docsUrl ?? undefined,
})

/**
 * `codegen` as the page wants it. `functionCount` is the true total; `functions`
 * is capped upstream, so a spec with 22,361 operations lists 300 and says so.
 */
const fromCodegen = (codegen) =>
  codegen?.functions
    ? { ...codegen, total: codegen.functionCount ?? codegen.functions.length }
    : undefined

/**
 * Everything the API knows about one spec, for that spec's own page.
 *
 * Kept out of the browse file deliberately: it is fetched whole by every
 * visitor, and these fields multiplied by 2,500 rows are megabytes nobody on
 * the browse page reads.
 */
const detailFromApi = (entry) => ({
  description: entry.description || undefined,
  /* What `pikku new addon --openapi` would generate: the addon's name, the
     functions it would ship, the secrets and variables it would declare.
     Produced by fabric's meta extraction, which already has the document open
     and runs the real generator over it — read here rather than re-derived,
     so the page cannot drift from what the CLI writes. */
  generated: fromCodegen(entry.codegen),
  servers: entry.servers?.length ? entry.servers : undefined,
  contentTypes: entry.contentTypes?.length ? entry.contentTypes : undefined,
  http: entry.http,
  authType: classified(entry.authType),
  authLocation: classified(entry.authLocation),
  authParamName: entry.authParamName ?? undefined,
  authHeaderPrefix: entry.authHeaderPrefix ?? undefined,
  tokenAcquisition: entry.tokenAcquisition ?? undefined,
  perUser: entry.perUser ?? undefined,
  apiStatus: classified(entry.apiStatus),
  pricingModel: classified(entry.pricingModel),
  freeTier: entry.freeTier ?? undefined,
  deprecated: entry.deprecated || undefined,
  pagination: classified(entry.pagination),
  dataFormats: entry.dataFormats?.length ? entry.dataFormats : undefined,
  enriched: entry.enriched || undefined,
  enrichedAt: entry.enrichedAt ?? undefined,
  enrichConfidence: entry.enrichConfidence ?? undefined,
  /* docsUrl, signupUrl, pricingUrl, scopes, rateLimitTier, webhooks… — an
     allowlisted projection, so whatever fabric sends here is safe to render. */
  enrichment: entry.enrichment && Object.keys(entry.enrichment).length ? entry.enrichment : undefined,
})

/**
 * The unpaginated listing is ~4MB and the endpoint 500s on it, which read as an
 * outage for a while. Page through instead — 1,000 at a time is well inside
 * what it will serve.
 */
const PAGE = 1000
const listAllOpenApis = async () => {
  const all = []
  for (let offset = 0; ; offset += PAGE) {
    const page = await get(`/registry/openapis?limit=${PAGE}&offset=${offset}`)
    const apis = page.apis ?? []
    all.push(...apis)
    if (apis.length < PAGE || all.length >= (page.total ?? Infinity)) break
  }
  return all
}

/* ── spec-derived metadata ──────────────────────────────────────────────── */

/**
 * Operation counts, auth schemes and the per-spec operation list, read from the
 * specs themselves.
 *
 * fabric's own extraction (registry:startMetaExtraction, nightly) fills the
 * counts and the schemes, and whatever it has reached wins — this pass only
 * covers the rows it has not got to yet. The operation *list* has no equivalent
 * on the API at all, and it is what a spec's page is mostly made of, so this
 * runs either way.
 *
 * Deliberately mirrors fabric's extractor, packages/addon-registry/src/functions/
 * start-meta-extraction.function.ts, so the two agree on any spec they both read.
 */
const SPEC_META_CACHE = resolve(root, 'src/data/openapi-spec-meta.json')
/**
 * One file per spec. Input to plugins/openapi-catalogue.js, which turns each
 * into its own prerendered route — so these are never served as-is, and none of
 * them belongs in static/.
 */
const SPEC_DETAIL_DIR = resolve(root, 'src/data/openapi-specs')
/**
 * Catalogue names carry dots and colons (`amazonaws.com:ec2`), neither of which
 * belongs in a URL segment — a path component with a dot in it reads as a file
 * to more than one static server, and those pages 404 while their HTML sits
 * right there on disk. Everything outside [a-z0-9] becomes a hyphen.
 *
 * Only the leading hyphens are trimmed. A trailing one looks like an oversight
 * but is load-bearing: `vtex.local:Marketplace-APIs` and
 * `vtex.local:Marketplace-APIs-` are two different entries in the catalogue and
 * this is the only character telling them apart.
 */
const specSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+/, '')
const SPEC_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']
/** Past this a "spec" is a document dump, not a contract worth parsing. */
const MAX_SPEC_BYTES = 12 * 1024 * 1024
const SPEC_TIMEOUT_MS = 30_000
/** apis.guru is a free service — enough to finish in minutes, not enough to hurt. */
const SPEC_CONCURRENCY = 8

/**
 * Operations kept per spec on its detail page. Microsoft Graph alone declares
 * 22,361; nobody scrolls that, and storing every one would put tens of megabytes
 * of third-party path strings in this repo. The true total is kept alongside, so
 * a capped page says "300 of 22,361" rather than quietly under-reporting.
 */
const MAX_DETAIL_OPERATIONS = 300
/** Enough tags to name what an API covers without listing its whole taxonomy. */
const TOP_TAGS = 12

const readSpecMeta = (doc) => {
  const declared = doc.components?.securitySchemes ?? doc.securityDefinitions ?? {}
  const auth = new Set()
  for (const scheme of Object.values(declared)) {
    if (!scheme || typeof scheme !== 'object') continue
    if (scheme.type === 'oauth2') auth.add('oauth2')
    else if (scheme.type === 'http') auth.add(scheme.scheme ?? 'http')
    else if (scheme.type === 'apiKey') auth.add(`apiKey:${scheme.in ?? 'header'}`)
    else if (scheme.type === 'openIdConnect') auth.add('openIdConnect')
  }

  let operations = 0
  const methods = {}
  const tagCounts = new Map()
  const kept = []

  for (const [path, item] of Object.entries(doc.paths ?? {})) {
    for (const method of SPEC_METHODS) {
      const operation = item?.[method]
      if (!operation) continue
      operations++
      methods[method] = (methods[method] ?? 0) + 1
      for (const tag of operation.tags ?? []) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
      }
      /* What `pikku new addon --openapi` would generate a function for, one
         entry each. This is the "functions" half of the catalogue and it comes
         entirely from the spec — fabric's enrichment carries no operations. */
      if (kept.length < MAX_DETAIL_OPERATIONS) {
        kept.push({
          method,
          path,
          id: operation.operationId || undefined,
          summary: operation.summary || undefined,
          tags: operation.tags?.length ? operation.tags : undefined,
        })
      }
    }
  }

  /* Where the spec itself says its documentation lives. This is the same pair
     fabric's enricher seeds `docsUrl` from before it asks a model to refine it,
     so it is the honest half of that field and needs no model to obtain. */
  const docsUrl = doc.externalDocs?.url ?? doc.info?.contact?.url ?? undefined

  const baseUrl = doc.servers?.length
    ? doc.servers.find((server) => !/\{/.test(server.url ?? ''))?.url ?? doc.servers[0]?.url
    : doc.host
      ? `${doc.schemes?.[0] ?? 'https'}://${doc.host}${doc.basePath ?? ''}`
      : undefined

  return {
    operations,
    auth: [...auth],
    methods,
    tags: [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_TAGS)
      .map(([tag]) => tag),
    kept,
    docsUrl,
    baseUrl,
    license: doc.info?.license?.name ?? undefined,
  }
}

const fetchSpecMeta = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(SPEC_TIMEOUT_MS) })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const declaredSize = Number(response.headers.get('content-length') ?? 0)
  if (declaredSize > MAX_SPEC_BYTES) {
    throw new Error(`spec is ${Math.round(declaredSize / 1e6)}MB`)
  }
  return readSpecMeta(JSON.parse(await response.text()))
}

/** Bounded fan-out — Promise.all over 2,500 fetches would open 2,500 sockets. */
const pool = async (items, size, worker) => {
  let next = 0
  const run = async () => {
    while (next < items.length) await worker(items[next++])
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, run))
}

/**
 * Fills `operations` and `auth` on each entry, in place.
 *
 * The cache is keyed by name@version and records failures as well as hits: a
 * spec that 404s or is not JSON will do the same tomorrow, and re-fetching a few
 * hundred dead URLs on every sync is the difference between a minute and an
 * hour. Delete src/data/openapi-spec-meta.json to re-read the catalogue.
 */
const addSpecMeta = async (apis, specUrls) => {
  const cache = readJson(SPEC_META_CACHE) ?? {}
  mkdirSync(SPEC_DETAIL_DIR, { recursive: true })
  /* A cache hit is not enough on its own: the operation list lives only in the
     detail file, which is generated output and not in git, so a fresh checkout
     has the cache but none of the files it summarises. Re-read those specs. */
  const missing = apis.filter(
    (api) =>
      !cache[`${api.name}@${api.version}`] ||
      !existsSync(join(SPEC_DETAIL_DIR, `${specSlug(api.name)}.json`)),
  )

  if (missing.length > 0) {
    console.log(`[registry] specs: reading ${missing.length} of ${apis.length}…`)
    let done = 0
    await pool(missing, SPEC_CONCURRENCY, async (api) => {
      const key = `${api.name}@${api.version}`
      try {
        const { kept, ...summary } = await fetchSpecMeta(specUrls.get(key))
        /* The operation list is per-spec and only ever read by that spec's own
           route, so it lands in its own file rather than in the shared cache —
           which every build reads whole. */
        writeFileSync(
          join(SPEC_DETAIL_DIR, `${specSlug(api.name)}.json`),
          JSON.stringify({
            name: api.name,
            title: api.title,
            version: api.version,
            specUrl: specUrls.get(key),
            ...summary,
            shown: kept.length,
            functions: kept,
          }),
        )
        cache[key] = summary
      } catch (error) {
        cache[key] = { error: String(error.message ?? error).slice(0, 120) }
      }
      if (++done % 250 === 0) console.log(`[registry] specs: ${done}/${missing.length}`)
    })
    writeFileSync(SPEC_META_CACHE, JSON.stringify(cache, null, 2))
  }

  let read = 0
  for (const api of apis) {
    const meta = cache[`${api.name}@${api.version}`]
    if (!meta || meta.error) continue
    read++
    api.operations = api.operations ?? meta.operations ?? undefined
    if (!api.auth?.length && meta.auth.length > 0) api.auth = meta.auth
    /* Only the fields the browse page reads travel in the vendored file — the
       whole thing is fetched by the client. Everything else stays in the cache
       for the generator to build detail pages from. */
    if (!api.docsUrl && meta.docsUrl) api.docsUrl = meta.docsUrl
  }
  console.log(`[registry] specs: ${read} of ${apis.length} parsed`)
}

/**
 * Folds the API's answer for each spec into that spec's detail file.
 *
 * Merged rather than written fresh: the operation list in there came from the
 * spec pass, which only fetches a given spec once, so a rewrite would drop it.
 */
const writeSpecDetails = (list, apis) => {
  mkdirSync(SPEC_DETAIL_DIR, { recursive: true })
  const trimmed = new Map(apis.map((api) => [api.name, api]))
  let enriched = 0
  for (const entry of list) {
    const file = join(SPEC_DETAIL_DIR, `${specSlug(entry.name)}.json`)
    const detail = detailFromApi(entry)
    for (const [key, value] of Object.entries(detail)) {
      if (value === undefined) delete detail[key]
    }
    const api = trimmed.get(entry.name)
    writeFileSync(
      file,
      JSON.stringify({
        ...(readJson(file) ?? {}),
        name: entry.name,
        title: entry.title,
        version: entry.version,
        specUrl: entry.swaggerUrl,
        ...(api?.operations ? { operations: api.operations } : {}),
        ...(api?.auth ? { auth: api.auth } : {}),
        ...detail,
      }),
    )
    if (detail.enriched) enriched++
  }
  console.log(`[registry] specs: ${list.length} detail files, ${enriched} enriched by fabric`)
}

const syncOpenApis = async () => {
  try {
    const [list, providers] = await Promise.all([
      listAllOpenApis(),
      get('/registry/openapis/providers'),
    ])
    const apis = list.map(trimOpenApi)
    await addSpecMeta(
      apis,
      new Map(list.map((entry) => [`${entry.name}@${entry.version}`, entry.swaggerUrl])),
    )
    writeSpecDetails(list, apis)
    mkdirSync(dirname(VENDORED_OPENAPIS), { recursive: true })
    writeFileSync(VENDORED_OPENAPIS, JSON.stringify({ apis, providers }))
    console.log(`[registry] openapis: ${apis.length} APIs from ${providers.length} providers -> ${VENDORED_OPENAPIS}`)
    return apis.length
  } catch (error) {
    const existing = readJson(VENDORED_OPENAPIS)
    console.warn(`[registry] openapis: FETCH FAILED — ${error.message}`)
    if (existing) {
      console.warn(`[registry] openapis: keeping the vendored copy (${existing.apis.length} APIs). Nothing was overwritten.`)
      return existing.apis.length
    }
    console.warn('[registry] openapis: no vendored copy to fall back on — the browse page will render empty until this succeeds.')
    return 0
  }
}

// ── run ────────────────────────────────────────────────────

const source = ADDON_SOURCES.find((path) => existsSync(path))
let addons
if (source) {
  addons = collectAddons(source)
  console.log(`[registry] addons: ${addons.length} packages read from ${source}`)
} else {
  const vendored = readJson(VENDORED_ADDONS)
  if (!vendored) {
    console.error(
      `[registry] No addons source found and nothing vendored. Looked in:\n  ${ADDON_SOURCES.join('\n  ')}\n` +
        'Check out the addons monorepo beside this one, or restore src/data/addons.json.'
    )
    process.exit(1)
  }
  addons = vendored.addons
  console.log(`[registry] addons: no checkout found, generating from the vendored ${addons.length}`)
}

// Logos next, while we still have the source paths to copy from.
if (source) {
  mkdirSync(LOGO_DIR, { recursive: true })
  let copied = 0
  for (const addon of addons) {
    if (!addon._svgPath) continue
    copyFileSync(addon._svgPath, resolve(LOGO_DIR, `${addon.slug}.svg`))
    copied++
  }
  console.log(`[registry] addons: ${copied} logos -> ${LOGO_DIR}`)
}
for (const addon of addons) delete addon._svgPath

mkdirSync(dirname(VENDORED_ADDONS), { recursive: true })
writeFileSync(VENDORED_ADDONS, JSON.stringify({ addons }, null, 2))

const apiCount = await syncOpenApis()

console.log(`[registry] vendored ${VENDORED_ADDONS}`)
console.log(`[registry] catalogue: ${addons.length} addons, ${apiCount} OpenAPI specs`)
