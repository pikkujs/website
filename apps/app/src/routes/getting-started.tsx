import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/getting-started'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/getting-started')({
  head: () => pageHead({ title: "Getting Started", description: "From an empty folder to a running platform \u2014 create a project, run npx pikku dev, and get a complete backend with database, auth, email and workflows.", path: '/getting-started' }),
  component: Page,
})
