import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/developers'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/developers')({
  head: () => pageHead({ title: "Pikku for Developers \u2014 Code Examples & API", description: "See Pikku in action \u2014 code examples for HTTP, WebSocket, queues, cron, CLI, AI agents, workflows, and more. One function, every wiring.", path: '/developers' }),
  component: Page,
})
