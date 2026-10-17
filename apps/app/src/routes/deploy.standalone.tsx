import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/deploy/standalone'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/deploy/standalone')({
  head: () => pageHead({ title: "Standalone Deploy \u2014 One Bundle or One Binary", description: "Deploy a Pikku project as a single Node bundle or a self-contained executable \u2014 server, scheduler, queues, database migrations and frontend in one artifact. No cloud provider.", path: '/deploy/standalone' }),
  component: Page,
})
