import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/wires/queue'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/_features/wires/queue')({
  head: () => pageHead({ title: "Queue Wire \u2014 Pikku", description: "Wire your Pikku functions to queue workers with retries, progress tracking, dead-letter routing, and multi-backend support.", path: '/wires/queue' }),
  component: Page,
})
