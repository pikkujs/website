// One-off: generate meta.json per folder under content/docs from frontmatter sidebar_position
// (+ _category_.json if present, + labels/wiring icons scraped from the real sidebars.ts).
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const here = path.resolve(import.meta.dirname, '..')
const root = path.join(here, 'content/docs')
const sidebarsTs = fs.readFileSync(path.resolve(here, '../sidebars.ts'), 'utf8')

// --- scrape `label` / `customProps.wirings` per `dirName` category (heuristic, one-off) ---
const dirMeta = {}
const chunks = sidebarsTs.split(/type:\s*'category'/).slice(1)
for (const c of chunks) {
  const head = c.split(/type:\s*'(?:category|doc)'/)[0]
  const dir = /dirName:\s*'([^']+)'/.exec(head)?.[1]
  const label = /label:\s*'([^']+)'/.exec(head)?.[1]
  const w = /wirings:\s*\[([^\]]*)\]/.exec(head)?.[1]
  if (dir) dirMeta[dir] = { label, icon: w ? w.replace(/['\s]/g, '') : undefined }
}
// per-doc icons: `type: 'doc', id: 'x/y', label, customProps.wirings`
const docMeta = {}
for (const m of sidebarsTs.matchAll(/id:\s*'([^']+)',\s*(?:label:\s*'([^']+)',\s*)?customProps:\s*\{\s*wirings:\s*\[([^\]]*)\]/g))
  docMeta[m[1]] = { label: m[2], icon: m[3].replace(/['\s]/g, '') }

const stats = { folders: 0, positioned: 0, folderTitles: 0, folderIcons: 0, pageIcons: 0, categoryJson: 0 }
const pageIconTargets = []

function posOf(entry, dir) { // sidebar_position of a page, or of a folder via its index doc
  const f = entry.isDir
    ? ['index.mdx', 'index.md'].map((i) => path.join(dir, entry.name, i)).find(fs.existsSync)
    : path.join(dir, entry.file)
  if (!f) return undefined
  const p = matter(fs.readFileSync(f, 'utf8')).data.sidebar_position
  return typeof p === 'number' ? p : undefined
}

function visit(dir, rel) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() || (/\.mdx?$/.test(e.name) && !/^index\.mdx?$/.test(e.name)))
    .map((e) => ({ name: e.isDirectory() ? e.name : e.name.replace(/\.mdx?$/, ''), isDir: e.isDirectory(), file: e.name }))
  const meta = {}
  const cat = path.join(dir, '_category_.json')
  if (fs.existsSync(cat)) { const c = JSON.parse(fs.readFileSync(cat, 'utf8')); if (c.label) meta.title = c.label; stats.categoryJson++ }
  if (!meta.title && dirMeta[rel]?.label) { meta.title = dirMeta[rel].label; stats.folderTitles++ }
  if (dirMeta[rel]?.icon) { meta.icon = dirMeta[rel].icon; stats.folderIcons++ }
  const positioned = entries.map((e) => ({ ...e, pos: posOf(e, dir) })).filter((e) => e.pos !== undefined)
    .sort((a, b) => a.pos - b.pos || a.name.localeCompare(b.name))
  stats.positioned += positioned.length
  // Positioned items first, in order; `...` keeps every unlisted item (alphabetical). Without it they would vanish.
  if (positioned.length) meta.pages = [...positioned.map((e) => e.name), '...']
  if (Object.keys(meta).length) { fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n'); stats.folders++ }
  for (const e of entries) if (e.isDir) visit(path.join(dir, e.name), (rel ? rel + '/' : '') + e.name)
}
visit(root, '')

// page icons -> frontmatter `icon: http,websocket`
for (const [id, m] of Object.entries(docMeta)) {
  const f = ['.mdx', '.md'].map((x) => path.join(root, id + x)).find(fs.existsSync)
  if (!f) continue
  const t = fs.readFileSync(f, 'utf8')
  if (/^icon:/m.test(t.split('\n---')[0])) continue
  fs.writeFileSync(f, t.replace(/^---\n/, `---\nicon: ${m.icon}\n`)); stats.pageIcons++
}
console.log(stats)

// ---- curated layer: what meta.json CAN reproduce from the hand-written sidebars.ts ----
const { default: sidebars } = await import(path.resolve(here, '../sidebars.ts'))
const writeMeta = (dir, patch) => {
  const f = path.join(root, dir, 'meta.json')
  const cur = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {}
  fs.writeFileSync(f, JSON.stringify({ ...cur, ...patch }, null, 2) + '\n')
}
const cur = { explicitDocLists: 0 }
const visitItems = (items) => {
  for (const it of items) {
    if (it.type === 'category') {
      const docs = (it.items ?? []).filter((i) => i.type === 'doc')
      const dirs = new Set(docs.map((d) => path.posix.dirname(d.id)))
      if (docs.length && docs.length === (it.items ?? []).length && dirs.size === 1) {
        // a category that lists doc ids by hand: reproduce its order
        writeMeta([...dirs][0], { pages: [...docs.map((d) => path.posix.basename(d.id)), '...'] }); cur.explicitDocLists++
      }
      visitItems(it.items ?? [])
    }
  }
}
visitItems(sidebars.docs)
// root: order, external links (Getting Started, SDK) and categories relocated from other folders via `../`
writeMeta('', { pages: ['index', 'navigation', '[Getting Started](/getting-started)', 'philosophy', 'core-features', 'pikku-cli', 'frontend', 'wiring', '[SDK](/api)', 'deploy', 'middleware', 'addon', 'advanced', '!runtimes', '!custom-runtimes', '!storage', '!api', '!comparison', '...'] })
writeMeta('advanced', { title: 'Advanced', pages: ['...', '../runtimes', '../custom-runtimes', '../storage', '../api'] })
writeMeta('philosophy', { title: 'Philosophy', pages: ['...', '../comparison'] })
console.log('curated layer:', cur)
