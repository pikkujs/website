/**
 * Creates one prerendered route per OpenAPI specification in the catalogue.
 *
 * The alternative was serving src/data/openapi-specs/*.json out of static/ and
 * fetching one on the client — which gives every spec the same URL-less shell,
 * nothing for a crawler to read, and a spinner in front of data that was fully
 * known at build time. As routes each spec gets its own HTML from one component
 * and one JSON payload, exactly like the addon catalogue next door.
 *
 * Data comes from `npm run sync-registry`: the fabric registry API for the
 * enrichment, the specs themselves for the operation lists.
 */
const path = require('node:path')
const fs = require('node:fs')

const SPEC_DIR = 'src/data/openapi-specs'

module.exports = function openApiCataloguePlugin(context) {
  const dir = path.resolve(context.siteDir, SPEC_DIR)

  return {
    name: 'openapi-catalogue',

    getPathsToWatch() {
      // So `npm run sync-registry` while the dev server is up reloads the routes.
      return [path.join(dir, '*.json')]
    },

    async loadContent() {
      // A checkout that has not synced yet still builds — it simply has no spec
      // pages, and the browse page's tiles stay unlinked.
      if (!fs.existsSync(dir)) return { specs: [] }
      const specs = []
      for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith('.json')) continue
        try {
          specs.push({
            slug: file.slice(0, -'.json'.length),
            ...JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')),
          })
        } catch {
          // One unreadable file should not take the whole build with it.
        }
      }
      return { specs }
    },

    async contentLoaded({ content, actions }) {
      const { addRoute, createData } = actions
      for (const spec of content.specs) {
        const data = await createData(`openapi-${spec.slug}.json`, JSON.stringify(spec))
        addRoute({
          path: `/openapis/${spec.slug}`,
          component: '@site/src/components/OpenApiCatalogue/Detail.tsx',
          modules: { spec: data },
          exact: true,
        })
      }
    },
  }
}
