import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/core/built-in-services'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/_features/core/built-in-services')({
  head: () => pageHead({ title: "Built-in Services \u2014 Every Interface & Provider", description: "Every service interface Pikku ships \u2014 JWT, sessions, queues, workflows, AI storage, content, channels, logger, secrets, and more \u2014 with pluggable providers.", path: '/core/built-in-services' }),
  component: Page,
})
