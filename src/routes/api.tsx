import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/api'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/api')({
  head: () => pageHead({ title: 'SDK', description: 'Everything Pikku gives you to import, in the order you meet it while building a service.', path: '/api' }),
  component: Page,
})
