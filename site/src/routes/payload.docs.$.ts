import { createFileRoute } from '@tanstack/react-router'
import { docPayload, json, slugsOf } from '@/lib/payload'
export const Route = createFileRoute('/payload/docs/$')({ server: { handlers: { GET: async ({ params }: any) => { const p = docPayload(slugsOf(params._splat)); return p ? json(p) : json({ error: 'not found' }, 404) } } } })
