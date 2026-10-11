import { createFileRoute } from '@tanstack/react-router'
import { source } from '@/lib/source'
import { createFromSource } from 'fumadocs-core/search/server'
const server = createFromSource(source)
// static export of the search index: prerendered at build, no server needed at runtime
export const Route = createFileRoute('/search-index.json')({ server: { handlers: { GET: async () => server.staticGET() } } })
