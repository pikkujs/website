import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/features'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/_features/features')({
  head: () => pageHead({ title: "Features", description: "Two concepts. Eleven wire types. Write your TypeScript backend once \u2014 Pikku wires it to HTTP, WebSocket, queues, cron, CLI, AI agents, gateways, and more.", path: '/features' }),
  component: Page,
})
