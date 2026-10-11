import { Link } from '@tanstack/react-router'

/** 404. Static hosting serves this for any unknown path (wrangler not_found_handling "404-page"). */
export function NotFound() {
  return (
    <section className="nf">
      <title>Page not found | Pikku</title>
      <p className="nf-hand">lost in the wiring?</p>
      <h1 className="nf-code">404</h1>
      <p className="nf-copy">That page isn't wired to anything. It may have moved when the site did.</p>
      <div className="nf-actions">
        <Link to="/" className="btn-primary">Back home</Link>
        <Link to={"/docs" as any} className="btn-ghost">Browse the docs</Link>
        <Link to={"/getting-started" as any} className="btn-ghost">Getting started</Link>
      </div>
      <p className="nf-hint">Press <kbd>⌘K</kbd> to search the docs.</p>
    </section>
  )
}
