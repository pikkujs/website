import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
export function getRouter() { return createRouter({ routeTree, scrollRestoration: true, defaultPreload: 'intent', trailingSlash: 'never',
    // GitHub Pages serves directories as /x/ (it 301s /x to /x/), but the prerender saw /x. Match on the slashless path so the first client render equals the server render (active links, etc.).
    rewrite: { input: ({ url }) => { if (url.pathname.length > 1 && url.pathname.endsWith('/')) url.pathname = url.pathname.replace(/\/+$/, ''); return url } } }) }
