// Splits the vendored catalogue into small static JSON files under public/__data, which Vite copies into
// dist/client. Prerender reads them from disk; client-side navigation fetches them (there is no server at runtime).
//   addons.json, addons/<slug>.json   from src/data/addons.json
//   openapis-browse.json               the browse table (+ provider counts), from public/registry/openapis.json
//   openapis/<slug>.json               per-spec detail: src/data/openapi-specs/<slug>.json when `npm run sync-registry`
//                                      produced it, otherwise the catalogue row
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, 'public/__data')
fs.rmSync(out, { recursive: true, force: true })
for (const d of ['addons', 'openapis']) fs.mkdirSync(path.join(out, d), { recursive: true })
const write = (rel, v) => fs.writeFileSync(path.join(out, rel), JSON.stringify(v))
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))

const addons = readJson(path.join(root, 'src/data/addons.json')).addons
write('addons.json', addons.map((a) => ({ slug: a.slug, name: a.name, title: a.title, category: a.category, description: a.description ?? null, functionCount: a.functions?.length ?? 0 })))
for (const a of addons) write(`addons/${a.slug}.json`, a)

/** Same rule as specSlug in scripts/generate-registry.mjs and src/views/openapis.tsx. */
const specSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+/, '')
const apis = readJson(path.join(root, 'public/registry/openapis.json')).apis
const metaPath = path.join(root, 'src/data/openapi-spec-meta.json')
const meta = fs.existsSync(metaPath) ? readJson(metaPath) : {}
const detailDir = path.join(root, 'src/data/openapi-specs')
const counts = new Map()
const rows = apis.map((a) => {
  if (a.provider) counts.set(a.provider, (counts.get(a.provider) ?? 0) + 1)
  const auth = meta[`${a.name}@${a.version}`]?.auth
  return auth ? { ...a, auth } : a
})
write('openapis-browse.json', { apis: rows, providers: [...counts].map(([provider, apiCount]) => ({ provider, apiCount })).sort((x, y) => x.provider.localeCompare(y.provider)) })
let rich = 0
for (const a of rows) {
  const slug = specSlug(a.name)
  const f = path.join(detailDir, `${slug}.json`)
  const detail = fs.existsSync(f) ? (rich++, readJson(f)) : a
  write(`openapis/${slug}.json`, { ...detail, slug })
}
console.log(`gen-data: ${addons.length} addons, ${apis.length} openapis (${rich} with full detail)`)
