import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/core/versioning'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/_features/core/versioning')({
  head: () => pageHead({ title: "Versioning & Contracts \u2014 Evolve Functions, Keep Workflows Running", description: "Pikku hashes every function's contract and catches breaking changes before deploy. Workflows and AI agents keep running even as functions evolve.", path: '/core/versioning' }),
  component: Page,
})
