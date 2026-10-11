import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { listAddons } from '@/lib/catalogue'

type Entry = Awaited<ReturnType<typeof listAddons>>[number]
export const Route = createFileRoute('/addons/')({
  // SSR: loader runs on the server (vendored addon JSON; registry has no addon endpoint)
  loader: () => listAddons(),
  headers: () => ({ 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' }),
  head: () => ({ meta: [{ title: 'Addon Catalogue | Pikku' }] }),
  component: Browse,
})
function Browse() {
  const index = Route.useLoaderData()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const totalFns = useMemo(() => index.reduce((s, a) => s + a.functionCount, 0), [])
  const groups = useMemo(() => { const m = new Map<string, { label: string; count: number }>(); for (const a of index) { const e = m.get(a.category); if (e) e.count++; else m.set(a.category, { label: a.categoryLabel, count: 1 }) } return [...m.entries()].sort((a, b) => a[1].label.localeCompare(b[1].label)) }, [])
  const bands = useMemo(() => {
    const q = query.trim().toLowerCase(), by = new Map<string, Entry[]>()
    for (const a of index) { if (category && a.category !== category) continue; if (q && !(`${a.title} ${a.name} ${a.categoryLabel} ${a.description ?? ''}`.toLowerCase().includes(q))) continue; (by.get(a.category) ?? by.set(a.category, []).get(a.category)!).push(a) }
    return [...by.entries()].map(([k, items]) => ({ key: k, label: items[0].categoryLabel, items: items.sort((a, b) => a.title.localeCompare(b.title)) })).sort((a, b) => a.label.localeCompare(b.label))
  }, [query, category])
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-bold">Someone already wrote it.</h1>
      <p className="mt-1 text-sm text-muted-foreground">{index.length} addons · {totalFns.toLocaleString()} functions</p>
      <p className="mt-3 max-w-2xl">Every addon is a package of typed Pikku functions — namespaced, secrets declared, ready to call over RPC.</p>
      <input type="search" className="mt-6 w-full rounded border border-border bg-background px-3 py-2" placeholder={`Search ${index.length} addons…`} value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <button className={'rounded border px-2 py-0.5 ' + (!category ? 'bg-accent text-white' : '')} onClick={() => setCategory(null)}>All {index.length}</button>
        {groups.map(([k, g]) => <button key={k} className={'rounded border px-2 py-0.5 ' + (category === k ? 'bg-accent text-white' : '')} onClick={() => setCategory(category === k ? null : k)}>{g.label} {g.count}</button>)}
      </div>
      {bands.map((b) => <section key={b.key} className="mt-8"><h2 className="mb-2 text-lg font-semibold">{b.label}</h2>
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-4">{b.items.map((a) => <li key={a.slug}><Link to="/addons/$slug" params={{ slug: a.slug }} className="block rounded border border-border p-2 hover:border-accent"><div className="font-medium">{a.title}</div><div className="text-xs text-muted-foreground">{a.name.replace('@pikku/addon-', '')} · {a.functionCount}</div></Link></li>)}</ul></section>)}
    </main>
  )
}
