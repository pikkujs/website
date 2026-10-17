import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/wires/websocket'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/_features/wires/websocket')({
  head: () => pageHead({ title: "WebSocket Wire \u2014 Pikku", description: "Wire your Pikku functions to WebSocket channels with action routing, pub/sub via EventHub, per-message auth, and a type-safe client.", path: '/wires/websocket' }),
  component: Page,
})
