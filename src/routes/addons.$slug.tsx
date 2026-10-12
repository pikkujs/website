import { createFileRoute, notFound } from '@tanstack/react-router'
import { getAddon } from '@/lib/catalogue'
import Detail from '@/components/AddonCatalogue/Detail'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/addons/$slug')({
  loader: async ({ params }) => { const a = await getAddon(params.slug); if (!a) throw notFound(); return a },
  head: ({ loaderData, params }) => pageHead({ title: `${loaderData?.title ?? params.slug} addon`, description: (loaderData?.description ?? `The ${loaderData?.title ?? params.slug} addon for Pikku`) || undefined, path: `/addons/${params.slug}` }),
  component: () => <Detail addon={Route.useLoaderData() as any} />,
})
