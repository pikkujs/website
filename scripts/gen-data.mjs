// Splits the vendored catalogue JSON into small static files under public/__data, which Vite copies
// into dist/client. The Worker then reads one small file per request through the ASSETS binding
// instead of carrying ~4 MB of JSON in its own bundle.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, 'public/__data')
fs.rmSync(out, { recursive: true, force: true })
fs.mkdirSync(path.join(out, 'addons'), { recursive: true })
const write = (rel, v) => fs.writeFileSync(path.join(out, rel), JSON.stringify(v))

const addons = JSON.parse(fs.readFileSync(path.join(root, 'src/data/addons.json'), 'utf8')).addons
write('addons.json', addons.map((a) => ({ slug: a.slug, name: a.name, title: a.title, category: a.category, description: a.description ?? null, functionCount: a.functions?.length ?? 0 })))
for (const a of addons) write(`addons/${a.slug}.json`, a)

const fixture = JSON.parse(fs.readFileSync(path.join(root, 'public/registry/openapis.json'), 'utf8'))
write('openapis.json', { apis: fixture.apis })
console.log(`gen-data: ${addons.length} addons, ${fixture.apis.length} openapis`)
