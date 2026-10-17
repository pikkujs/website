import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/core/function'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/core/function')({
  head: () => pageHead({ title: "Pikku Functions \u2014 Write Once, Wire Everywhere", description: "A Pikku function receives services, data, and wire context \u2014 and works across HTTP, WebSocket, Queue, CLI, MCP, and every other protocol.", path: '/core/function' }),
  component: Page,
})
