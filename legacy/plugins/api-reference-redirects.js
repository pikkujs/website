/**
 * Keeps the 28 URLs the old generated API Reference published alive, pointing
 * at the place that surface now lives: the SDK explorer at /api.
 *
 * docs/api-reference/ was ~28 markdown pages rendered from the same
 * surface.json the explorer reads. The pages are gone; the links people saved
 * and the pages search engines indexed are not, so each one gets a redirect
 * to the matching door — /docs/api-reference/wire/http → /api#app/http.
 *
 * This is plugin-client-redirects' job, but that is a dependency, and this
 * site carries two lockfiles that have to agree for CI to stay green. Emitting
 * the same redirect HTML from postBuild costs nothing and drifts less: the
 * door list is read from the vendored surface, so a door that is renamed
 * upstream stops being emitted rather than pointing at a dead fragment.
 */
const path = require('node:path')
const fs = require('node:fs')

const OLD_BASE = '/docs/api-reference'

/** The step slugs the old pages used, keyed by the step names in surface.json. */
const SLUGS = {
  'create a function': 'create',
  'enhance it': 'enhance',
  'wire it up': 'wire',
  'guard it': 'guard',
  'orchestrate it': 'orchestrate',
  'test it': 'test',
}

/** What plugin-client-redirects writes, minus its own framework noise. */
const page = (to) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting to ${to}</title>
<link rel="canonical" href="${to}">
<meta http-equiv="refresh" content="0; url=${to}">
<meta name="robots" content="noindex">
<script>window.location.replace("${to}" + window.location.search);</script>
</head>
<body><p>Redirecting to <a href="${to}">${to}</a>…</p></body>
</html>
`

module.exports = function apiReferenceRedirectsPlugin(context) {
  return {
    name: 'api-reference-redirects',

    async postBuild({ outDir, baseUrl }) {
      const surfacePath = path.resolve(context.siteDir, 'src/data/surface.json')
      if (!fs.existsSync(surfacePath)) return

      const surface = JSON.parse(fs.readFileSync(surfacePath, 'utf8'))
      const app = surface.entryPoints.find((entry) => entry.id === 'app')
      if (!app) return

      const base = baseUrl.replace(/\/$/, '')
      const redirects = new Map([
        [OLD_BASE, `${base}/api`],
        [`${OLD_BASE}/addons`, `${base}/api#addon`],
      ])
      for (const slug of new Set(Object.values(SLUGS))) {
        // A step index listed its doors; the explorer's navigator is that list.
        redirects.set(`${OLD_BASE}/${slug}`, `${base}/api`)
      }
      for (const leaf of app.leaves) {
        const slug = SLUGS[leaf.step]
        if (!slug) continue
        redirects.set(`${OLD_BASE}/${slug}/${leaf.name}`, `${base}/api#app/${leaf.name}`)
      }

      for (const [from, to] of redirects) {
        const dir = path.join(outDir, from.replace(/^\//, ''))
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(path.join(dir, 'index.html'), page(to))
      }

      console.log(`[api-reference-redirects] wrote ${redirects.size} redirects to /api`)
    },
  }
}
