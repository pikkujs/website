import { useEffect, useState, type ReactNode } from 'react'
/** Renders children only after hydration (they may touch window/document). */
export default function BrowserOnly({ children, fallback = null }: { children: () => ReactNode; fallback?: ReactNode }) {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  return <>{ready ? children() : fallback}</>
}
