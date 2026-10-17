import { AppWindow, BookOpen, Boxes, Database, FileJson, FlaskConical, FileText, GitCompare, KeyRound, Layers, Lightbulb, Lock, Package, Puzzle, Rocket, Scissors, Server, ShieldCheck, TriangleAlert, Workflow, Folder, type LucideIcon } from 'lucide-react'
import { WiringIcon } from '@/components/WiringIcons'

const LUCIDE: Record<string, LucideIcon> = { AppWindow, BookOpen, Boxes, Database, FileJson, FileText, FlaskConical, Folder, GitCompare, KeyRound, Layers, Lightbulb, Lock, Package, Puzzle, Rocket, Scissors, Server, ShieldCheck, TriangleAlert, Workflow }

export type DocIconSpec = string | React.ComponentType<{ size?: number }>

/** `w:http` -> the wiring icon, `l:Layers` -> a lucide icon, or an icon component. Decorative: the row's text names it. */
export function DocIcon({ icon, size = 20 }: { icon?: DocIconSpec; size?: number }) {
  if (icon && typeof icon !== 'string') { const C = icon as React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>; return <C size={size} aria-hidden /> }
  if (icon?.startsWith('w:')) return <WiringIcon wiringId={icon.slice(2)} size={size} />
  const L = LUCIDE[icon?.slice(2) ?? ''] ?? FileText
  return <L size={size} aria-hidden />
}
