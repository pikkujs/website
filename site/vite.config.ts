import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fumadocsMdx } from 'fumadocs-mdx/vite'
import path from 'node:path'
import linkCrawl from './packages/vite-link-check/src/index.js'
import feeds from './plugins/feeds.mjs'

const sh = (n: string) => path.resolve(import.meta.dirname, 'src/components/shims', n + '.tsx')
const alias: Record<string, string> = { '@': path.resolve(import.meta.dirname, 'src') }
for (const n of ['Stackblitz', 'WiringIcons', 'Card', 'CloudCostAtlas', 'CloudCostComparison']) alias['@site/src/components/' + n] = sh(n)
alias['@site/src/components/BundleArchitecturesSection'] = path.resolve(import.meta.dirname, 'src/stubs/Bundle.tsx')
alias['@docusaurus/Link'] = sh('Link')
alias['@theme/Tabs'] = sh('Tabs')
alias['@theme/TabItem'] = sh('TabItem')

export default defineConfig({
  server: {
    port: 3007, strictPort: true,
  },
  resolve: { alias },
  plugins: [
    fumadocsMdx(await import('./source.config.ts')),
    tailwindcss(),
    tanstackStart({ pages: [{ path: '/search-index.json' }], prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: true, concurrency: 8,
      failOnError: false, // vite-link-check is the gate: it names the source file, crawlLinks does not
      // only render what this app owns; links to not-yet-ported site pages are judged by vite-link-check (isKnown)
      filter: ({ path }) => /^\/($|docs|blog)(\/|$|\?|#)/.test(path) || path === '/search-index.json' } }),
    viteReact(),
    // order matters: both must run AFTER the prerender post-build
    feeds({ site: 'https://pikku.dev', title: 'Pikku Blog' }),
    linkCrawl({ isIgnored: [/^\/img\//, /^\/assets\//, /^\/addons\/[\w-]+\.svg$/], failOnError: false, // 5 pre-existing dead blog links are reported as warnings; `npm run check-links` is the strict gate
      isKnown: (u) => /^\/(openapis|addons|api|getting-started|developers|fabric|features|benchmarks)(\/|$)/.test(u) }),
  ],
})
