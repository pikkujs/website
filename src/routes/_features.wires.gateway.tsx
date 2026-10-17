import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/wires/gateway'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/_features/wires/gateway')({
  head: () => pageHead({ title: "Gateway Wire \u2014 Pikku", description: "Connect your Pikku functions to WhatsApp, Slack, Telegram, and any messaging platform \u2014 with normalized messages, auto-verification, and the same middleware you already use.", path: '/wires/gateway' }),
  component: Page,
})
