import type { ImgHTMLAttributes } from 'react'
/** Both variants render; CSS shows the one matching the theme (no flash, no JS). */
export default function ThemedImage({ sources, className, ...p }: { sources: { light: string; dark: string } } & ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <>
      <img {...p} src={sources.light} className={`${className ?? ''} themed-img-light`} />
      <img {...p} src={sources.dark} className={`${className ?? ''} themed-img-dark`} alt={p.alt ?? ''} aria-hidden />
    </>
  )
}
