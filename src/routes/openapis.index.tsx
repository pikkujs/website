import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { listOpenApis } from '@/lib/catalogue'

export const Route = createFileRoute('/openapis/')({
  loader: () => listOpenApis(),
  // CDN keeps it 1h, serves stale up to a day while revalidating -> the registry sees ~1 request/hour/POP
  headers: () => ({ 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' }),
  head: () => ({ meta: [{ title: 'OpenAPI catalogue | Pikku' }] }),
  component: Browse,
})
function Browse() {
  const { apis: index, stale } = Route.useLoaderData()
  const [q, setQ] = useState('')
  const rows = useMemo(() => { const n = q.trim().toLowerCase(); return n ? index.filter((s) => `${s.name} ${s.title ?? ''}`.toLowerCase().includes(n)) : index }, [q, index])
  const ops = useMemo(() => index.reduce((s, x) => s + (x.operations ?? 0), 0), [index])
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-bold">OpenAPI catalogue</h1>
      <p className="mt-1 text-sm text-muted-foreground">{index.length} specifications · {ops.toLocaleString()} operations{stale && ' · snapshot (registry unreachable)'}</p>
      <input type="search" className="mt-4 w-full rounded border border-border bg-background px-3 py-2" placeholder={`Search ${index.length} specs…`} value={q} onChange={(e) => setQ(e.target.value)} />
      <ul className="mt-4 grid grid-cols-2 gap-1 text-sm md:grid-cols-3">{rows.slice(0, 600).map((s) => <li key={s.name}><Link to="/openapis/$slug" params={{ slug: s.name }} preload={false}>{s.name}</Link> <span className="text-xs text-muted-foreground">{s.operations}</span></li>)}</ul>
      {rows.length > 600 && <p className="mt-3 text-sm text-muted-foreground">Showing 600 of {rows.length}; refine the search.</p>}
    </main>
  )
}
