import { createFileRoute, notFound } from '@tanstack/react-router'
import { getOpenApi } from '@/lib/catalogue'
import Detail, { type Spec } from '@/components/OpenApiCatalogue/Detail'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/openapis/$slug')({
  loader: async ({ params }) => { const r = await getOpenApi(params.slug); if (!r) throw notFound(); return r },
  head: ({ loaderData, params }) => pageHead({ title: `${loaderData?.title ?? loaderData?.name ?? params.slug} OpenAPI`, description: `Generate a typed Pikku addon from the ${loaderData?.title ?? params.slug} OpenAPI specification.`, path: `/openapis/${params.slug}` }),
  component: () => <Detail spec={Route.useLoaderData() as Spec} />,
})
