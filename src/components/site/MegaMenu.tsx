import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Link from './Link'
import { menuColumns } from './nav-data'

/** "Features" mega menu: opens on hover and on click/Enter; closes on Escape and outside click. */
export function MegaMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clear = () => { if (timer.current) clearTimeout(timer.current) }
  const onKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }, [])
  useEffect(() => {
    if (!open) return
    const out = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', out); document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('keydown', onKey) }
  }, [open, onKey])
  useEffect(() => clear, [])
  return (
    <div className="mega" ref={ref} onMouseEnter={() => { clear(); setOpen(true) }} onMouseLeave={() => { clear(); timer.current = setTimeout(() => setOpen(false), 160) }}>
      <button type="button" className="nav-link mega-trigger" aria-expanded={open} aria-haspopup="true" aria-controls="mega-panel" onClick={() => setOpen((v) => !v)}>
        Features <ChevronDown size={14} aria-hidden className={open ? 'rot' : ''} />
      </button>
      <div id="mega-panel" className={`mega-panel${open ? ' is-open' : ''}`} hidden={!open && undefined}>
        <div className="mega-grid">
          {menuColumns.map((col) => (
            <div key={col.label} className="mega-col">
              <div className="mega-label">{col.label}</div>
              {col.entries.map((e) => {
                const Icon = e.icon as any
                return (
                  <Link key={e.id} to={e.url} className="mega-item" onClick={() => setOpen(false)}>
                    <span className="mega-icon"><Icon size={18} /></span>
                    <span><span className="mega-item-label">{e.label}</span><span className="mega-item-desc">{e.description}</span></span>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
        <div className="mega-foot"><Link to="/features" onClick={() => setOpen(false)}>View all features →</Link></div>
      </div>
    </div>
  )
}
