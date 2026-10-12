// The ONE place that says which internal links the prerender link gate may not find in dist/client.
// `npm run build` (vite-link-check plugin) and `npm run check-links` both read this.
//
// - ssrRoutes: real routes that are rendered by the Node server on request, so they have no prerendered HTML.
// - pendingPages: pages not yet ported (none; every internal link must resolve or the build fails).
export const ssrRoutes = ['/addons', '/openapis']
export const pendingPages = []

const startsWith = (list) => new RegExp(`^(${list.map((r) => r.replace(/\//g, '\\/')).join('|')})(\\/|$)`)
export const isKnown = (url) => startsWith([...ssrRoutes, ...pendingPages]).test(url)
// /api#app/* deep links target ids the SDK explorer creates on the client (it is browser-only), so the
// prerendered HTML cannot contain them.
export const isIgnored = [/^\/api#/, /^\/img\//, /^\/assets\//, /^\/addons\/[\w-]+\.svg$/]
