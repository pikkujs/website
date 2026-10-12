import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/core/services'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/core/services')({
  head: () => pageHead({ title: "Services \u2014 Your Toolbox, Injected", description: "Pikku services use two factory functions \u2014 pikkuServices and pikkuWireServices \u2014 with automatic tree-shaking via RequiredSingletonServices.", path: '/core/services' }),
  component: Page,
})
