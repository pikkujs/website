import { createFileRoute, notFound } from '@tanstack/react-router'
import { getAddon } from '@/lib/catalogue'
import Detail from '@/components/AddonCatalogue/Detail'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/addons/$slug')({
  loader: async ({ params }) => { const a = await getAddon({ data: params.slug }); if (!a) throw notFound(); return a },
  headers: () => ({ 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=86400' }),
  head: ({ loaderData, params }) => pageHead({ title: `${loaderData?.title ?? params.slug} addon`, description: (loaderData?.description ?? `The ${loaderData?.title ?? params.slug} addon for Pikku`) || undefined, path: `/addons/${params.slug}` }),
  component: () => <Detail addon={Route.useLoaderData() as any} />,
})
