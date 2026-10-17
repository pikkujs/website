import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// The Worker app: same shell and detail components as the static site, only the routes that cannot be prerendered.
export function getRouter() {
  return createRouter({ routeTree, scrollRestoration: true, defaultPreload: 'intent', trailingSlash: 'never',
    rewrite: { input: ({ url }) => { if (url.pathname.length > 1 && url.pathname.endsWith('/')) url.pathname = url.pathname.replace(/\/+$/, ''); return url } } })
}
