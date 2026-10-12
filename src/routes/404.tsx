import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '@/components/site/NotFound'

/** Prerendered only to become dist/client/404.html (GitHub Pages serves it, with status 404, for any unknown path). */
export const Route = createFileRoute('/404')({
  head: () => ({ meta: [{ name: 'robots', content: 'noindex' }] }),
  component: NotFound,
})
