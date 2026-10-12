import { Link } from '@tanstack/react-router'
import { Blob } from '@pikku/theme-brand'

/** 404. GitHub Pages serves the prerendered copy (dist/client/404.html) for any unknown path. */
export function NotFound() {
  return (
    <section className="nf">
      <title>Page not found | Pikku</title>
      <Blob pose="ask" size={120} color="#c2410c" className="mx-auto" />
      <p className="nf-hand">lost in the wiring?</p>
      <h1 className="nf-code">404</h1>
      <p className="nf-copy">That page isn't wired to anything. It may have moved when the site did.</p>
      <div className="nf-actions">
        <Link to="/" className="btn-ink">Back home</Link>
        <Link to={"/docs" as any} className="btn-line">Browse the docs</Link>
        <Link to={"/getting-started" as any} className="btn-line">Getting started</Link>
      </div>
      <p className="nf-hint">Press <kbd>⌘K</kbd> to search the docs.</p>
    </section>
  )
}
