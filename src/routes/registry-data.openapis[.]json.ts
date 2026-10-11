import { createFileRoute } from '@tanstack/react-router'
import { openApiCatalogue } from '@/lib/catalogue'

/** The browse page's data: the hosted registry, or the recorded fixture when it is unreachable. CDN-cached for an hour. */
export const Route = createFileRoute('/registry-data/openapis.json')({
  server: { handlers: { GET: async () => {
    const { stale, ...body } = await openApiCatalogue()
    return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400', 'x-registry-stale': String(stale) } })
  } } },
})
