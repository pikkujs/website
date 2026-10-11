import { createFileRoute } from '@tanstack/react-router'
import { docsTree, json } from '@/lib/payload'
export const Route = createFileRoute('/payload/docs-tree.json')({ server: { handlers: { GET: async () => json(await docsTree()) } } })
