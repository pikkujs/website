import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/core/security'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/_features/core/security')({
  head: () => pageHead({ title: "Sessions & Permissions \u2014 One Security API, Every Transport", description: "Pikku sessions, permissions, and auth middleware work the same across HTTP, WebSocket, CLI, MCP, and every protocol. Write your security logic once.", path: '/core/security' }),
  component: Page,
})
