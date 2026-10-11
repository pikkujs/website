import { Link } from '@tanstack/react-router'
import { WiringIcon } from '@/components/shims/WiringIcons'
// frontmatter/meta.json `icon: "http,websocket"` -> wiring icons (replaces customProps.wirings)
const Icons = ({ icon }: { icon?: any }) => typeof icon === 'string' ? <span className="mr-1 inline-flex gap-0.5 align-middle">{icon.split(',').map((w) => <WiringIcon key={w} wiringId={w} size={13} />)}</span> : null
export function TreeNav({ nodes, path }: { nodes: any[]; path: string }) {
  return <ul className="space-y-0.5 text-sm">{nodes.map((n, i) => {
    if (n.type === 'page') return <li key={i}><Link to={n.url} className={n.url === path ? 'font-semibold text-accent' : ''}><Icons icon={n.icon} />{n.name}</Link></li>
    if (n.type === 'folder') return <li key={i}><details open={path.startsWith((n.index?.url ?? '#') + '/') || n.index?.url === path || undefined}><summary className="cursor-pointer font-semibold"><Icons icon={n.icon} />{n.index ? <Link to={n.index.url}>{n.name}</Link> : n.name}</summary><div className="ml-3 border-l border-border pl-2"><TreeNav nodes={n.children} path={path} /></div></details></li>
    return <li key={i} className="mt-2 text-xs uppercase">{n.name}</li>
  })}</ul>
}
