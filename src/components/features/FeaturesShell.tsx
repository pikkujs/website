import { useState, type ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronRight, Menu, X } from 'lucide-react'
import { TreeNav } from '@/components/TreeNav'
import { FEATURES_URL, featurePages, featuresTree } from '@/lib/features-nav'

/** The /features section in the docs shell: the docs sidebar (and its phone sheet) beside each feature page. */
export function FeaturesShell({ children }: { children: ReactNode }) {
  const raw = useLocation({ select: (l) => l.pathname })
  const path = raw.length > 1 ? raw.replace(/\/$/, '') : raw
  const [menu, setMenu] = useState(false)
  const i = featurePages.findIndex((p) => p.url === path)
  const page = i >= 0 ? featurePages[i] : undefined
  const previous = i > 0 ? featurePages[i - 1] : undefined
  const next = i >= 0 && i < featurePages.length - 1 ? featurePages[i + 1] : undefined
  return (
    <div className="doc-shell feat-shell">
      <aside className="doc-side" aria-label="Features"><TreeNav nodes={featuresTree} path={path} /></aside>
      <div className="doc-bar">
        <Dialog.Root open={menu} onOpenChange={setMenu}>
          <Dialog.Trigger className="doc-bar-btn"><Menu size={16} aria-hidden /> Features menu</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="sheet-overlay" />
            <Dialog.Content className="sheet sheet-left" aria-describedby={undefined}>
              <div className="sheet-head"><Dialog.Title className="brand-name">Features</Dialog.Title><Dialog.Close className="nav-icon-btn" aria-label="Close menu"><X size={22} /></Dialog.Close></div>
              <div className="sheet-body"><TreeNav nodes={featuresTree} path={path} onNavigate={() => setMenu(false)} /></div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <div className="feat-main">
        {page ? (
          <nav className="crumbs feat-crumbs" aria-label="Breadcrumb">
            <span className="crumb"><Link to={FEATURES_URL}>Features</Link></span>
            <span className="crumb"><ChevronRight size={12} aria-hidden />{page.group}</span>
            <span className="crumb"><ChevronRight size={12} aria-hidden /><span aria-current="page">{page.label}</span></span>
          </nav>
        ) : null}
        {children}
        {page ? (
          <nav className="pager feat-pager" aria-label="Previous and next feature">
            {previous ? <Link to={previous.url as any} className="pager-link"><small>Previous</small><span>&larr; {previous.label}</span></Link> : <Link to={FEATURES_URL} className="pager-link"><small>Back to</small><span>&larr; All features</span></Link>}
            {next ? <Link to={next.url as any} className="pager-link pager-next"><small>Next</small><span>{next.label} &rarr;</span></Link> : <span />}
          </nav>
        ) : null}
      </div>
    </div>
  )
}
