/**
 * Creates the addon catalogue's routes from the vendored data.
 *
 * 218 detail pages as 218 source files would be 218 near-identical modules to
 * keep in sync; as routes they are one component and one JSON payload each,
 * and each still prerenders to its own HTML so it can be linked and indexed.
 *
 * Data comes from `npm run sync-registry` (src/data/addons.json).
 */
const path = require('node:path')

const CATEGORY_LABELS = {
  ai: 'AI',
  analytics: 'Analytics',
  automation: 'Automation',
  cache: 'Cache',
  cloud: 'Cloud',
  communication: 'Communication',
  crm: 'CRM',
  crypto: 'Crypto',
  data: 'Data',
  database: 'Database',
  devops: 'DevOps',
  documents: 'Documents',
  ecommerce: 'E-commerce',
  email: 'Email',
  esoteric: 'Esoteric',
  forms: 'Forms',
  infrastructure: 'Infrastructure',
  media: 'Media',
  monitoring: 'Monitoring',
}

const label = (category) =>
  CATEGORY_LABELS[category] ??
  category.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ')

module.exports = function addonCataloguePlugin(context) {
  return {
    name: 'addon-catalogue',

    getPathsToWatch() {
      // So `npm run sync-registry` while the dev server is up reloads the routes.
      return [path.resolve(context.siteDir, 'src/data/addons.json')]
    },

    async loadContent() {
      const file = path.resolve(context.siteDir, 'src/data/addons.json')
      try {
        return require(file)
      } catch {
        // A checkout without vendored data still builds; the page says so.
        return { addons: [] }
      }
    },

    async contentLoaded({ content, actions }) {
      const { addRoute, createData } = actions
      const addons = content.addons ?? []

      // The index only needs what the rows and filters read — not every
      // function of every addon, which would be a 3MB payload on first paint.
      const index = addons.map((addon) => ({
        slug: addon.slug,
        name: addon.name,
        title: addon.title,
        category: addon.category,
        categoryLabel: label(addon.category),
        description: addon.description,
        logo: addon.logo,
        functionCount: addon.functions?.length ?? 0,
      }))

      const indexData = await createData('addon-index.json', JSON.stringify(index))

      addRoute({
        path: '/addons',
        component: '@site/src/components/AddonCatalogue/Browse.tsx',
        modules: { addons: indexData },
        exact: true,
      })

      for (const addon of addons) {
        const data = await createData(`addon-${addon.slug}.json`, JSON.stringify({
          ...addon,
          categoryLabel: label(addon.category),
        }))
        addRoute({
          path: `/addons/${addon.slug}`,
          component: '@site/src/components/AddonCatalogue/Detail.tsx',
          modules: { addon: data },
          exact: true,
        })
      }
    },
  }
}
