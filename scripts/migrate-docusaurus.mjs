// One-off: copy ../{docs,blog} into content/, rewriting Docusaurus-isms.
// Never writes to the source. Usage: node scripts/migrate-docusaurus.mjs [srcRoot]
import fs from 'node:fs'
import path from 'node:path'

const here = path.resolve(import.meta.dirname, '..')
const src = path.resolve(process.argv[2] ?? path.join(here, '..'))
const out = path.join(here, 'content')
const counts = {}
const files = {}
const bump = (k, file, n = 1) => { counts[k] = (counts[k] ?? 0) + n; (files[k] ??= new Set()).add(file) }

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])

// Apply a line transform only outside fenced code blocks
function outsideFences(text, fn) {
  let fence = null
  return text.split('\n').map((line) => {
    const m = /^\s*(`{3,}|~{3,})/.exec(line)
    if (m) { if (!fence) fence = m[1][0]; else if (m[1][0] === fence) fence = null; return line }
    return fence ? line : fn(line)
  }).join('\n')
}

function docUrl(rel) { // rel path inside docs/ -> /docs/... url
  const n = rel.replace(/\.mdx?$/, '')
  const p = path.posix.basename(n) === 'index' ? path.posix.dirname(n) : n
  return '/docs' + (p === '.' ? '' : '/' + p)
}

function migrate(text, rel, kind) {
  let t = text
  // 1. :::warning Title  ->  :::warning[Title]
  t = outsideFences(t, (l) => l.replace(/^(:{3,})(note|tip|info|warning|danger|caution)[ \t]+(?!\[)(.+?)[ \t]*$/, (_, c, n, title) => { bump('admonition-title', rel); return `${c}${n}[${title}]` }))
  // 2. <!-- truncate -->
  t = t.replace(/<!--\s*truncate\s*-->/g, () => { bump('truncate-marker', rel); return '' })
  // 3. # Heading {#custom-id}
  t = outsideFences(t, (l) => l.replace(/^(#{1,6}\s+.+?)\s*\{#([\w-]+)\}\s*$/, (_, h, id) => { bump('custom-heading-id', rel); return `${h}\n\n<a id="${id}"></a>` }))
  if (kind === 'docs') {
    const dir = path.posix.dirname(rel)
    const isIndex = /(^|\/)index\.mdx?$/.test(rel)
    // 4. relative .md/.mdx links -> absolute page URL (fumadocs has no resolver)
    t = outsideFences(t, (l) => l.replace(/\]\((\.{1,2}\/[^)\s#]*?\.mdx?)(#[^)\s]*)?\)/g, (_, p, h = '') => {
      bump('relative-md-link', rel)
      return `](${docUrl(path.posix.join(dir, p))}${h})`
    }))
    // 5. relative extensionless links inside an index doc (Docusaurus served them with a trailing slash)
    if (isIndex) t = outsideFences(t, (l) => l.replace(/\]\((\.\/[^)\s#.]+?)(#[^)\s]*)?\)/g, (_, p, h = '') => {
      bump('index-relative-link', rel)
      return `](${'/docs' + (dir === '.' ? '' : '/' + dir) + '/' + p.slice(2)}${h})`
    }))
  }
  if (kind === 'blog') // 4b. blog -> blog relative links: ./2024-12-13-pikku-0.6.md -> /blog/2024/12/13/pikku-0.6
    t = outsideFences(t, (l) => l.replace(/\]\(\.\/(\d{4})-(\d{2})-(\d{2})-([^)\s#]+?)\.mdx?(#[^)\s]*)?\)/g, (_, y, m, d, slug, h = '') => { bump('blog-relative-md-link', rel); return `](/blog/${y}/${m}/${d}/${slug}${h})` }))
  // 6. frontmatter: title from first H1 when missing; blog date from filename
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(t)
  const add = []
  const body = fm ? t.slice(fm[0].length) : t
  if (!fm || !/^title:/m.test(fm[1])) { const h = /^#\s+(.+?)\s*$/m.exec(outsideFences(body, (l) => l)); add.push(`title: ${JSON.stringify(h?.[1] ?? path.basename(rel).replace(/\.mdx?$/, ''))}`); bump('title-from-h1', rel) }
  if (kind === 'blog') { const d = /^(\d{4}-\d{2}-\d{2})-/.exec(path.basename(rel)); if (d && !(fm && /^date:/m.test(fm[1]))) { add.push(`date: ${d[1]}`); bump('blog-date-from-filename', rel) } }
  if (add.length) t = fm ? t.replace(/^---\n/, `---\n${add.join('\n')}\n`) : `---\n${add.join('\n')}\n---\n${t}`
  return t
}

fs.rmSync(out, { recursive: true, force: true })
let n = 0
for (const kind of ['docs', 'blog']) {
  const base = path.join(src, kind)
  for (const f of walk(base)) {
    const rel = path.relative(base, f).split(path.sep).join('/')
    if (rel.startsWith('.claude')) continue
    const dest = path.join(out, kind, rel)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    if (/\.mdx?$/.test(f)) { fs.writeFileSync(dest, migrate(fs.readFileSync(f, 'utf8'), rel, kind)); n++ }
    else fs.copyFileSync(f, dest)
  }
}
console.log(`migrated ${n} md/mdx files -> ${path.relative(process.cwd(), out)}`)
for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(26)} ${String(v).padStart(4)} edits in ${files[k].size} files`)
