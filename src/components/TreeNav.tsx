import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { WiringIcon } from '@/components/WiringIcons'

// frontmatter/meta.json `icon: "http,websocket"` -> wiring icons (replaces customProps.wirings)
const Icons = ({ icon }: { icon?: any }) =>
  typeof icon === 'string' ? <span className="tn-icons">{icon.split(',').map((w) => <WiringIcon key={w} wiringId={w} size={13} />)}</span> : null

const holds = (n: any, path: string): boolean =>
  n.type === 'page' ? n.url === path : n.index?.url === path || n.children.some((c: any) => holds(c, path))

function Folder({ n, path, onNavigate }: { n: any; path: string; onNavigate?: () => void }) {
  const active = holds(n, path)
  const [open, setOpen] = useState(active)
  useEffect(() => { if (active) setOpen(true) }, [active])
  return (
    <li className="tn-folder">
      <div className={`tn-row${n.index?.url === path ? ' is-active' : ''}`}>
        {n.index ? <Link to={n.index.url as any} className="tn-link" onClick={onNavigate}><Icons icon={n.icon} />{n.name}</Link> : <button type="button" className="tn-link tn-label" onClick={() => setOpen(!open)}><Icons icon={n.icon} />{n.name}</button>}
        <button type="button" className="tn-chev" aria-label={`${open ? 'Collapse' : 'Expand'} ${n.name}`} aria-expanded={open} onClick={() => setOpen(!open)}>
          <ChevronRight size={14} className={open ? 'is-open' : ''} />
        </button>
      </div>
      {open && <div className="tn-sub"><TreeNav nodes={n.children} path={path} onNavigate={onNavigate} /></div>}
    </li>
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
