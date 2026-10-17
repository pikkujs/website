import { useEffect, useState } from 'react'

export function Toc({ items }: { items: { url: string; title: any; depth: number }[] }) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const els = items.map((t) => document.getElementById(decodeURIComponent(t.url.slice(1)))).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const io = new IntersectionObserver(
      (es) => { const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (v) setActive('#' + v.target.id) },
      { rootMargin: '-80px 0px -70% 0px' },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [items])
  if (!items.length) return null
  return (
    <nav className="toc" aria-label="On this page">
      <div className="toc-title">On this page</div>
      <ul>{items.map((t) => <li key={t.url} style={{ paddingLeft: Math.max(0, t.depth - 2) * 12 }}><a href={t.url} className={active === t.url ? 'is-active' : ''}>{t.title}</a></li>)}</ul>
    </nav>
  )
}
