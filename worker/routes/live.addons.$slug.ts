import { createFileRoute } from '@tanstack/react-router'
import { registryAddon } from '../registry'

// Client-side navigation between detail pages fetches this instead of the static site's /__data snapshot.
export const Route = createFileRoute('/live/addons/$slug')({
  server: { handlers: { GET: async ({ params }: any) => {
    const a = await registryAddon(String(params.slug).replace(/\.json$/, ''))
    return Response.json(a ?? { error: 'not found' }, { status: a ? 200 : 404 })
  } } },
})
