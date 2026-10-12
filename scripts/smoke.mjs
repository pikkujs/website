// Smoke test of dist/client under GitHub Pages semantics: node scripts/smoke.mjs [port]
import fs from 'node:fs'
import { startPagesServer } from './pages-server.mjs'

const port = Number(process.argv[2] || 3009)
const server = await startPagesServer({ port })
const base = `http://localhost:${port}`
const get = (p) => fetch(base + p, { redirect: 'manual' })
let fail = 0
const check = async (name, p, status, test) => {
  const r = await get(p); const body = r.status === 200 || r.status === 404 ? await r.text() : ''
  const ok = r.status === status && (!test || test(body, r))
  if (!ok) fail++
  console.log(ok ? 'ok  ' : 'FAIL', String(r.status), p, '-', name)
}
const has = (s) => (b) => b.includes(s)
const redirectPage = (to) => (b) => b.includes(`http-equiv="refresh" content="0; url=${to}"`) && b.includes(`rel="canonical"`) && b.includes('window.location.replace')

await check('home', '/', 200, has('<h1'))
await check('marketing', '/developers/', 200)
await check('docs page', '/docs/wiring/queue/', 200)
await check('blog post', '/blog/2026/07/11/pikku-0.13/', 200)
await check('addon index', '/addons/', 200)
await check('addon detail', '/addons/airtable/', 200, has('Airtable'))
await check('openapi index', '/openapis/', 200)
await check('openapi detail', '/openapis/1forge-com/', 200, has('1Forge'))
await check('docs payload json', '/payload/docs/wiring/queue.json', 200)
await check('catalogue data json', '/__data/openapis/1forge-com.json', 200)
await check('browse data json', '/__data/openapis-browse.json', 200)
await check('search index', '/search-index.json', 200)
await check('sitemap', '/sitemap.xml', 200, (b) => !b.includes('<loc>https://pikku.dev/fabric</loc>') && !b.includes('/404<') && b.includes('<loc>https://pikku.dev/openapis/1forge-com</loc>'))
await check('robots', '/robots.txt', 200)
await check('CNAME', '/CNAME', 200, (b) => b.trim() === fs.readFileSync('dist/client/CNAME', 'utf8').trim())
await check('.nojekyll', '/.nojekyll', 200)
await check('no-slash dir redirects', '/docs/wiring/queue', 301)
await check('redirect page /fabric', '/fabric/', 200, redirectPage('https://pikkufabric.com'))
await check('redirect page /wires/bot', '/wires/bot/', 200, redirectPage('/wires/agent'))
await check('redirect page api-reference', '/docs/api-reference/create/function/', 200, redirectPage('/api#app/function'))
await check('unknown path -> 404.html', '/no-such-page/', 404, has('lost in the wiring'))
await check('unknown docs page -> 404', '/docs/no-such/', 404, has('Page not found'))
await check('unknown openapi slug -> 404', '/openapis/not-a-spec/', 404, has('Page not found'))
await check('unknown addon slug -> 404', '/addons/not-an-addon/', 404, has('Page not found'))
await check('404.html is not served as a page', '/404/', 404)
server.close()
console.log(fail ? `${fail} failed` : 'all passed')
process.exit(fail ? 1 : 0)
