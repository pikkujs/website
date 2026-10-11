// Source-level layer: next-validate-link over every doc + blog file (no Next needed).
// MODE=migrated (default, content/) | original (../{docs,blog} untouched Docusaurus sources)
import path from 'node:path'
import fs from 'node:fs'
import fg from 'fast-glob'
import GithubSlugger from 'github-slugger'
import { validateFiles, readFileFromPath } from 'next-validate-link'

const here = path.resolve(import.meta.dirname, '..')
const MODE = process.env.MODE ?? 'migrated'
const base = MODE === 'original' ? path.resolve(here, '..') : path.join(here, 'content')
const docsRoot = path.join(base, 'docs'), blogRoot = path.join(base, 'blog')
const strip = (f) => f.replace(/\.mdx?$/, '')
const docUrl = (f) => { const n = strip(f); const p = path.posix.basename(n) === 'index' ? path.posix.dirname(n) : n; return '/docs' + (p === '.' ? '' : '/' + p) }
const blogUrl = (f) => { const m = /^(\d{4})-(\d{2})-(\d{2})-(.+?)\.mdx?$/.exec(path.basename(f)); return m ? `/blog/${m[1]}/${m[2]}/${m[3]}/${m[4]}` : undefined }

function hashesOf(file) {
  const s = new GithubSlugger(), out = []; let fence = false
  for (const l of fs.readFileSync(file, 'utf8').split('\n')) {
    if (/^\s*(```|~~~)/.test(l)) fence = !fence
    if (fence) continue
    const m = /^#{1,6}\s+(.+?)\s*$/.exec(l); if (m) { const cid = /\{#([\w-]+)\}\s*$/.exec(m[1]); out.push(cid ? cid[1] : s.slug(m[1].replace(/[`*_]/g, ''))) }
    for (const a of l.matchAll(/<a id="([\w-]+)"/g)) out.push(a[1])
  }
  return out
}
const urls = new Map()
for (const f of fg.sync('**/*.{md,mdx}', { cwd: docsRoot })) urls.set(docUrl(f), { hashes: hashesOf(path.join(docsRoot, f)) })
for (const f of fg.sync('*.{md,mdx}', { cwd: blogRoot })) urls.set(blogUrl(f), { hashes: hashesOf(path.join(blogRoot, f)) })
urls.set('/blog', {})
// routes that exist on the site but are not content files
const extra = (process.env.EXTRA_ROUTES ?? '/,/getting-started,/api,/addons,/developers,/openapis,/fabric,/features,/benchmarks').split(',')
for (const r of extra) urls.set(r, { hashes: undefined })
const addons = JSON.parse(fs.readFileSync(path.resolve(here, '../src/data/addons.json'), 'utf8')).addons
for (const a of addons) urls.set('/addons/' + a.slug, {})

const files = [], unparsable = []
const targets = [
  ...fg.sync('**/*.{md,mdx}', { cwd: docsRoot, absolute: true }).map((f) => [f, (p) => docUrl(path.relative(docsRoot, p))]),
  ...fg.sync('*.{md,mdx}', { cwd: blogRoot, absolute: true }).map((f) => [f, (p) => blogUrl(p)]),
]
for (const [f, pathToUrl] of targets) { try { files.push(await readFileFromPath(f, pathToUrl)) } catch (e) { unparsable.push(path.relative(base, f)) } }
const opts = { scanned: { urls, fallbackUrls: [] }, checkRelativePaths: process.env.REL ?? 'as-url', ignoreFragment: false }
const res = []
for (const f of files) { try { res.push(...(await validateFiles([f], opts))) } catch { unparsable.push(path.relative(base, f.path ?? f.url ?? '?')) } }
const groups = {}
let total = 0
for (const r of res) for (const e of r.errors) {
  total++
  const u = e.url
  const cause =
    e.reason === 'invalid-fragment' ? 'missing #anchor on an existing page' :
    u.length > 1 && /\/(#|$)/.test(u) && urls.has(u.replace(/\/(#.*)?$/, '')) ? 'trailing-slash URL (tool does not normalize)' :
    /\.mdx?(#|$)/.test(u) ? 'relative .md link (not resolved by tool)' :
    /^\/blog\/[^/]+$/.test(u) ? 'blog link without date (real: dead on Docusaurus too)' :
    /^(\.|[^/])/.test(u) ? 'relative extensionless link (trailing-slash ambiguity)' :
    /^\/(api|getting-started)(#|$)/.test(u) ? 'route outside docs (not a content file)' :
    'not-found (real dead link?)'
  ;(groups[cause] ??= []).push(`${path.relative(base, r.file)}:${e.line}:${e.column}  ${u}`)
}
console.log(`mode=${MODE} files=${files.length} urls=${urls.size} errors=${total} in ${res.filter((r) => r.errors.length).length} files`)
if (unparsable.length) console.log(`unparsable by the tool's MDX parser: ${unparsable.length} (${unparsable.slice(0, 3).join(', ')}...)`)
for (const [k, v] of Object.entries(groups).sort((a, b) => b[1].length - a[1].length)) { console.log(`\n${String(v.length).padStart(5)}  ${k}`); for (const x of v.slice(0, Number(process.env.SHOW ?? 3))) console.log('         ' + x) }
