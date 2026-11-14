import { Pk } from '@pikku/theme-brand'
import Link from './Link'
import { footerColumns } from './nav-data'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-in">
        <div className="foot-brand">
          <Pk size={52} color="var(--color-clay)" />
          <p>Run a whole platform from one command. Open-source, TypeScript, deploy anywhere.</p>
        </div>
        {footerColumns.map((c) => (
          <nav key={c.title} aria-label={c.title} className="foot-col">
            <h2 className="foot-title">{c.title}</h2>
            <ul>{c.items.map((i) => <li key={i.label}><Link to={i.to}>{i.label}</Link></li>)}</ul>
          </nav>
        ))}
      </div>
      <div className="foot-copy">Framework MIT · CLI and Studio AGPL-3.0 · Copyright © 2020–{new Date().getFullYear()} Yasser Fadl &amp; Pikku Contributors.</div>
    </footer>
  )
}
