import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { blogSource } from '@/lib/source'

const list = createServerFn({ method: 'GET' }).handler(async () =>
  blogSource.getPages().map((p) => ({ url: p.url, title: p.data.title ?? '', description: p.data.description ?? '', date: p.slugs.slice(0, 3).join('-') })).sort((a, b) => b.date.localeCompare(a.date)))
export const Route = createFileRoute('/blog/')({
  loader: () => list(),
  head: () => ({ meta: [{ title: 'Blog | Pikku' }] }),
  component: () => { const posts = Route.useLoaderData(); return <main className="mx-auto max-w-3xl px-4 py-10"><h1 className="mb-6 text-3xl font-bold">Blog</h1><ul className="space-y-4">{posts.map((p) => <li key={p.url}><Link to={p.url} className="text-lg font-semibold">{p.title}</Link><div className="text-sm text-muted-foreground">{p.date} {p.description}</div></li>)}</ul></main> },
})
