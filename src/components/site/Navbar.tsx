import { useEffect, useState } from 'react'
import { Link as RLink, useRouterState } from '@tanstack/react-router'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, Search, X } from 'lucide-react'
import { BlobMark } from '@pikku/theme-brand'
import { ThemeToggle } from './ThemeToggle'
import { MegaMenu } from './MegaMenu'
import { SearchDialog } from './SearchDialog'
import Link from './Link'
import { menuColumns, primaryLinks } from './nav-data'

const GitHub = () => (
  <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>
)

export function Navbar() {
  const path = useRouterState({ select: (s) => s.location.pathname })
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  useEffect(() => setMenu(false), [path])
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch((v) => !v) } }
    const open = () => setSearch(true)
    window.addEventListener('keydown', k)
    window.addEventListener('pikku:search', open)
    return () => { window.removeEventListener('keydown', k); window.removeEventListener('pikku:search', open) }
  }, [])
  const onDev = path === '/developers'
  const active = (to: string) => path === to || path.startsWith(to + '/')
  return (
    <header className="site-nav">
      <nav className="site-nav-in" aria-label="Main">
        <RLink to="/" className="brand" aria-label="Pikku home">
          <BlobMark size={40} color="var(--color-clay)" className="brand-logo" />
          <span className="brand-name">pikku</span>
        </RLink>
        <div className="nav-links">
          <MegaMenu />
          {primaryLinks.map((l) => <RLink key={l.to} to={l.to as any} className={`nav-link${active(l.to) ? ' is-active' : ''}`} aria-current={active(l.to) ? 'page' : undefined}>{l.label}</RLink>)}
        </div>
        <div className="nav-right">
          <RLink to={(onDev ? '/' : '/developers') as any} className="navbar-dev-pill">{onDev ? '← Platform overview' : 'For developers →'}</RLink>
          <button type="button" className="nav-search" onClick={() => setSearch(true)} aria-label="Search the docs (Ctrl or Cmd K)">
            <Search size={16} aria-hidden /><span className="nav-search-label">Search</span><kbd>⌘K</kbd>
          </button>
          <a className="nav-icon-btn nav-gh" href="https://github.com/pikkujs/pikku" target="_blank" rel="noopener noreferrer" aria-label="Pikku on GitHub"><GitHub /></a>
          <ThemeToggle />
          <button type="button" className="nav-icon-btn nav-burger" onClick={() => setMenu(true)} aria-label="Open menu"><Menu size={22} /></button>
        </div>
      </nav>
      <SearchDialog open={search} onOpenChange={setSearch} />
      <Dialog.Root open={menu} onOpenChange={setMenu}>
        <Dialog.Portal>
          <Dialog.Overlay className="sheet-overlay" />
          <Dialog.Content className="sheet" aria-describedby={undefined}>
            <div className="sheet-head">
              <Dialog.Title className="brand-name">Menu</Dialog.Title>
              <Dialog.Close className="nav-icon-btn" aria-label="Close menu"><X size={22} /></Dialog.Close>
            </div>
            <div className="sheet-body">
              <button type="button" className="nav-search sheet-search" onClick={() => { setMenu(false); setSearch(true) }}><Search size={16} aria-hidden /> Search the docs</button>
              <RLink to={(onDev ? '/' : '/developers') as any} className="navbar-dev-pill sheet-pill">{onDev ? '← Platform overview' : 'For developers →'}</RLink>
              <ul className="sheet-list">
                {primaryLinks.map((l) => <li key={l.to}><RLink to={l.to as any}>{l.label}</RLink></li>)}
                <li><a href="https://pikkufabric.com" target="_blank" rel="noopener noreferrer">Fabric ↗</a></li>
              </ul>
              {menuColumns.map((c) => (
                <details key={c.label} className="sheet-group">
                  <summary>{c.label}</summary>
                  <ul>{c.entries.map((e) => <li key={e.id}><Link to={e.url}>{e.label}</Link></li>)}</ul>
                </details>
              ))}
              <Link to="/features" className="sheet-all">View all features →</Link>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  )
}
