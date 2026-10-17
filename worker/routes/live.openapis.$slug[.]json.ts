import { createFileRoute } from '@tanstack/react-router'
import { registryOpenApi } from '../registry'

export const Route = createFileRoute('/live/openapis/$slug.json')({
  server: { handlers: { GET: async ({ params }: any) => {
    const r = await registryOpenApi(params.slug)
    return Response.json(r ?? { error: 'not found' }, { status: r ? 200 : 404 })
  } } },
})
