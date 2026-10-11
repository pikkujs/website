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

const sh = (n: string) => path.resolve(import.meta.dirname, 'src/components/shims', n + '.tsx')
const alias: Record<string, string> = { '@': path.resolve(import.meta.dirname, 'src') }
for (const n of ['Stackblitz', 'WiringIcons', 'Card', 'CloudCostAtlas', 'CloudCostComparison']) alias['@site/src/components/' + n] = sh(n)
alias['@site/src/components/BundleArchitecturesSection'] = path.resolve(import.meta.dirname, 'src/stubs/Bundle.tsx')
alias['@docusaurus/Link'] = sh('Link')
alias['@theme/Tabs'] = sh('Tabs')
alias['@theme/TabItem'] = sh('TabItem')

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

/** mermaid is only imported inside a client effect; keep its ~6 MB of chunks out of the SSR/Worker bundle. */
const mermaidClientOnly = (): Plugin => ({
  name: 'mermaid-client-only',
  enforce: 'pre',
  applyToEnvironment: (env) => env.config.consumer === 'server',
  resolveId(id) { if (id === 'mermaid') return '\0mermaid-empty' },
  load(id) { if (id === '\0mermaid-empty') return 'export default {}' },
})

export default defineConfig({
  server: {
    port: 3007, strictPort: true,
  },
  resolve: { alias },
  plugins: [
    mermaidClientOnly(),
    fumadocsMdx(await import('./source.config.ts')),
    tailwindcss(),
    tanstackStart({ pages: [{ path: '/search-index.json' }, ...contentPages()], prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: true, concurrency: 8,
      failOnError: false, // vite-link-check is the gate: it names the source file, crawlLinks does not
      // only render what this app owns; links to not-yet-ported site pages are judged by vite-link-check (isKnown)
      filter: ({ path }) => /^\/($|docs|blog)(\/|$|\?|#)/.test(path) || path === '/search-index.json' || path.startsWith('/payload/') } }),
    viteReact(),
    // order matters: both must run AFTER the prerender post-build
    feeds({ site: 'https://pikku.dev', title: 'Pikku Blog' }),
    linkCrawl({ isIgnored: [/^\/img\//, /^\/assets\//, /^\/addons\/[\w-]+\.svg$/], failOnError: false, // 5 pre-existing dead blog links are reported as warnings; `npm run check-links` is the strict gate
      isKnown: (u) => /^\/(openapis|addons|api|getting-started|developers|fabric|features|benchmarks)(\/|$)/.test(u) }),
  ],
})
