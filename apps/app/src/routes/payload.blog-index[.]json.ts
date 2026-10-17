import { createFileRoute } from '@tanstack/react-router'
import { blogList, json } from '@/lib/payload'
export const Route = createFileRoute('/payload/blog-index.json')({ server: { handlers: { GET: async () => json(blogList()) } } })
