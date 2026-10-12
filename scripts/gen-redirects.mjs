// Regenerates the legacy redirects: every old URL that moved, as a static redirect page under public/. Run: node scripts/gen-redirects.mjs
import fs from 'node:fs'
import path from 'node:path'
const SLUGS = { 'create a function': 'create', 'enhance it': 'enhance', 'wire it up': 'wire', 'guard it': 'guard', 'orchestrate it': 'orchestrate', 'test it': 'test' }
const OLD = '/docs/api-reference'
const STYLE = `html{background:#f4ecdd;color:#3d3125}body{margin:0;min-height:100vh;display:grid;place-items:center;font:16px/1.5 'Work Sans',system-ui,sans-serif;background:radial-gradient(ellipse at 20% 0%,#fbf6ec,#f4ecdd 60%)}main{text-align:center;padding:24px}h1{font:600 clamp(1.6rem,4vw,2.2rem) Fraunces,Georgia,serif;color:#2b2219;margin:0 0 .4em}a{color:#b0380a}code{font:.9em 'Geist Mono',ui-monospace,monospace;background:#ebdfc8;border:1px solid #dccfb4;border-radius:5px;padding:.08em .35em}html[data-theme=dark]{background:#15110d;color:#d9ccb5}html[data-theme=dark] body{background:radial-gradient(ellipse at 20% 0%,#1d1812,#15110d 60%)}html[data-theme=dark] h1{color:#f1e8d6}html[data-theme=dark] a{color:#e0a06a}html[data-theme=dark] code{background:#0f0c09;border-color:#3a3226}`
const THEME = `try{document.documentElement.dataset.theme=localStorage.getItem('theme')==='dark'?'dark':'light'}catch(e){}`
// One static page per rule: GitHub Pages has no server redirects. Canonical + meta refresh + JS fallback (keeps ?query and, for in-site targets without their own #fragment, the #hash).
const page = (to) => {
  const external = /^https?:\/\//.test(to)
  const abs = external ? to : 'https://pikku.dev' + to.split('#')[0]
  return `<!doctype html>\n<html lang="en" data-theme="light">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Redirecting to ${to}</title>\n<link rel="canonical" href="${abs}">\n<meta http-equiv="refresh" content="0; url=${to}">\n<meta name="robots" content="noindex">\n<meta name="theme-color" content="#f4ecdd">\n<style>${STYLE}</style>\n<script>${THEME};window.location.replace("${to}"${external ? '' : ' + window.location.search'});</script>\n</head>\n<body><main><h1>Moved</h1><p>This page is now at <a href="${to}"><code>${to}</code></a>. Redirecting…</p></main></body>\n</html>\n`
}
const surface = JSON.parse(fs.readFileSync('src/data/surface.json', 'utf8'))
const app = surface.entryPoints.find((e) => e.id === 'app')
const r = new Map([[OLD, '/api'], [`${OLD}/addons`, '/api#addon'], ['/fabric', 'https://pikkufabric.com'], ['/wires/bot', '/wires/agent']])
for (const s of new Set(Object.values(SLUGS))) r.set(`${OLD}/${s}`, '/api')
for (const leaf of app.leaves) { const s = SLUGS[leaf.step]; if (s) r.set(`${OLD}/${s}/${leaf.name}`, `/api#app/${leaf.name}`) }
for (const [from, to] of r) { const d = path.join('public', from); fs.mkdirSync(d, { recursive: true }); fs.writeFileSync(path.join(d, 'index.html'), page(to)) }
console.log(`wrote ${r.size} redirect pages`)
