import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fumadocsMdx } from 'fumadocs-mdx/vite'
import path from 'node:path'
import fs from 'node:fs'
import type { Plugin } from 'vite'
import linkCrawl from './packages/vite-link-check/src/index.js'
import feeds from './plugins/feeds.mjs'
import { isIgnored, isKnown } from './link-gate.config.mjs'

const alias: Record<string, string> = { '@': path.resolve(import.meta.dirname, 'src') }

/** Every docs/blog page's payload URL, so the prerender writes /payload/**.json next to the HTML. */
const contentPages = () => {
  const out: { path: string }[] = [{ path: '/payload/docs-tree.json' }, { path: '/payload/blog-index.json' }]
  const walk = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : /\.mdx?$/.test(e.name) ? [path.join(dir, e.name)] : [])
  const docsDir = path.resolve(import.meta.dirname, 'content/docs'), blogDir = path.resolve(import.meta.dirname, 'content/blog')
  if (fs.existsSync(docsDir)) for (const f of walk(docsDir)) {
    const slugs = path.relative(docsDir, f).replace(/\.mdx?$/, '').split(path.sep).filter((s, i, a) => !(i === a.length - 1 && s === 'index'))
    out.push({ path: `/payload/docs/${slugs.length ? slugs.join('/') : 'index'}.json` })
  }
  if (fs.existsSync(blogDir)) for (const f of walk(blogDir)) {
    const m = /^(\d{4})-(\d{2})-(\d{2})-(.+?)\.mdx?$/.exec(path.basename(f))
    if (m) out.push({ path: `/payload/blog/${m[1]}/${m[2]}/${m[3]}/${m[4]}.json` })
  }
  return out
}

/** These are only imported inside client effects; keep their chunks (mermaid alone is ~6 MB) out of the SSR bundle. */
const CLIENT_ONLY = ['mermaid', 'react-apexcharts', 'apexcharts', 'asciinema-player', '@stackblitz/sdk']
const clientOnly = (): Plugin => ({
  name: 'client-only-libs',
  enforce: 'pre',
  applyToEnvironment: (env) => env.config.consumer === 'server',
  resolveId(id) { if (CLIENT_ONLY.includes(id) || id === 'asciinema-player/dist/bundle/asciinema-player.css') return '\0client-only-empty' },
  load(id) { if (id === '\0client-only-empty') return 'export default {}' },
})

export default defineConfig({
  server: {
    port: 3005, strictPort: true,
  },
  resolve: { alias },
  // bundle every dependency into dist/server so the production image needs no node_modules
  ssr: { noExternal: true },
  plugins: [
    clientOnly(),
    fumadocsMdx((await import('./source.config.ts')) as any),
    tailwindcss(),
    tanstackStart({ pages: [{ path: '/search-index.json' }, ...contentPages()], prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: true, concurrency: 8,
      failOnError: false, // vite-link-check is the gate: it names the source file, crawlLinks does not
      // the catalogue (/addons, /openapis) is rendered by the Node server on request, everything else is prerendered
      filter: ({ path }) => !/^\/(addons|openapis)(\/|$)/.test(path) } }),
    viteReact(),
    // order matters: both must run AFTER the prerender post-build
    feeds({ site: 'https://pikku.dev', title: 'Pikku Blog' }),
    linkCrawl({ isIgnored, isKnown }),
  ],
})
