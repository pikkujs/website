import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/wires/mcp'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/_features/wires/mcp')({
  head: () => pageHead({ title: "MCP Wire \u2014 Pikku", description: "Expose your Pikku functions to AI models via the Model Context Protocol \u2014 tools, resources, and prompts with typed parameters.", path: '/wires/mcp' }),
  component: Page,
})
