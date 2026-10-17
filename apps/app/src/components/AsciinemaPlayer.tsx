import { useEffect, useRef } from 'react'

const sessions = { installing: '/terminals/install.cast' } as const

/** Terminal recording player. Client-only: the player and its CSS are loaded after mount. */
export function AsciinemaPlayer({ type, ...options }: { type: keyof typeof sessions } & Record<string, unknown>) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let instance: { dispose(): void } | undefined
    let live = true
    Promise.all([import('asciinema-player'), import('asciinema-player/dist/bundle/asciinema-player.css')]).then(([p]) => {
      if (live && ref.current) instance = (p as any).create(sessions[type], ref.current, options)
    })
    return () => { live = false; instance?.dispose() }
  }, [type])
  return <div ref={ref} className="pk-asciinema" style={{ minHeight: 120 }} />
}
