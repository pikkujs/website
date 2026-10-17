import { createFileRoute } from '@tanstack/react-router'
import { registryAddon } from '@/lib/registry'

// Client-side navigation between detail pages fetches this instead of the static site's /__data snapshot.
export const Route = createFileRoute('/live/addons/$slug')({
  server: { handlers: { GET: async ({ params }: any) => {
    const a = await registryAddon(String(params.slug).replace(/\.json$/, ''))
    return Response.json(a ?? { error: 'not found' }, { status: a ? 200 : 404, headers: { 'cache-control': a ? 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400' : 'no-store' } })
  } } },
})
