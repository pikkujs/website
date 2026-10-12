import { useEffect, useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useNavigate } from '@tanstack/react-router'
import { CornerDownLeft, FileText, Hash, Search } from 'lucide-react'

type Item = { id: string; kind: 'page' | 'heading'; title: string; url: string; crumb?: string; hay: string }
type Row = [string, string, string, [string, string][]]

let cache: Promise<Item[]> | null = null
/** Loaded once, on first open: ~0.3 MB of titles, descriptions and headings. */
const loadIndex = () => (cache ??= fetch('/search-index.json').then((r) => r.json() as Promise<Row[]>).then((rows) => {
  const out: Item[] = []
  for (const [url, title, desc, heads] of rows) {
    out.push({ id: url, kind: 'page', title, url, hay: `${title} ${desc}`.toLowerCase() })
    for (const [id, h] of heads) if (h && h !== title) out.push({ id: `${url}#${id}`, kind: 'heading', title: h, url: `${url}#${id}`, crumb: title, hay: h.toLowerCase() })
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
  return scored.sort((a, b) => b[0] - a[0]).slice(0, 12).map((x) => x[1])
}

/** Command palette over the prerendered /search-index.json (no server call, no third party). */
export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState(0)
  const [index, setIndex] = useState<Item[] | null>(null)
  const [failed, setFailed] = useState(false)
  const nav = useNavigate()
  useEffect(() => { if (open && !index) loadIndex().then(setIndex).catch(() => setFailed(true)) }, [open, index])
  const items = useMemo(() => (index ? search(index, q) : []), [index, q])
  useEffect(() => { setCursor(0) }, [q])
  useEffect(() => { if (!open) setQ('') }, [open])
  const go = (it: Item) => { onOpenChange(false); const [to, hash] = it.url.split('#'); nav({ to: to as any, hash }) }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, items.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)) }
    else if (e.key === 'Enter' && items[cursor]) { e.preventDefault(); go(items[cursor]) }
  }
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="cmdk" aria-describedby={undefined} onKeyDown={onKey}>
          <Dialog.Title className="sr-only">Search the documentation</Dialog.Title>
          <div className="cmdk-input">
            <Search size={18} aria-hidden />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the docs…" aria-label="Search the docs" role="combobox" aria-expanded aria-controls="cmdk-list" aria-activedescendant={items[cursor] ? `cmdk-${cursor}` : undefined} />
            <kbd>esc</kbd>
          </div>
          <ul id="cmdk-list" role="listbox" className="cmdk-list">
            {!q && <li className="cmdk-empty">Type to search guides, wiring, deploy targets and the CLI.</li>}
            {q && failed && <li className="cmdk-empty">Search is unavailable right now.</li>}
            {q && !failed && index && items.length === 0 && <li className="cmdk-empty">Nothing found for "{q}".</li>}
            {items.map((it, i) => (
              <li key={it.id} id={`cmdk-${i}`} role="option" aria-selected={i === cursor}>
                <button type="button" className={`cmdk-item${i === cursor ? ' is-active' : ''}`} onMouseEnter={() => setCursor(i)} onClick={() => go(it)}>
                  {it.kind === 'page' ? <FileText size={16} aria-hidden /> : <Hash size={16} aria-hidden />}
                  <span className="cmdk-text">
                    <span className="cmdk-title">{it.title}</span>
                    {it.crumb ? <span className="cmdk-crumb">{it.crumb}</span> : null}
                  </span>
                  {i === cursor && <CornerDownLeft size={14} aria-hidden />}
                </button>
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
