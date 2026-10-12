import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/openapis'
import { pageHead } from '@/lib/seo'

// The shell is prerendered; the 2,500-row table is fetched from /__data/openapis-browse.json
export const Route = createFileRoute('/openapis/')({
  head: () => pageHead({ title: 'OpenAPI Catalogue', description: 'Every OpenAPI specification pikku can generate a typed client for, searchable by provider and category.', path: '/openapis' }),
  component: Page,
})
