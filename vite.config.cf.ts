import fs from 'node:fs'
import path from 'node:path'
import { mergeConfig, type Plugin } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import base from './vite.config.ts'

/**
 * Docs and blog are fully prerendered, so the Worker never renders an MDX body: requests for those
 * pages are answered by the static assets, and an unknown slug 404s before any body is loaded.
 * The compiled MDX chunks (`*.md(x)_macro_*`, ~15 MB for 260 pages) are therefore dead weight in the
 * Worker. They are needed *during* the build (the prerender loads them), so they are emptied after it.
 */
const emptyPrerenderedContent = (): Plugin => ({
  name: 'empty-prerendered-content', enforce: 'post', apply: 'build',
  buildApp: { order: 'post', async handler(builder) {
    const dir = path.join(builder.environments.ssr.config.build.outDir, 'assets')
    let n = 0, bytes = 0
    for (const f of fs.readdirSync(dir)) {
      if (!/\.mdx?_macro_/.test(f)) continue
      const p = path.join(dir, f); bytes += fs.statSync(p).size
      fs.writeFileSync(p, 'export default undefined\n'); n++
    }
    console.log(`[empty-prerendered-content] emptied ${n} MDX chunks (${(bytes / 1048576).toFixed(1)} MB)`)
  } },
})

// Same app, Workers SSR bundle: `vite build -c vite.config.cf.ts`
export default mergeConfig(base, { plugins: [cloudflare({ viteEnvironment: { name: 'ssr' } }), emptyPrerenderedContent()] })
