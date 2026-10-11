import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/openapis'
import { pageHead } from '@/lib/seo'

// The shell is server-rendered; the 2,500-row table is fetched from /registry-data/openapis.json (hosted registry, fixture fallback)
export const Route = createFileRoute('/openapis/')({
  headers: () => ({ 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' }),
  head: () => pageHead({ title: 'OpenAPI Catalogue', description: 'Every OpenAPI specification pikku can generate a typed client for, searchable by provider and category.', path: '/openapis' }),
  component: Page,
})
