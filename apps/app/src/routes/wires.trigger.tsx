import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/wires/trigger'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/wires/trigger')({
  head: () => pageHead({ title: "Trigger Wire \u2014 Pikku", description: "Connect external event sources to your Pikku functions \u2014 Redis pub/sub, Postgres changes, polling, and anything with a callback.", path: '/wires/trigger' }),
  component: Page,
})
