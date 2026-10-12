// Production origin for pikku.dev. Cloudflare sits in front and caches; this process
//   1. serves the prerendered site (dist/client) with the cache headers below,
//   2. honours the old-URL redirects in dist/client/_redirects as 301s,
//   3. hands everything else (/addons, /openapis, 404s) to the TanStack Start SSR handler,
//   4. answers /healthz for the container healthcheck.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const clientDir = path.join(root, 'dist/client')
const port = Number(process.env.PORT || 3000)
const host = process.env.HOST || '0.0.0.0'

// Cache policy. Cloudflare is purged on every deploy, so HTML and payloads may live at the edge "forever";
// browsers always revalidate (ETag), so a purge reaches users too.
const CC = {
  immutable: 'public, max-age=31536000, immutable',
  edge: 'public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400, stale-if-error=86400',
  file: 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400, stale-if-error=86400',
  notFound: 'public, max-age=0, s-maxage=60',
  noStore: 'no-store',
}
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.json': 'application/json; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.map': 'application/json', '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf',
  '.cast': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.webmanifest': 'application/manifest+json',
}

// _redirects: "<from> <to> [status]". Exact paths only (what this site uses); trailing slash is ignored.
const redirects = new Map()
try {
  for (const line of fs.readFileSync(path.join(clientDir, '_redirects'), 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const [from, to, status] = t.split(/\s+/)
    if (from && to) redirects.set(from.replace(/\/+$/, '') || '/', { to, status: Number(status) || 302 })
  }
} catch { /* no redirects file */ }

const ssr = (await import(pathToFileURL(path.join(root, 'dist/server/server.js')).href)).default

const isFile = (p) => { try { return fs.statSync(p).isFile() } catch { return false } }

/** Map a URL pathname to a prerendered file, or null. Clean URLs: /x -> /x/index.html or /x.html. */
function resolveFile(pathname) {
  let rel
  try { rel = decodeURIComponent(pathname) } catch { return null }
  if (rel.includes('\0')) return null
  const abs = path.normalize(path.join(clientDir, rel))
  if (abs !== clientDir && !abs.startsWith(clientDir + path.sep)) return null
  const candidates = rel.endsWith('/') ? [path.join(abs, 'index.html')] : [abs, path.join(abs, 'index.html'), abs + '.html']
  for (const c of candidates) if (isFile(c) && path.basename(c) !== '_redirects') return c
  return null
}

function cacheControlFor(pathname, file) {
  if (pathname.startsWith('/assets/')) return CC.immutable
  const ext = path.extname(file)
  if (ext === '.html' || ext === '.json' || ext === '.xml' || ext === '.txt' || ext === '.md') return CC.edge
  return CC.file
}

function send(res, status, headers, body) {
  res.writeHead(status, headers)
  res.end(body)
}

async function serveFile(req, res, file, pathname) {
  const st = fs.statSync(file)
  const etag = `W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`
  const headers = {
    'content-type': TYPES[path.extname(file)] || 'application/octet-stream',
    'cache-control': cacheControlFor(pathname, file),
    etag, 'last-modified': st.mtime.toUTCString(), 'x-content-type-options': 'nosniff',
  }
  if (req.headers['if-none-match'] === etag) return send(res, 304, headers)
  headers['content-length'] = st.size
  res.writeHead(200, headers)
  if (req.method === 'HEAD') return res.end()
  await pipeline(fs.createReadStream(file), res)
}

async function serveSsr(req, res, url) {
  const proto = req.headers['x-forwarded-proto'] || 'http'
  const hostHeader = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${port}`
  const headers = new Headers()
  for (const [k, v] of Object.entries(req.headers)) if (v !== undefined) headers.set(k, Array.isArray(v) ? v.join(', ') : v)
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
  const request = new Request(`${proto}://${hostHeader}${url.pathname}${url.search}`, { method: req.method, headers, body: hasBody ? Readable.toWeb(req) : undefined, duplex: hasBody ? 'half' : undefined })
  const response = await ssr.fetch(request)
  const out = {}
  response.headers.forEach((v, k) => { if (k !== 'set-cookie') out[k] = v })
  const cookies = response.headers.getSetCookie?.() ?? []
  if (cookies.length) out['set-cookie'] = cookies
  // 404s and errors must never sit in the CDN for long, whatever the app said
  if (response.status === 404) out['cache-control'] = CC.notFound
  else if (response.status >= 500) out['cache-control'] = CC.noStore
  else if (!out['cache-control']) out['cache-control'] = CC.notFound
  res.writeHead(response.status, out)
  if (req.method === 'HEAD' || !response.body) return res.end()
  await pipeline(Readable.fromWeb(response.body), res)
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost')
    const pathname = url.pathname
    if (pathname === '/healthz') return send(res, 200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': CC.noStore }, 'ok\n')

    if (req.method !== 'GET' && req.method !== 'HEAD') return await serveSsr(req, res, url)

    const redirect = redirects.get(pathname.replace(/\/+$/, '') || '/')
    if (redirect) return send(res, redirect.status, { location: redirect.to, 'cache-control': CC.edge }, '')

    const file = resolveFile(pathname)
    if (file) {
      // one canonical URL: /docs/x/ -> /docs/x (the router uses trailingSlash: 'never')
      if (pathname.length > 1 && pathname.endsWith('/')) return send(res, 301, { location: pathname.replace(/\/+$/, '') + url.search, 'cache-control': CC.edge }, '')
      return await serveFile(req, res, file, pathname)
    }
    await serveSsr(req, res, url)
  } catch (err) {
    console.error('[server]', req.method, req.url, err)
    if (!res.headersSent) send(res, 500, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': CC.noStore }, 'Internal Server Error\n')
    else res.destroy()
  }
})

server.listen(port, host, () => console.log(`pikku.dev origin listening on http://${host}:${port}`))
const stop = () => { server.close(() => process.exit(0)); setTimeout(() => process.exit(0), 10000).unref() }
process.on('SIGTERM', stop); process.on('SIGINT', stop)
