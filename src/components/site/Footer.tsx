import Link from './Link'
import { footerColumns } from './nav-data'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-in">
        <div className="foot-brand">
          <img src="/img/pikku-paper.svg" alt="" width={52} height={52} />
          <p>Run a whole platform from one command. Open-source, TypeScript, deploy anywhere.</p>
        </div>
        {footerColumns.map((c) => (
          <nav key={c.title} aria-label={c.title} className="foot-col">
            <h2 className="foot-title">{c.title}</h2>
            <ul>{c.items.map((i) => <li key={i.label}><Link to={i.to}>{i.label}</Link></li>)}</ul>
          </nav>
        ))}
      </div>
      <div className="foot-copy">MIT License · Copyright © 2020–{new Date().getFullYear()} Yasser Fadl &amp; Pikku Contributors.</div>
    </footer>
  )
}
