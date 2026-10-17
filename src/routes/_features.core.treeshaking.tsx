import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/core/treeshaking'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/_features/core/treeshaking')({
  head: () => pageHead({ title: "Tree-Shaking \u2014 Same Codebase, Any Deployment", description: "Pikku's CLI scans your function signatures, filters by routes, tags, or types, and generates entry points with only what each deployment needs.", path: '/core/treeshaking' }),
  component: Page,
})
