import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/core/secrets'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/core/secrets')({
  head: () => pageHead({ title: "Secrets & Variables \u2014 Typed Config for Pikku", description: "Declare secrets and variables with Zod schemas. Every value is validated, typed, and manageable from code or environment.", path: '/core/secrets' }),
  component: Page,
})
