import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/deploy/azure'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/deploy/azure')({
  head: () => pageHead({ title: "Deploy to Azure Functions", description: "Pikku generates Azure Functions v4 code from your functions \u2014 HTTP triggers, Storage Queue triggers, and Timer triggers. Deploy with the Azure CLI.", path: '/deploy/azure' }),
  component: Page,
})
