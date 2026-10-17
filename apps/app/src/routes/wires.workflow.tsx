import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/wires/workflow'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/wires/workflow')({
  head: () => pageHead({ title: "Workflow Wire \u2014 Pikku", description: "TypeScript durable workflows with no separate infrastructure. Pikku provides durable execution, retries, sleep, fan-out, and DAG-based graph workflows \u2014 using your existing functions and database.", path: '/wires/workflow' }),
  component: Page,
})
