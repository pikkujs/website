import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/core/function'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/core/function')({
  head: () => pageHead({ title: "Pikku functions: one typed function, many ways in", description: "A Pikku function takes its services, its input and details of the call. Wire it to HTTP, the CLI or an AI agent without rewriting the body. A function that needs a signed-in user needs a way in that can identify one.", path: '/core/function' }),
  component: Page,
})
