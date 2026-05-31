import { useEffect, useState } from 'react'

type AccentMode = 'vivid' | 'mono'

function getStored(): AccentMode {
  if (typeof localStorage === 'undefined') return 'vivid'
  return (localStorage.getItem('pikku-accent-mode') as AccentMode) ?? 'vivid'
}

function apply(mode: AccentMode) {
  document.documentElement.dataset.accentMode = mode === 'mono' ? 'mono' : ''
  localStorage.setItem('pikku-accent-mode', mode)
}

export default function AccentToggle() {
  const [mode, setMode] = useState<AccentMode>('vivid')

  useEffect(() => {
    const stored = getStored()
    setMode(stored)
    apply(stored)
  }, [])

  function toggle() {
    const next: AccentMode = mode === 'vivid' ? 'mono' : 'vivid'
    setMode(next)
    apply(next)
  }

  const isVivid = mode === 'vivid'

  return (
    <button
      className="navbar__accent-toggle"
      onClick={toggle}
      title={isVivid ? 'Switch to plain (mono)' : 'Switch to colorful (vivid)'}
      aria-label={isVivid ? 'Switch to plain' : 'Switch to colorful'}
    >
      {isVivid ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ifm-color-primary)' }}>
          <circle cx="12" cy="12" r="3" />
          <path d="M3 12h1M20 12h1M12 3v1M12 20v1M5.6 5.6l.7.7M17.7 17.7l.7.7M5.6 18.4l.7-.7M17.7 6.3l.7-.7" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ifm-font-color-secondary)' }}>
          <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.15" />
          <circle cx="12" cy="12" r="5" />
        </svg>
      )}
    </button>
  )
}
