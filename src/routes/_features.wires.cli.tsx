import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/wires/cli'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/_features/wires/cli')({
  head: () => pageHead({ title: "CLI Wire \u2014 Pikku", description: "Wire your Pikku functions to CLI commands with typed parameters, subcommands, custom renderers, and local or remote execution.", path: '/wires/cli' }),
  component: Page,
})
