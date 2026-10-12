// Static server that mimics GitHub Pages over dist/client, for `npm run preview` and scripts/smoke.mjs:
//   exact file -> served; directory without trailing slash -> 301 to the slash; directory -> its index.html;
//   anything else -> 404.html with HTTP 404. No redirects, no rewrites, no SSR.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const TYPES = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2', '.woff': 'font/woff', '.cast': 'text/plain' }

export function startPagesServer({ dir = 'dist/client', port = 3000 } = {}) {
  const root = path.resolve(dir)
  const stat = (p) => { try { return fs.statSync(p) } catch { return null } }
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    let rel; try { rel = decodeURIComponent(url.pathname) } catch { rel = '/\0' }
    const abs = path.normalize(path.join(root, rel))
    const inside = !rel.includes('\0') && (abs === root || abs.startsWith(root + path.sep))
    const st = inside ? stat(abs) : null
    const send = (status, file) => {
      res.writeHead(status, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' })
      req.method === 'HEAD' ? res.end() : fs.createReadStream(file).pipe(res)
    }
    if (st?.isFile()) return send(200, abs)
    if (st?.isDirectory()) {
      if (!rel.endsWith('/')) { res.writeHead(301, { location: rel + '/' + url.search }); return res.end() }
      const index = path.join(abs, 'index.html')
      if (stat(index)?.isFile()) return send(200, index)
    }
    send(404, path.join(root, '404.html'))
  })
  return new Promise((resolve) => server.listen(port, () => resolve(server)))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000)
  await startPagesServer({ port })
  console.log(`GitHub Pages emulation of dist/client on http://localhost:${port}`)
}
