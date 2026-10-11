// The ONE place that says which internal links the prerender link gate may not find in dist/client.
// `npm run build` (vite-link-check plugin) and `npm run check-links` both read this.
//
// - ssrRoutes: real routes that are rendered by the Worker on request, so they have no prerendered HTML.
// - pendingPages: pages still to be ported from legacy/pages (stage C). Remove entries as they land;
//   when the list is empty every internal link must resolve or the build fails.
export const ssrRoutes = ['/addons', '/openapis']
export const pendingPages = ['/api', '/getting-started', '/developers', '/fabric', '/features', '/benchmarks']

const startsWith = (list) => new RegExp(`^(${list.map((r) => r.replace(/\//g, '\\/')).join('|')})(\\/|$)`)
export const isKnown = (url) => startsWith([...ssrRoutes, ...pendingPages]).test(url)
export const isIgnored = [/^\/img\//, /^\/assets\//, /^\/addons\/[\w-]+\.svg$/]
