import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/deploy/serverless'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/_features/deploy/serverless')({
  head: () => pageHead({ title: "Deploy to AWS \u2014 Lambda + SQS + EventBridge", description: "Pikku generates a complete Serverless Framework config from your functions \u2014 Lambda for HTTP, SQS for queues, EventBridge for cron. You just run the deploy.", path: '/deploy/serverless' }),
  component: Page,
})
