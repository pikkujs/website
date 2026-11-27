import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/api'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/api')({
  head: () => pageHead({ title: 'SDK', description: 'Everything Pikku gives you to import, in the order you meet it while building a service.', path: '/api' }),
  // The explorer fills the viewport and never scrolls the page, so a footer would be out of reach.
  staticData: { noFooter: true },
  component: Page,
})
