import { createFileRoute, notFound } from '@tanstack/react-router'
import { getAddon } from '@/lib/catalogue'
import Detail from '@/components/AddonCatalogue/Detail'
import { addonHead } from '@/lib/catalogue-head'

export const Route = createFileRoute('/addons/$slug')({
  loader: async ({ params }) => { const a = await getAddon(params.slug); if (!a) throw notFound(); return a },
  head: ({ loaderData, params }) => addonHead(loaderData, params.slug),
  component: () => <Detail addon={Route.useLoaderData() as any} />,
})
