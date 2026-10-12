import { Link } from '@tanstack/react-router'
import { ArrowRight, Search } from 'lucide-react'
import { HubRow, HubSection } from './HubRow'
import { DocIcon } from './DocIcon'
import type { HubData, Hue } from '@/lib/docs-hub'

export const openSearch = () => window.dispatchEvent(new Event('pikku:search'))

const START = [
  { n: 1, t: 'Create your project' },
  { n: 2, t: 'Start the whole platform' },
  { n: 3, t: 'Write a function, wire it up' },
  { n: 4, t: 'Ship it' },
]
const HUES: Hue[] = ['clay', 'moss', 'slate', 'ochre', 'rose']

/** The /docs landing: lead header, jump-to-page pill, one start-here card, grouped rows, task questions. */
export function DocsHub({ hub }: { hub: HubData }) {
  return (
    <div className="hub">
      <header className="hub-lead">
        <p className="hub-crumb">Documentation</p>
        <h1 className="doc-title">Pikku documentation</h1>
        <p className="hub-sub">Guides, references and API docs. Follow the path below, or jump straight to a page.</p>
      </header>

      <button type="button" className="hub-search" onClick={openSearch}>
        <Search size={18} aria-hidden />
        <span>Jump to a page</span>
        <kbd>⌘K</kbd>
      </button>
      <p className="hub-hint">Press ⌘K (or Ctrl K) from any page to search guides, wiring, deploy targets and the CLI.</p>

      <section className="hub-start" aria-labelledby="hub-start-h">
        <div className="hub-start-body">
          <p className="hub-eyebrow">Start here</p>
          <h2 id="hub-start-h">From an empty folder to a running platform</h2>
          <ol className="hub-steps">{START.map((s) => <li key={s.n}><span>{s.n}</span>{s.t}</li>)}</ol>
          <Link to="/getting-started" className="hub-btn">Open the guide <ArrowRight size={16} aria-hidden /></Link>
        </div>
        <svg className="hub-start-art" viewBox="0 0 320 240" aria-hidden focusable="false">
          <circle cx="250" cy="40" r="110" className="a1" /><circle cx="60" cy="200" r="90" className="a2" /><circle cx="190" cy="140" r="52" className="a3" /><circle cx="285" cy="170" r="9" className="a4" />
        </svg>
      </section>

      <section className="hub-section" aria-labelledby="hub-wires">
        <h2 id="hub-wires" className="hub-h">Pick a wire</h2>
        <p className="hub-blurb">One function, many ways in. Choose how yours is called.</p>
        <ul className="hub-wires">
          {hub.wires.map((w) => (
            <li key={w.url}><Link to={w.url as any} className="hub-wire"><DocIcon icon={w.icon ? `w:${w.icon.split(',')[0]}` : 'l:FileText'} size={18} /><span>{w.title}</span></Link></li>
          ))}
        </ul>
      </section>

      {hub.groups.map((g) => (
        <HubSection key={g.id} id={g.id} title={g.title} blurb={g.blurb}>
          {g.rows.map((r) => <HubRow key={r.url} url={r.url} title={r.title} text={r.description} icon={r.icon} hue={r.hue} />)}
        </HubSection>
      ))}

      <HubSection id="questions" title="Questions people ask" blurb="Each one goes to the page that answers it.">
        {hub.questions.map((r) => <HubRow key={r.url + r.q} url={r.url} title={r.q} text={r.description} icon={r.icon} hue={r.hue} small />)}
      </HubSection>
    </div>
  )
}
