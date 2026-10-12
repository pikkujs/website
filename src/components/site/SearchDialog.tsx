import { useEffect, useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useNavigate } from '@tanstack/react-router'
import { CornerDownLeft, Hash, History, Search } from 'lucide-react'
import { DocIcon } from '@/components/docs/DocIcon'

type Item = { id: string; kind: 'page' | 'heading'; title: string; url: string; crumb?: string; desc?: string; hay: string; section: string }
type Row = [string, string, string, [string, string][]]
type Recent = { url: string; title: string }

// where a URL sits, for grouping results and picking the icon
const SECTIONS: Record<string, [label: string, icon: string]> = {
  'core-features': ['Core features', 'l:Layers'], wiring: ['Wiring', 'w:rpc'], middleware: ['Middleware', 'l:ShieldCheck'], addon: ['Addons', 'l:Package'],
  frontend: ['Frontend', 'l:AppWindow'], deploy: ['Deploy', 'l:Rocket'], runtimes: ['Runtimes', 'l:Server'], storage: ['Storage', 'l:Database'],
  'pikku-cli': ['CLI', 'w:cli'], api: ['Services', 'l:Boxes'], advanced: ['Advanced', 'l:Folder'], 'custom-runtimes': ['Custom runtimes', 'l:Server'],
  philosophy: ['Why Pikku', 'l:Lightbulb'], comparison: ['Comparison', 'l:GitCompare'],
}
const sectionOf = (url: string): string => {
  const seg = url.split('#')[0].split('/').filter(Boolean)
  if (seg[0] === 'docs') return seg[1] && SECTIONS[seg[1]] ? seg[1] : 'docs'
  if (seg[0] === 'blog') return 'blog'
  if (seg[0] === 'addons') return 'addons'
  if (seg[0] === 'openapis') return 'openapis'
  return 'site'
}
const LABEL = (k: string): [string, string] => SECTIONS[k] ?? ({ docs: ['Documentation', 'l:FileText'], blog: ['Blog', 'l:FileText'], addons: ['Addon catalogue', 'l:Puzzle'], openapis: ['OpenAPI catalogue', 'l:FileJson'], site: ['Site', 'l:FileText'] } as Record<string, [string, string]>)[k]

// suggested when the box is empty: real pages, resolved against the index (a missing one is skipped)
const SUGGESTED = ['/getting-started', '/docs/core-features/functions', '/docs/wiring', '/docs/deploy', '/docs/pikku-cli']

let cache: Promise<Item[]> | null = null
/** Loaded once, on first open: ~0.3 MB of titles, descriptions and headings. */
const loadIndex = () => (cache ??= fetch('/search-index.json').then((r) => r.json() as Promise<Row[]>).then((rows) => {
  const out: Item[] = []
  for (const [url, title, desc, heads] of rows) {
    const section = sectionOf(url)
    out.push({ id: url, kind: 'page', title, url, desc, hay: `${title} ${desc}`.toLowerCase(), section })
    for (const [id, h] of heads) if (h && h !== title) out.push({ id: `${url}#${id}`, kind: 'heading', title: h, url: `${url}#${id}`, crumb: title, hay: h.toLowerCase(), section })
  }
  return out
}).catch((e) => { cache = null; throw e }))

const search = (items: Item[], q: string): Item[] => {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  const scored: [number, Item][] = []
  for (const it of items) {
    let score = 0
    const t = it.title.toLowerCase()
    for (const term of terms) {
      if (!it.hay.includes(term)) { score = -1; break }
      score += t === term ? 30 : t.startsWith(term) ? 18 : t.includes(term) ? 10 : 2
      if (new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(it.hay)) score += 3
    }
    if (score > 0) scored.push([score + (it.kind === 'page' ? 4 : 0), it])
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, 14).map((x) => x[1])
}

const RECENT_KEY = 'pikku:recent'
const readRecent = (): Recent[] => { try { const v = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); return Array.isArray(v) ? v.filter((r) => r && typeof r.url === 'string' && typeof r.title === 'string').slice(0, 5) : [] } catch { return [] } }
const pushRecent = (r: Recent) => { try { localStorage.setItem(RECENT_KEY, JSON.stringify([r, ...readRecent().filter((x) => x.url !== r.url)].slice(0, 5))) } catch { /* storage blocked */ } }

type Group = { key: string; label: string; entries: (Item | (Recent & { recent: true }))[] }

/** Command palette over the prerendered /search-index.json (no server call, no third party). */
export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState(0)
  const [index, setIndex] = useState<Item[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [recent, setRecent] = useState<Recent[]>([])
  const nav = useNavigate()
  useEffect(() => { if (open && !index) loadIndex().then(setIndex).catch(() => setFailed(true)) }, [open, index])
  useEffect(() => { if (open) setRecent(readRecent()) }, [open])

  const groups = useMemo<Group[]>(() => {
    if (q.trim()) {
      const hits = index ? search(index, q) : []
      const by = new Map<string, Item[]>()
      for (const h of hits) by.set(h.section, [...(by.get(h.section) ?? []), h])
      return [...by].map(([key, entries]) => ({ key, label: LABEL(key)[0], entries }))
    }
    const out: Group[] = []
    if (recent.length) out.push({ key: 'recent', label: 'Recent', entries: recent.map((r) => ({ ...r, recent: true as const })) })
    const sug = index ? SUGGESTED.map((u) => index.find((i) => i.id === u)).filter((i): i is Item => !!i) : []
    if (sug.length) out.push({ key: 'suggested', label: 'Suggested', entries: sug })
    return out
  }, [q, index, recent])
  const flat = useMemo(() => groups.flatMap((g) => g.entries), [groups])
  useEffect(() => { setCursor(0) }, [q])
  useEffect(() => { if (!open) setQ('') }, [open])

  const go = (it: Item | Recent) => {
    onOpenChange(false)
    const url = it.url
    pushRecent({ url: url.split('#')[0], title: 'crumb' in it && it.crumb ? it.crumb : it.title })
    const [to, hash] = url.split('#'); nav({ to: to as any, hash })
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, flat.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)) }
    else if (e.key === 'Home' && flat.length) { e.preventDefault(); setCursor(0) }
    else if (e.key === 'End' && flat.length) { e.preventDefault(); setCursor(flat.length - 1) }
    else if (e.key === 'Enter' && flat[cursor]) { e.preventDefault(); go(flat[cursor]) }
  }
  useEffect(() => { document.getElementById(`cmdk-${cursor}`)?.scrollIntoView({ block: 'nearest' }) }, [cursor])

  let n = -1
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="cmdk" aria-describedby={undefined} onKeyDown={onKey}>
          <Dialog.Title className="sr-only">Search the documentation</Dialog.Title>
          <div className="cmdk-input">
            <Search size={18} aria-hidden />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to a page…" aria-label="Search the docs" role="combobox" aria-expanded aria-controls="cmdk-list" aria-activedescendant={flat[cursor] ? `cmdk-${cursor}` : undefined} />
            <kbd>esc</kbd>
          </div>
          <ul id="cmdk-list" role="listbox" aria-label="Results" className="cmdk-list">
            {q && failed && <li role="presentation" className="cmdk-empty">Search is unavailable right now.</li>}
            {q && !failed && index && flat.length === 0 && <li role="presentation" className="cmdk-empty">Nothing found for "{q}".</li>}
            {!q && !groups.length && <li role="presentation" className="cmdk-empty">Type to search guides, wiring, deploy targets and the CLI.</li>}
            {groups.map((g) => (
              <li key={g.key} role="presentation" className="cmdk-group">
                <p className="cmdk-group-h" id={`cmdk-g-${g.key}`}>{g.label}</p>
                <ul role="group" aria-labelledby={`cmdk-g-${g.key}`}>
                  {g.entries.map((it) => {
                    const i = ++n
                    const recentItem = 'recent' in it
                    const icon = recentItem ? null : it.kind === 'heading' ? null : LABEL(it.section)[1]
                    return (
                      <li key={`${g.key}:${it.url}`} id={`cmdk-${i}`} role="option" aria-selected={i === cursor} className={`cmdk-item${i === cursor ? ' is-active' : ''}`} onMouseEnter={() => setCursor(i)} onClick={() => go(it)}>
                        <span className="cmdk-row">
                          {recentItem ? <History size={16} aria-hidden /> : icon ? <DocIcon icon={icon} size={16} /> : <Hash size={16} aria-hidden />}
                          <span className="cmdk-text">
                            <span className="cmdk-title">{it.title}</span>
                            {!recentItem && 'crumb' in it && it.crumb ? <span className="cmdk-crumb">{it.crumb}</span> : !recentItem && 'desc' in it && it.desc ? <span className="cmdk-crumb">{it.desc}</span> : null}
                          </span>
                          {i === cursor && <CornerDownLeft size={14} aria-hidden />}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>
          <p className="cmdk-foot" aria-hidden><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
