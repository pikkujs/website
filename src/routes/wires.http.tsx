import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/wires/http'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/wires/http')({
  head: () => pageHead({ title: "HTTP Wire \u2014 Pikku", description: "Turn your Pikku functions into type-safe REST endpoints with automatic input merging, OpenAPI generation, and optional SSE streaming.", path: '/wires/http' }),
  component: Page,
})
