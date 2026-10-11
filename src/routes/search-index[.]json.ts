import { createFileRoute } from '@tanstack/react-router'
import { buildSearchIndex } from '@/lib/search'
// prerendered at build into dist/client/search-index.json; the browser loads it on first open of the palette
export const Route = createFileRoute('/search-index.json')({
  server: { handlers: { GET: async () => new Response(JSON.stringify(await buildSearchIndex()), { headers: { 'content-type': 'application/json' } }) } },
})
