import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/wires/agent'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/_features/wires/agent')({
  head: () => pageHead({ title: "AI Agent Wire \u2014 Pikku", description: "TypeScript AI agent framework \u2014 build AI agents with your existing functions as tools. No schema duplication, built-in auth, streaming, and multi-agent delegation.", path: '/wires/agent' }),
  component: Page,
})
