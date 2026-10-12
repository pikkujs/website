// Smoke test against a running origin: node scripts/smoke.mjs http://localhost:3000
const base = process.argv[2] || 'http://localhost:3000'
const EDGE = /s-maxage=31536000/
const checks = [
  ['/', 200, /text\/html/, /max-age=0.*s-maxage=31536000.*stale-while-revalidate.*stale-if-error/],
  ['/developers', 200, /text\/html/, EDGE],
  ['/docs/wiring/queue', 200, /text\/html/, EDGE],
  ['/blog/2026/07/11/pikku-0.13', 200, /text\/html/, EDGE],
  ['/payload/docs/wiring/queue.json', 200, /application\/json/, EDGE],
  ['/search-index.json', 200, /application\/json/, EDGE],
  ['/sitemap.xml', 200, /xml/, EDGE],
  ['/addons', 200, /text\/html/, /s-maxage=3600.*stale-while-revalidate.*stale-if-error/],
  ['/addons/airtable', 200, /text\/html/, /s-maxage=3600/],
  ['/openapis', 200, /text\/html/, /s-maxage=3600/],
  ['/registry-data/openapis.json', 200, /application\/json/, /s-maxage=3600/],
  ['/favicon.ico', 200, /icon/, /max-age=86400/],
  ['/fabric', 301, null, null, 'https://pikkufabric.com'],
  ['/wires/bot', 301, null, null, '/wires/agent'],
  ['/docs/wiring/queue/', 301, null, null, '/docs/wiring/queue'],
  ['/no-such-page', 404, /text\/html/, /s-maxage=60/],
  ['/docs/no-such-page', 404, /text\/html/, /s-maxage=60/],
  ['/_redirects', 404, null, /s-maxage=60/],
  ['/healthz', 200, /text\/plain/, /no-store/],
]
let fail = 0
const asset = (await (await fetch(base + '/')).text()).match(/\/assets\/[^"']+\.(?:js|css)/)?.[0]
if (asset) checks.push([asset, 200, null, /max-age=31536000, immutable/])
for (const [p, status, type, cc, loc] of checks) {
  const r = await fetch(base + p, { redirect: 'manual' })
  const got = { status: r.status, type: r.headers.get('content-type') ?? '', cc: r.headers.get('cache-control') ?? '', loc: r.headers.get('location') }
  const ok = got.status === status && (!type || type.test(got.type)) && (!cc || cc.test(got.cc)) && (!loc || got.loc === loc)
  if (!ok) fail++
  console.log(ok ? 'ok  ' : 'FAIL', p, got.status, got.cc || '-', got.loc ?? '')
}
console.log(fail ? `${fail} failed` : 'all passed')
process.exit(fail ? 1 : 0)
