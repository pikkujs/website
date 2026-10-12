import { createFileRoute } from '@tanstack/react-router'
import { listAddons } from '@/lib/catalogue'
import Browse from '@/components/AddonCatalogue/Browse'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/addons/')({
  // prerendered; client navigation fetches /__data/addons.json
  loader: () => listAddons(),
  head: () => pageHead({ title: 'Addon Catalogue', description: 'Every Pikku addon: typed functions for hundreds of services, ready to call over RPC.', path: '/addons' }),
  component: () => <Browse addons={Route.useLoaderData() as any} />,
})
