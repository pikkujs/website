import type { ReactNode } from 'react'
/** Pages render inside the root layout (navbar, footer). Meta lives in each route's head(). */
export default function Layout({ children }: { children?: ReactNode; title?: string; description?: string; wrapperClassName?: string; noFooter?: boolean }) {
  return <>{children}</>
}
