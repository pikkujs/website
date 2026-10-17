import { useEffect, useState } from 'react'
/** Current colour mode, kept in sync with <html data-theme>. */
export function useColorMode() {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    const read = () => setMode(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
    read()
    const o = new MutationObserver(read)
    o.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => o.disconnect()
  }, [])
  return { colorMode: mode, isDarkTheme: mode === 'dark' }
}
