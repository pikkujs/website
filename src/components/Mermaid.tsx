import { useEffect, useId, useState } from 'react'

/** Mermaid diagrams render in the browser; the library never enters the SSR/Worker bundle. */
export function Mermaid({ chart }: { chart: string }) {
  const id = 'm' + useId().replace(/[^a-z0-9]/gi, '')
  const [svg, setSvg] = useState('')
  useEffect(() => {
    let live = true
    const draw = () => import('mermaid').then(async ({ default: mermaid }) => {
      const dark = document.documentElement.dataset.theme === 'dark'
      mermaid.initialize({
        startOnLoad: false, theme: 'base', fontFamily: 'Work Sans Variable, sans-serif',
        themeVariables: dark
          ? { background: '#15110d', primaryColor: '#2e1d12', primaryTextColor: '#f1e8d6', primaryBorderColor: '#ec8a4f', lineColor: '#b3a690', secondaryColor: '#1d1812', tertiaryColor: '#15110d', textColor: '#d9cfba' }
          : { background: '#f4ecdd', primaryColor: '#f1d9c4', primaryTextColor: '#2b2219', primaryBorderColor: '#c2410c', lineColor: '#5f5143', secondaryColor: '#ebdfc8', tertiaryColor: '#fbf6ec', textColor: '#3d3125' },
      })
      const r = await mermaid.render(id, chart)
      if (live) setSvg(r.svg)
    }).catch((e) => console.error('mermaid', e))
    draw()
    const o = new MutationObserver(draw)
    o.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => { live = false; o.disconnect() }
  }, [chart])
  return <div className="pk-mermaid" data-mermaid role="img" aria-label="Diagram" dangerouslySetInnerHTML={{ __html: svg }} />
}
