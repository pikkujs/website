import { createFileRoute } from '@tanstack/react-router'
import { listAddons } from '@/lib/catalogue'
import Browse from '@/components/AddonCatalogue/Browse'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/addons/')({
  // SSR: loader runs on the server (vendored addon JSON; the registry has no addon endpoint)
  loader: () => listAddons(),
  headers: () => ({ 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' }),
  head: () => pageHead({ title: 'Addon Catalogue', description: 'Every Pikku addon: typed functions for hundreds of services, ready to call over RPC.', path: '/addons' }),
  component: () => <Browse addons={Route.useLoaderData() as any} />,
})
