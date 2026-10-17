// The ONE place that says which internal links the prerender link gate may not find in dist/client.
// `npm run build` (vite-link-check plugin) and `npm run check-links` both read this.
//
// - ssrRoutes: routes with no prerendered HTML: addon and OpenAPI detail pages, rendered live by the Worker from the registry.
// - pendingPages: pages not yet ported (none; every internal link must resolve or the build fails).
export const ssrRoutes = ['/addons/[^/]+', '/openapis/[^/]+']
export const pendingPages = []

const startsWith = (list) => new RegExp(`^(${list.map((r) => r.replace(/\//g, '\\/')).join('|')})(\\/|$)`)
export const isKnown = (url) => [...ssrRoutes, ...pendingPages].length > 0 && startsWith([...ssrRoutes, ...pendingPages]).test(url)
// /api#app/* deep links target ids the SDK explorer creates on the client (it is browser-only), so the
// prerendered HTML cannot contain them.
export const isIgnored = [/^\/api#/, /^\/img\//, /^\/assets\//, /^\/addons\/[\w-]+\.svg$/]
