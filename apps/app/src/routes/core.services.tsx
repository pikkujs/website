import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/core/services'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/core/services')({
  head: () => pageHead({ title: "Services in Pikku", description: "How Pikku services work: shared and per-call factories in plain TypeScript, and what the generated service map does and does not skip.", path: '/core/services' }),
  component: Page,
})
