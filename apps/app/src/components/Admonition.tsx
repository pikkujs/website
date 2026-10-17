import type { ReactNode } from 'react'
import { Info, Lightbulb, TriangleAlert, OctagonAlert, StickyNote } from 'lucide-react'

const ADM = {
  note: { icon: StickyNote, label: 'Note', kind: 'note' },
  info: { icon: Info, label: 'Info', kind: 'info' },
  tip: { icon: Lightbulb, label: 'Tip', kind: 'tip' },
  warning: { icon: TriangleAlert, label: 'Warning', kind: 'warning' },
  caution: { icon: TriangleAlert, label: 'Caution', kind: 'warning' },
  danger: { icon: OctagonAlert, label: 'Danger', kind: 'danger' },
} as const

export function Admonition({ type = 'note', title, children }: { type?: keyof typeof ADM; title?: string; children?: ReactNode }) {
  const a = ADM[type] ?? ADM.note
  const Icon = a.icon
  return (
    <div className={`pk-adm pk-adm--${a.kind}`} data-admonition={type} role="note">
      <div className="pk-adm-title"><Icon size={16} aria-hidden /> {title ?? a.label}</div>
      <div className="pk-adm-body">{children}</div>
    </div>
  )
}
