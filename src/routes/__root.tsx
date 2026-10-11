/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Outlet, Scripts, Link } from '@tanstack/react-router'
import { TanstackProvider } from 'fumadocs-core/framework/tanstack'   // headless provider (no fumadocs-ui)
import '../styles.css'
import { SearchBox } from '@/components/SearchBox'
export const Route = createRootRoute({
  head: () => ({ meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { title: 'Pikku' }] }),
  component: () => (
    <html suppressHydrationWarning><head><HeadContent /></head>
      <body><header className="sticky top-0 z-40 flex h-14 items-center gap-6 border-b border-border bg-background px-4"><Link to="/" className="text-lg font-bold">pikku</Link><Link to="/docs/$" params={{ _splat: '' }} className="text-sm">Docs</Link><Link to="/blog" className="text-sm">Blog</Link><Link to="/addons" className="text-sm">Addons</Link><Link to="/openapis" className="text-sm">OpenAPIs</Link><span className="ml-auto"><SearchBox mode={(import.meta.env.VITE_SEARCH as any) ?? 'static'} /></span></header>
        <TanstackProvider><Outlet /></TanstackProvider><Scripts /></body></html>
  ),
})
