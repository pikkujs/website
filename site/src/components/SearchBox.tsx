import { useState } from 'react'
import { useDocsSearch } from 'fumadocs-core/search/client'
export function SearchBox({ mode }: { mode: 'static' | 'fetch' }) {
  const [q, setQ] = useState('')
  const s = useDocsSearch(mode === 'static' ? { type: 'static', from: '/search-index.json' } : { type: 'fetch', api: '/api/search' })
  return <div className="relative"><input data-testid="search" value={q} onChange={(e) => { setQ(e.target.value); s.setSearch(e.target.value) }} placeholder={`search (${mode})`} className="rounded border border-border bg-muted px-2 py-1 text-sm" />
    <span data-testid="state" hidden>{JSON.stringify({ l: s.isLoading, e: String((s as any).error ?? ''), d: (s.data as any)?.items?.length ?? null })}</span>{(s.data as any)?.items && q && <ul data-testid="results" className="absolute right-0 top-9 z-50 max-h-80 w-96 overflow-auto rounded border border-border bg-background p-2 text-sm">{(s.data as any).items.slice(0, 8).map((r: any) => <li key={r.id}><a href={r.url}>{r.content ?? r.title}</a></li>)}</ul>}</div>
}
