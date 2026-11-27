import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
export function getRouter() { return createRouter({ routeTree,
    // The explorer at /api scrolls its own panes; restoring them would carry one export's scroll onto the next.
    scrollRestoration: ({ location }) => location.pathname !== '/api', defaultPreload: 'intent', trailingSlash: 'never',
    // GitHub Pages serves directories as /x/ (it 301s /x to /x/), but the prerender saw /x. Match on the slashless path so the first client render equals the server render (active links, etc.).
    rewrite: { input: ({ url }) => { if (url.pathname.length > 1 && url.pathname.endsWith('/')) url.pathname = url.pathname.replace(/\/+$/, ''); return url } } }) }
