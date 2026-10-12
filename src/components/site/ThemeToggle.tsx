import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

/** Light by default; the choice is remembered. <html data-theme> is set before paint by the inline script in __root. */
export function ThemeToggle() {
  const [dark, setDark] = useState(false)
  useEffect(() => { setDark(document.documentElement.dataset.theme === 'dark') }, [])
  const flip = () => {
    const next = !dark
    setDark(next)
    document.documentElement.dataset.theme = next ? 'dark' : 'light'
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch {}
  }
  return (
    <button type="button" className="nav-icon-btn" onClick={flip} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} title="Toggle theme">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
