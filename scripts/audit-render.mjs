#!/usr/bin/env node
// Crawl dist/client HTML and fail on stub markers or render errors.
// Usage: node scripts/audit-render.mjs [dir]
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.argv[2] ?? 'dist/client')
if (!fs.existsSync(root)) { console.error(`audit-render: ${root} does not exist, build first`); process.exit(2) }

/** [name, test(html, text)] — each failing page is reported with the marker that tripped. */
const CHECKS = [
  ['Unknown component', (h) => /Unknown component|Expected component `[^`]+` to be defined/.test(h)],
  ['React error marker', (h) => /Minified React error|<!--\$!-->|data-dgst=|Application error|Something went wrong|Hydration failed/.test(h)],
  ['stub marker', (h) => /\[asciinema player\]|\bTODO-STUB\b|data-stub|placeholder component|Not implemented/.test(h)],
  ['unrendered MDX/directive', (_h, t) => /^\s*:::(note|tip|info|warning|danger|caution)\b/m.test(t) || /<(Card|Tabs|TabItem|Stackblitz|DocHeaderHero|Admonition)\b/.test(t) || /\{frontMatter\./.test(t)],
  ['unrendered snippet marker', (_h, t) => /@snippet\s+\w+/.test(t) && !/```/.test(t) && /^\s*```\w*\s+@snippet/m.test(t)],
  ['route error page', (h) => /<title>\s*(500|Error|Not Found|Internal Server Error)\b/i.test(h)],
]

const files = []
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : e.name.endsWith('.html') && files.push(p) } }
walk(root)

const text = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, '\n').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const failures = []
const byKind = {}
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8')
  const t = text(h)
  const rel = '/' + path.relative(root, f).replace(/index\.html$/, '').replace(/\.html$/, '')
  // a doc/blog/page with an empty <main> means the content did not render
  const main = /<main[\s\S]*?<\/main>/.exec(h)
  if (/^\/(docs|blog)\/./.test(rel) && main && text(main[0]).trim().length < 80) failures.push([rel, 'empty main content'])
  for (const [name, test] of CHECKS) if (test(h, t)) failures.push([rel, name])
  const m = /<h1[\s>]/.test(h)
  byKind[/^\/docs/.test(rel) ? 'docs' : /^\/blog/.test(rel) ? 'blog' : 'other'] = (byKind[/^\/docs/.test(rel) ? 'docs' : /^\/blog/.test(rel) ? 'blog' : 'other'] ?? 0) + 1
  if (!m && !/^\/(payload|_)/.test(rel) && rel !== '/404' && !/redirect/i.test(h)) failures.push([rel, 'no <h1>'])
}
console.log(`audit-render: ${files.length} HTML files (${Object.entries(byKind).map(([k, v]) => `${k} ${v}`).join(', ')})`)
if (failures.length) {
  const grouped = {}
  for (const [p, k] of failures) (grouped[k] ??= []).push(p)
  for (const [k, ps] of Object.entries(grouped)) console.error(`  FAIL ${k}: ${ps.length}\n    ${ps.slice(0, 12).join('\n    ')}${ps.length > 12 ? `\n    ... +${ps.length - 12}` : ''}`)
  process.exit(1)
}
console.log('audit-render: OK')
