import { createFileRoute, notFound } from '@tanstack/react-router'
import { getAddon } from '@/lib/catalogue'
import Detail from '@/components/AddonCatalogue/Detail'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/addons/$slug')({
  loader: async ({ params }) => { const a = await getAddon(params.slug); if (!a) throw notFound(); return a },
  head: ({ loaderData, params }) => {
    const name = loaderData?.title ?? params.slug
    const d = loaderData?.description ?? ''
    // thin vendor blurbs get a consistent tail so snippets stay useful (and distinct per addon)
    const description = d.length >= 70 ? d : `${d ? d.replace(/\.?$/, '. ') : ''}The ${name} addon gives Pikku typed ${name} functions, callable over RPC with secrets and auth wired in.`
    return pageHead({ title: `${name} addon`, description, path: `/addons/${params.slug}` })
  },
  component: () => <Detail addon={Route.useLoaderData() as any} />,
})
