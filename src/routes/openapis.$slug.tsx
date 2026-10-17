import { createFileRoute, notFound } from '@tanstack/react-router'
import { getOpenApi } from '@/lib/catalogue'
import Detail, { type Spec } from '@/components/OpenApiCatalogue/Detail'
import { openApiHead } from '@/lib/catalogue-head'

export const Route = createFileRoute('/openapis/$slug')({
  loader: async ({ params }) => { const r = await getOpenApi(params.slug); if (!r) throw notFound(); return r },
  head: ({ loaderData, params }) => openApiHead(loaderData, params.slug),
  component: () => <Detail spec={Route.useLoaderData() as Spec} />,
})
