import { useEffect, useState } from 'react'

/** Logo + title header on integration docs. `image` names a light asset; the dark theme swaps `light` for `dark`. */
export function DocHeaderHero({ image, title }: { image?: string; title?: string }) {
  const [theme, setTheme] = useState('light')
  useEffect(() => {
    const read = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
    read()
    const o = new MutationObserver(read)
    o.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => o.disconnect()
  }, [])
  return (
    <div className="pk-hero">
      {image && <img width={88} height={88} src={image.replace('light', theme)} alt={`Logo for ${title}`} />}
      <h1>{title}</h1>
    </div>
  )
}
