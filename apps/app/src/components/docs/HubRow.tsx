import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { DocIcon } from './DocIcon'
import type { Hue } from '@/lib/docs-hub'

/** One row of a hub card: coloured icon tile, bold title, one line of text, chevron. */
export function HubRow({ url, title, text, icon, hue, aside, small }: { url: string; title: string; text?: string; icon?: string; hue: Hue; aside?: string; small?: boolean }) {
  return (
    <Link to={url as any} className={`hub-row${small ? ' hub-row-sm' : ''}`}>
      <span className="hub-tile" data-hue={hue}><DocIcon icon={icon} size={small ? 17 : 20} /></span>
      <span className="hub-text">
        <b>{title}</b>
        {text ? <small>{text}</small> : null}
      </span>
      {aside ? <span className="hub-aside">{aside}</span> : null}
      <ChevronRight size={18} className="hub-chev" aria-hidden />
    </Link>
  )
}

export function HubSection({ id, title, blurb, children }: { id: string; title: string; blurb?: string; children: React.ReactNode }) {
  return (
    <section className="hub-section" aria-labelledby={`hub-${id}`}>
      <h2 id={`hub-${id}`} className="hub-h">{title}</h2>
      {blurb ? <p className="hub-blurb">{blurb}</p> : null}
      <div className="hub-card">{children}</div>
    </section>
  )
}
