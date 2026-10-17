import { createFileRoute } from '@tanstack/react-router'
import { registryOpenApi } from '@/lib/registry'

export const Route = createFileRoute('/live/openapis/$slug')({
  server: { handlers: { GET: async ({ params }: any) => {
    const r = await registryOpenApi(String(params.slug).replace(/\.json$/, ''))
    return Response.json(r ?? { error: 'not found' }, { status: r ? 200 : 404, headers: { 'cache-control': r ? 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400' : 'no-store' } })
  } } },
})
