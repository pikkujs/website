import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/core/addons'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/core/addons')({
  head: () => pageHead({ title: "Addons \u2014 Extend Pikku with Plugins", description: "Pikku addons bundle functions, services, secrets, and wires into a single npm package. Install once, wire once \u2014 get an entire feature.", path: '/core/addons' }),
  component: Page,
})
