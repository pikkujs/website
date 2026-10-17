import { createFileRoute, notFound } from '@tanstack/react-router'
import { getOpenApi } from '@/lib/catalogue'
import Detail, { type Spec } from '@/components/OpenApiCatalogue/Detail'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/openapis/$slug')({
  loader: async ({ params }) => { const r = await getOpenApi(params.slug); if (!r) throw notFound(); return r },
  head: ({ loaderData, params }) => {
    const name = loaderData?.title ?? loaderData?.name ?? params.slug
    // one vendor client spans many specs (Azure SQL has ~70): the last slug segment tells them apart
    const tail = params.slug.split('-').pop() ?? ''
    const part = tail && !name.toLowerCase().includes(tail) ? `: ${tail}` : ''
    return pageHead({
      title: `${name} OpenAPI${part}`,
      description: `Generate a typed Pikku addon from the ${name} OpenAPI specification (${params.slug}), with typed functions callable over RPC and secrets and auth wired in.`,
      path: `/openapis/${params.slug}`,
    })
  },
  component: () => <Detail spec={Route.useLoaderData() as Spec} />,
})
