import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useNavigate } from '@tanstack/react-router'
import { useDocsSearch } from 'fumadocs-core/search/client'
import { CornerDownLeft, FileText, Hash, Search } from 'lucide-react'

type Item = { id: string; type: 'page' | 'heading' | 'text'; content: string; url: string; breadcrumbs?: string[] }

/** Command palette over the prerendered /search-index.json (loaded on first open, no server call). */
export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState(0)
  const nav = useNavigate()
  const s = useDocsSearch({ type: 'static', from: '/search-index.json' })
  const items: Item[] = Array.isArray(s.data) ? (s.data as Item[]) : []
  useEffect(() => { s.setSearch(q); setCursor(0) }, [q])
  useEffect(() => { if (!open) setQ('') }, [open])
  const go = (it: Item) => { onOpenChange(false); nav({ to: it.url as any }) }
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
          <Dialog.Title className="sr-only-x">Search the documentation</Dialog.Title>
          <div className="cmdk-input">
            <Search size={18} aria-hidden />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the docs…" aria-label="Search the docs" role="combobox" aria-expanded aria-controls="cmdk-list" aria-activedescendant={items[cursor] ? `cmdk-${cursor}` : undefined} />
            <kbd>esc</kbd>
          </div>
          <ul id="cmdk-list" role="listbox" className="cmdk-list">
            {!q && <li className="cmdk-empty">Type to search guides, wiring, deploy targets and the CLI.</li>}
            {q && !s.isLoading && items.length === 0 && <li className="cmdk-empty">Nothing found for "{q}".</li>}
            {items.map((it, i) => (
              <li key={it.id} id={`cmdk-${i}`} role="option" aria-selected={i === cursor}>
                <button type="button" className={`cmdk-item${i === cursor ? ' is-active' : ''}`} onMouseEnter={() => setCursor(i)} onClick={() => go(it)}>
                  {it.type === 'page' ? <FileText size={16} aria-hidden /> : <Hash size={16} aria-hidden />}
                  <span className="cmdk-text">
                    <span className="cmdk-title">{it.content}</span>
                    {it.breadcrumbs?.length ? <span className="cmdk-crumb">{it.breadcrumbs.join(' › ')}</span> : null}
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
