import path from 'node:path'
import { crawl } from './crawl.js'

/** Vite plugin: after the prerender, crawl the built HTML and fail the build on dead links / anchors. */
export default function linkCheck({ outDir = 'dist/client', isKnown, isIgnored, failOnError = true } = {}) {
  return {
    name: 'vite-link-check',
    enforce: 'post',
    apply: 'build',
    buildApp: {
      order: 'post',
      async handler(builder) {
        const dir = path.resolve(builder.config.root, outDir)
        const r = crawl({ outDir: dir, isKnown, isIgnored: isIgnored instanceof Array ? (h) => isIgnored.some((re) => re.test(h)) : isIgnored })
        console.log(`[vite-link-check] crawled ${r.pages} pages, ${r.links} internal links, ${r.warnings.length} allowed-missing, ${r.errors.length} broken`)
        if (r.errors.length) {
          const msg = `[vite-link-check] ${r.errors.length} broken link(s) in prerendered HTML:\n  ` + r.errors.join('\n  ')
          if (failOnError) throw new Error(msg); else console.warn(msg)
        }
      },
    },
  }
}
export { crawl }
