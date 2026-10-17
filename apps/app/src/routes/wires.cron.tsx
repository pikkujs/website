import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/wires/cron'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/wires/cron')({
  head: () => pageHead({ title: "Scheduled Tasks Wire \u2014 Pikku", description: "Wire your Pikku functions to cron schedules with standard five-field expressions, middleware, skip control, and multi-runtime support.", path: '/wires/cron' }),
  component: Page,
})
