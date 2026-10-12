import { createFileRoute, notFound } from '@tanstack/react-router'
import { getOpenApi } from '@/lib/catalogue'
import Detail, { type Spec } from '@/components/OpenApiCatalogue/Detail'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/openapis/$slug')({
  loader: async ({ params }) => { const r = await getOpenApi({ data: params.slug }); if (!r) throw notFound(); return r },
  headers: () => ({ 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=86400' }),
  head: ({ loaderData, params }) => pageHead({ title: `${loaderData?.api.title ?? loaderData?.api.name ?? params.slug} OpenAPI`, description: `Generate a typed Pikku addon from the ${loaderData?.api.title ?? params.slug} OpenAPI specification.`, path: `/openapis/${params.slug}` }),
  component: () => {
    const { api } = Route.useLoaderData()
    const spec: Spec = { slug: api.name, name: api.name, title: api.title, version: api.version, specUrl: api.specUrl, operations: api.operations, authType: api.authType, pricingModel: api.pricingModel, freeTier: api.freeTier, docsUrl: api.docsUrl } as Spec
    return <Detail spec={spec} />
  },
})
