import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/deploy/cloudflare'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/_features/deploy/cloudflare')({
  head: () => pageHead({ title: "Deploy to Cloudflare \u2014 One Command", description: "Pikku analyzes your functions and deploys each one as a Cloudflare Worker \u2014 with queues, cron, D1, KV, and secrets all configured automatically.", path: '/deploy/cloudflare' }),
  component: Page,
})
