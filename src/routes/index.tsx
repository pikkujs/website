import { createFileRoute } from '@tanstack/react-router'
import Page from '@/views/index'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () => pageHead({ title: 'Pikku: build every app, own every piece', description: 'Pikku is an open-source TypeScript framework. Write your functions once and ship them as a web, mobile, desktop, CLI and MCP app, on the database, auth, queue and AI you choose.', path: '/' }),
  component: Page,
})
