import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/wires/rpc'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/_features/wires/rpc')({
  head: () => pageHead({ title: "RPC Wire \u2014 Pikku", description: "Call Pikku functions from other functions with type-safe RPC \u2014 internal, remote, and exposed, with session inheritance and depth tracking.", path: '/wires/rpc' }),
  component: Page,
})
