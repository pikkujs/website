import { createFileRoute } from '@tanstack/react-router'
import { registrySlugs } from '../registry'
import { SITE } from '@/lib/seo'

// Listed in the static site's sitemap index, so crawlers find every addon and spec the Worker serves.
export const Route = createFileRoute('/sitemap-catalogue.xml')({
  server: { handlers: { GET: async () => {
    const { addons, openapis } = await registrySlugs()
    const urls = [...addons.map((s) => `/addons/${s}`), ...openapis.map((s) => `/openapis/${s}`)]
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`
    return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } })
  } } },
})
