import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'node-html-parser'

function* htmlFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) yield* htmlFiles(p)
    else if (e.name.endsWith('.html')) yield p
  }
}
const normalize = (u) => (u.length > 1 ? u.replace(/\/+$/, '') : u) || '/'
const urlOfFile = (root, f) => normalize('/' + path.relative(root, f).split(path.sep).join('/').replace(/(^|\/)index\.html$/, '').replace(/\.html$/, ''))

/**
 * Crawl prerendered HTML in `outDir`. Every internal <a href> must resolve to a rendered page or an emitted file,
 * and every #fragment must match an id/name in the target page. The page a bad link sits on is named by the URL and,
 * when the page carries `<meta name="source-file" content="...">`, by its source file.
 */
export function crawl({ outDir, isIgnored, isKnown }) {
  const idx = new Map()
  for (const f of htmlFiles(outDir)) {
    const root = parse(fs.readFileSync(f, 'utf8'))
    const ids = new Set()
    root.querySelectorAll('[id],[name]').forEach((n) => ids.add(n.getAttribute('id') ?? n.getAttribute('name')))
    idx.set(urlOfFile(outDir, f), { root, ids, source: root.querySelector('meta[name="source-file"]')?.getAttribute('content') })
  }
  const errors = [], warnings = []
  let links = 0
  for (const [url, page] of idx) {
    const where = page.source ? `${page.source} (${url})` : url
    for (const a of page.root.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href')
      if (!href || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) continue
      if (isIgnored?.(href)) continue
      links++
      const [target, hash = ''] = href.split('#')
      const resolved = target.split('?')[0] === '' ? url : normalize(new URL(target, 'http://x' + url).pathname)
      const dest = idx.get(resolved)
      if (!dest) {
        const asset = path.join(outDir, resolved)
        if (fs.existsSync(asset) && fs.statSync(asset).isFile()) continue
        if (isKnown?.(resolved)) { warnings.push(`${where} -> ${href}`); continue }
        errors.push(`${where} -> ${href}  (no page at ${resolved})`)
      } else if (hash && !dest.ids.has(decodeURIComponent(hash))) {
        errors.push(`${where} -> ${href}  (no id="${hash}" in ${resolved})`)
      }
    }
  }
  return { pages: idx.size, links, errors, warnings }
}
