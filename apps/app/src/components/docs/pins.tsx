import { useCallback, useEffect, useState } from 'react'
import { Pin, PinOff } from 'lucide-react'

export type Pinned = { url: string; title: string }
const KEY = 'pikku:docs-pins'
const EVT = 'pikku:pins'

const read = (): Pinned[] => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v.filter((p) => p && typeof p.url === 'string' && typeof p.title === 'string').slice(0, 20) : []
  } catch { return [] }
}
const write = (pins: Pinned[]) => {
  try { localStorage.setItem(KEY, JSON.stringify(pins)) } catch { /* storage blocked: pins just don't persist */ }
  window.dispatchEvent(new Event(EVT))
}

/** Per-viewer pinned pages. Empty on the server and on first paint, so SSR and hydration agree. */
export function usePins() {
  const [pins, setPins] = useState<Pinned[]>([])
  useEffect(() => {
    const sync = () => setPins(read())
    sync()
    window.addEventListener(EVT, sync)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener('storage', sync) }
  }, [])
  const toggle = useCallback((p: Pinned) => { const cur = read(); write(cur.some((x) => x.url === p.url) ? cur.filter((x) => x.url !== p.url) : [...cur, p]) }, [])
  return { pins, toggle }
}

export function PinButton({ url, title }: { url: string; title: string }) {
  const { pins, toggle } = usePins()
  const on = pins.some((p) => p.url === url)
  return (
    <button type="button" className={`pin-btn${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => toggle({ url, title })}>
      {on ? <PinOff size={14} aria-hidden /> : <Pin size={14} aria-hidden />}
      {on ? 'Unpin from sidebar' : 'Pin to sidebar'}
    </button>
  )
}
