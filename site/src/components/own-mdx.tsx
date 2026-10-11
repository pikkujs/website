import { useEffect, useId, useState } from 'react'
import { Link as RLink } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Info, Lightbulb, TriangleAlert, OctagonAlert, StickyNote } from 'lucide-react'

const ADM: Record<string, { icon: any; cls: string; label: string }> = {
  note: { icon: StickyNote, cls: 'border-zinc-400 bg-zinc-500/10', label: 'Note' },
  info: { icon: Info, cls: 'border-sky-500 bg-sky-500/10', label: 'Info' },
  tip: { icon: Lightbulb, cls: 'border-emerald-500 bg-emerald-500/10', label: 'Tip' },
  warning: { icon: TriangleAlert, cls: 'border-amber-500 bg-amber-500/10', label: 'Warning' },
  caution: { icon: TriangleAlert, cls: 'border-amber-500 bg-amber-500/10', label: 'Caution' },
  danger: { icon: OctagonAlert, cls: 'border-red-500 bg-red-500/10', label: 'Danger' },
}
export function Admonition({ type, title, children }: any) {
  const a = ADM[type] ?? ADM.note
  const Icon = a.icon
  return (
    <div className={cn('my-5 rounded-md border-l-4 px-4 py-3', a.cls)} data-admonition={type}>
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide"><Icon size={16} />{title ?? a.label}</div>
      <div className="[&>p:last-child]:mb-0">{children}</div>
    </div>
  )
}

export function PkgTabs(props: Record<'npm' | 'yarn' | 'pnpm' | 'bun', string>) {
  const [tab, setTab] = useState<'npm' | 'yarn' | 'pnpm' | 'bun'>('npm')
  useEffect(() => { try { const v = localStorage.getItem('pm'); if (v && v in props) setTab(v as any) } catch {} }, [])
  const pick = (t: any) => { setTab(t); try { localStorage.setItem('pm', t) } catch {} }
  return (
    <div className="my-5 overflow-hidden rounded-md border border-border">
      <div role="tablist" className="flex gap-1 border-b border-border bg-muted px-2">
        {(['npm', 'yarn', 'pnpm', 'bun'] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => pick(t)}
            className={cn('px-3 py-1.5 text-sm', tab === t ? 'border-b-2 border-primary font-semibold' : 'text-muted-foreground')}>{t}</button>
        ))}
      </div>
      <pre className="m-0 overflow-x-auto bg-transparent p-4 text-sm"><code>{props[tab]}</code></pre>
    </div>
  )
}

export function Mermaid({ chart }: { chart: string }) {
  const id = 'm' + useId().replace(/[^a-z0-9]/gi, '')
  const [svg, setSvg] = useState('')
  useEffect(() => {
    let live = true
    import('mermaid').then(async ({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default' })
      const r = await mermaid.render(id, chart)
      if (live) setSvg(r.svg)
    }).catch((e) => console.error('mermaid', e))
    return () => { live = false }
  }, [chart])
  return <div className="my-5 flex justify-center" data-mermaid dangerouslySetInnerHTML={{ __html: svg }} >{undefined}</div>
}

export function DocHeaderHero({ title, image }: { title?: string; image?: string }) {
  return (
    <header className="mb-8 flex items-center gap-4">
      {image && <img src={image} alt="" className="h-14 w-14" />}
      <h1 className="m-0 text-4xl font-bold">{title}</h1>
    </header>
  )
}
export const AIDisclaimer = () => null
export const AsciinemaPlayer = () => <div className="text-sm text-muted-foreground">[asciinema player]</div>

function A({ href = '', children, ...p }: any) {
  if (href.startsWith('/') && !href.startsWith('//')) {
    return <RLink to={href as any} {...p}>{children}</RLink>
  }
  const ext = /^https?:/.test(href)
  return <a href={href} {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})} {...p}>{children}</a>
}

export const mdxComponents = { Admonition, PkgTabs, Mermaid, DocHeaderHero, AIDisclaimer, AsciinemaPlayer, a: A }
export const Prose = ({ children }: any) => <div className="prose-pikku">{children}</div>
