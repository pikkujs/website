import { Children, isValidElement, useEffect, useId, useState, type ReactElement, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Pre } from './CodeBlock'

export function TabItem(_: { value: string; label?: string; default?: boolean; children?: ReactNode }) { return null }

type ItemProps = { value: string; label?: string; default?: boolean; children?: ReactNode }
const KEY = (g: string) => 'tabs:' + g
const EVENT = 'pk-tabs'

/** Docusaurus-style tabs. `groupId` syncs the selection between every Tabs with that id (and remembers it). */
export function Tabs({ children, groupId, defaultValue }: { children: ReactNode; groupId?: string; defaultValue?: string }) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<ItemProps>[]
  const first = defaultValue ?? items.find((i) => i.props.default)?.props.value ?? items[0]?.props.value
  const [active, setActive] = useState(first)
  const id = useId()
  useEffect(() => {
    if (!groupId) return
    try { const v = localStorage.getItem(KEY(groupId)); if (v && items.some((i) => i.props.value === v)) setActive(v) } catch {}
    const on = (e: Event) => { const d = (e as CustomEvent).detail; if (d.groupId === groupId && items.some((i) => i.props.value === d.value)) setActive(d.value) }
    window.addEventListener(EVENT, on)
    return () => window.removeEventListener(EVENT, on)
  }, [groupId])
  const pick = (value: string) => {
    setActive(value)
    if (!groupId) return
    try { localStorage.setItem(KEY(groupId), value) } catch {}
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { groupId, value } }))
  }
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    const n = items[(i + d + items.length) % items.length]
    pick(n.props.value)
    ;(e.currentTarget.parentElement?.children[(i + d + items.length) % items.length] as HTMLElement)?.focus()
  }
  return (
    <div className="pk-tabs">
      <div role="tablist" className="pk-tablist">
        {items.map((it, i) => (
          <button key={it.props.value} role="tab" id={`${id}-t-${it.props.value}`} aria-selected={active === it.props.value} aria-controls={`${id}-p-${it.props.value}`}
            tabIndex={active === it.props.value ? 0 : -1} onKeyDown={(e) => onKey(e, i)} onClick={() => pick(it.props.value)}
            className={cn('pk-tab', active === it.props.value && 'is-active')}>{it.props.label ?? it.props.value}</button>
        ))}
      </div>
      {items.map((it) => active === it.props.value && (
        <div key={it.props.value} role="tabpanel" id={`${id}-p-${it.props.value}`} aria-labelledby={`${id}-t-${it.props.value}`} className="pk-tabpanel">{it.props.children}</div>
      ))}
    </div>
  )
}

const PMS = ['npm', 'yarn', 'pnpm', 'bun'] as const
/** ```bash npm2yarn  -> one command per package manager; the choice is shared across the site. */
export function PkgTabs(props: Record<(typeof PMS)[number], string>) {
  return (
    <Tabs groupId="package-manager">
      {PMS.map((pm) => (
        <TabItem key={pm} value={pm} label={pm}><Pre className="pk-pkg"><code>{props[pm]}</code></Pre></TabItem>
      ))}
    </Tabs>
  )
}
