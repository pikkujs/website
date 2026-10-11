import { createFileRoute } from '@tanstack/react-router'
import { searchServer } from '@/lib/search'
// static export of the search index: prerendered at build, no server needed at runtime
export const Route = createFileRoute('/search-index.json')({ server: { handlers: { GET: async () => searchServer.staticGET() } } })
