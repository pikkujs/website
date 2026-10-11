import { createFileRoute } from '@tanstack/react-router'
import { blogPayload, json, slugsOf } from '@/lib/payload'
export const Route = createFileRoute('/payload/blog/$')({ server: { handlers: { GET: async ({ params }: any) => { const p = blogPayload(slugsOf(params._splat)); return p ? json(p) : json({ error: 'not found' }, 404) } } } })
