// Seeds the addon catalogue from src/data/addons.json (the Docusaurus repo's vendored data).
//
//   node backend/db/seed.ts            -> writes db/seed/addons.sql and applies it to the local SQLite file
//   node backend/db/seed.ts --sql-only -> only writes the SQL (feed it to `wrangler d1 execute --file`)
//
// The SQL file is the portable artifact: plain INSERTs, no driver specifics, so the same file seeds
// node:sqlite locally and a D1 database remotely.
import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '../..')
const source = path.resolve(root, process.env.ADDONS_JSON ?? '../src/data/addons.json')
const dbFile = path.resolve(root, process.env.SITE_DB ?? '.pikku-runtime/dev.db')
const sqlFile = path.join(root, 'db/seed/addons.sql')

const LABELS: Record<string, string> = { ai: 'AI', crm: 'CRM', devops: 'DevOps', ecommerce: 'E-commerce' }
const label = (c: string) => LABELS[c] ?? c.split('-').map((w) => w[0]!.toUpperCase() + w.slice(1)).join(' ')
const q = (v: unknown) => (v == null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`)

const { addons } = JSON.parse(fs.readFileSync(source, 'utf8')) as { addons: any[] }
const lines: string[] = ['DELETE FROM addon_function;', 'DELETE FROM addon;']
for (const a of addons) {
  lines.push(`INSERT INTO addon (slug, name, title, version, description, category, category_label, logo, secrets) VALUES (${[
    q(a.slug), q(a.name), q(a.title), q(a.version), q(a.description), q(a.category), q(label(a.category)), q(a.logo), q(JSON.stringify(a.secrets ?? [])),
  ].join(', ')});`)
  ;(a.functions ?? []).forEach((f: any, i: number) => {
    lines.push(`INSERT INTO addon_function (addon_slug, position, name, rpc, description, input, output) VALUES (${[
      q(a.slug), i, q(f.name), q(f.rpc), q(f.description), q(f.input), q(f.output),
    ].join(', ')});`)
  })
}
fs.mkdirSync(path.dirname(sqlFile), { recursive: true })
fs.writeFileSync(sqlFile, lines.join('\n') + '\n')
console.log(`wrote ${path.relative(root, sqlFile)}: ${addons.length} addons, ${lines.length - 2 - addons.length} functions`)

if (!process.argv.includes('--sql-only')) {
  fs.mkdirSync(path.dirname(dbFile), { recursive: true })
  const db = new DatabaseSync(dbFile)
  db.exec('PRAGMA foreign_keys = ON')
  // pikku dev applies db/sqlite/*.sql itself; this makes the seed usable before the first `pikku dev`.
  for (const f of fs.readdirSync(path.join(root, 'db/sqlite')).filter((f) => f.endsWith('.sql')).sort()) {
    db.exec(fs.readFileSync(path.join(root, 'db/sqlite', f), 'utf8'))
  }
  db.exec('BEGIN')
  db.exec(fs.readFileSync(sqlFile, 'utf8'))
  db.exec('COMMIT')
  const n = db.prepare('SELECT (SELECT count(*) FROM addon) a, (SELECT count(*) FROM addon_function) f').get() as any
  console.log(`seeded ${path.relative(root, dbFile)}: addon=${n.a} addon_function=${n.f}`)
  db.close()
}
