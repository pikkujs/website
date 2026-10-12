import { useEffect, useState } from 'react'
import { Pin } from 'lucide-react'
import { usePins } from '@/components/docs/pins'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { WiringIcon } from '@/components/WiringIcons'

// frontmatter/meta.json `icon: "http,websocket"` -> wiring icons (replaces customProps.wirings)
const Icons = ({ icon }: { icon?: any }) =>
  typeof icon === 'string' ? <span className="tn-icons">{icon.split(',').map((w) => <WiringIcon key={w} wiringId={w} size={13} />)}</span> : null

const OPEN_KEY = 'pikku:docs-open'
const remembered = (): string[] => { try { const v = JSON.parse(localStorage.getItem(OPEN_KEY) || '[]'); return Array.isArray(v) ? v : [] } catch { return [] } }
const remember = (name: string, open: boolean) => { try { const cur = remembered().filter((x) => x !== name); localStorage.setItem(OPEN_KEY, JSON.stringify(open ? [...cur, name] : cur)) } catch { /* private mode */ } }

const holds = (n: any, path: string): boolean =>
  n.type === 'page' ? n.url === path : n.index?.url === path || n.children.some((c: any) => holds(c, path))

function Folder({ n, path, onNavigate }: { n: any; path: string; onNavigate?: () => void }) {
  const active = holds(n, path)
  const key = String(n.index?.url ?? n.name)
  const [open, setOpen] = useState(active)
  // restore what the reader left open (after mount, so the server HTML and first paint agree)
  useEffect(() => { if (!active && remembered().includes(key)) setOpen(true) }, [active, key])
  useEffect(() => { if (active) setOpen(true) }, [active])
  const toggle = () => { const v = !open; setOpen(v); remember(key, v) }
  return (
    <li className="tn-folder">
      <div className={`tn-row${n.index?.url === path ? ' is-active' : ''}`}>
        {n.index ? <Link to={n.index.url as any} className="tn-link" onClick={onNavigate}><Icons icon={n.icon} />{n.name}</Link> : <button type="button" className="tn-link tn-label" onClick={toggle}><Icons icon={n.icon} />{n.name}</button>}
        <button type="button" className="tn-chev" aria-label={`${open ? 'Collapse' : 'Expand'} ${n.name}`} aria-expanded={open} onClick={toggle}>
          <ChevronRight size={14} className={open ? 'is-open' : ''} />
        </button>
      </div>
      {open && <div className="tn-sub"><TreeNav nodes={n.children} path={path} onNavigate={onNavigate} /></div>}
    </li>
  )
}

/** Pages the reader pinned, shown above the tree. Renders nothing until there is one. */
export function PinnedNav({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  const { pins } = usePins()
  if (!pins.length) return null
  return (
    <div className="tn-pinned">
      <p className="tn-sep tn-sep-top"><Pin size={11} aria-hidden /> Pinned</p>
      <ul className="tn">{pins.map((p) => <li key={p.url}><Link to={p.url as any} className={`tn-row tn-link${p.url === path ? ' is-active' : ''}`} aria-current={p.url === path ? 'page' : undefined} onClick={onNavigate}>{p.title}</Link></li>)}</ul>
    </div>
  )
}

export function TreeNav({ nodes, path, onNavigate }: { nodes: any[]; path: string; onNavigate?: () => void }) {
  return (
    <ul className="tn">
      {nodes.map((n, i) => {
        if (n.type === 'page') return <li key={i}><Link to={n.url as any} className={`tn-row tn-link${n.url === path ? ' is-active' : ''}`} aria-current={n.url === path ? 'page' : undefined} onClick={onNavigate}><Icons icon={n.icon} />{n.name}</Link></li>
        if (n.type === 'folder') return <Folder key={i} n={n} path={path} onNavigate={onNavigate} />
        return <li key={i} className="tn-sep">{n.name}</li>
      })}
    </ul>
  )
}
