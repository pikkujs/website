import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { makeApi } from '@/pikku/pikku-start.gen'

export const Route = createFileRoute('/addons/$slug')({
  loader: async ({ params }) => {
    try { return await makeApi().invoke('getAddon', { slug: params.slug }) } catch { throw notFound() }
  },
  headers: () => ({ 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' }),
  head: ({ loaderData }) => loaderData ? { meta: [{ title: `${loaderData.title} addon | Pikku` }, { name: 'description', content: (loaderData.description ?? `The ${loaderData.title} addon for Pikku`) }] } : {},
  component: Detail,
})
const plain = (t: string) => t.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/`([^`]*)`/g, '$1')
const familyOf = (n: string) => (n.match(/^[a-z]+/) ?? ['other'])[0]
const PAGE = 36
function Detail() {
  const addon = Route.useLoaderData()
  const [query, setQuery] = useState(''); const [family, setFamily] = useState<string | null>(null); const [shown, setShown] = useState(PAGE)
  const fns = addon.functions ?? [], secrets = addon.secrets ?? [], required = secrets.filter((s) => !s.optional)
  const ns = addon.slug.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())
  const first = fns[0]
  const families = useMemo(() => { const m = new Map<string, number>(); for (const f of fns) m.set(familyOf(f.rpc ?? f.name), (m.get(familyOf(f.rpc ?? f.name)) ?? 0) + 1); return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0])) }, [fns])
  const matches = useMemo(() => { const q = query.trim().toLowerCase(); return fns.filter((f) => { const n = f.rpc ?? f.name; if (family && familyOf(n) !== family) return false; return !q || n.toLowerCase().includes(q) || (f.description ?? '').toLowerCase().includes(q) }) }, [fns, query, family])
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/addons" className="text-sm">← Addon catalogue</Link>
      <div className="mt-4 text-xs uppercase text-muted-foreground">{addon.name}{addon.version && ` · v${addon.version}`}</div>
      <h1 className="text-4xl font-bold">{addon.title}</h1>
      {addon.description && <p className="mt-2 text-lg">{addon.description}</p>}
      <pre className="mt-4 overflow-auto rounded border border-border p-3 text-sm">{`await rpc.invoke('${ns}:${first ? first.rpc ?? first.name : '…'}', { /* ${first?.input ?? 'no input'} */ })`}</pre>
      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        <li><b>1 Install</b><code className="mt-1 block text-sm">npm install {addon.name}</code></li>
        <li><b>2 Wire</b><code className="mt-1 block text-sm">wireAddon({'{'} name: '{ns}' {'}'})</code><p className="text-sm">{fns.length} functions. See <Link to="/docs/$" params={{ _splat: 'addon/consuming' }}>Consuming addons</Link>.</p></li>
        <li><b>3 Set secrets</b><code className="mt-1 block text-sm">{required.length ? required.map((s) => s.secretId).join(', ') : 'none required'}</code></li>
      </ol>
      {secrets.length > 0 && <section className="mt-8"><h2 className="text-xl font-semibold">Secrets</h2><ul className="mt-2 space-y-1 text-sm">{secrets.map((s) => <li key={s.secretId}><code>{s.secretId}</code> {s.displayName ?? s.name}{s.optional && ' (optional)'}{s.description && <p className="text-muted-foreground">{s.description}</p>}</li>)}</ul></section>}
      <section className="mt-8"><h2 className="text-xl font-semibold">What you can call <span className="text-sm font-normal text-muted-foreground">{fns.length} functions</span></h2>
        {fns.length > PAGE && <input type="search" className="my-3 w-full rounded border border-border bg-background px-3 py-2" placeholder={`Filter ${fns.length} functions…`} value={query} onChange={(e) => { setQuery(e.target.value); setShown(PAGE) }} />}
        {families.length > 1 && <div className="my-2 flex flex-wrap gap-1 text-xs">{families.map(([k, c]) => <button key={k} className={'rounded border px-1.5 ' + (family === k ? 'bg-accent text-white' : '')} onClick={() => { setFamily(family === k ? null : k); setShown(PAGE) }}>{k}* {c}</button>)}</div>}
        <ul className="mt-2 divide-y divide-border">{matches.slice(0, shown).map((f) => <li key={f.name} className="py-2"><code><span className="text-muted-foreground">{ns}:</span>{f.rpc ?? f.name}</code>{f.description && <p className="text-sm">{plain(f.description)}</p>}{(f.input || f.output) && <span className="text-xs text-muted-foreground">{f.input ?? 'void'} → {f.output ?? 'void'}</span>}</li>)}</ul>
        {shown < matches.length && <button className="mt-3 rounded border px-3 py-1 text-sm" onClick={() => setShown(shown + PAGE * 3)}>Show {Math.min(PAGE * 3, matches.length - shown)} more of {matches.length}</button>}
      </section>
    </main>
  )
}
