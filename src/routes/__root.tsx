/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Outlet, Scripts, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { TanstackProvider } from 'fumadocs-core/framework/tanstack' // headless provider (no fumadocs-ui)
import '../styles.css'
import { SvgDefs, GOOGLE_FONTS_HREF } from '@pikku/theme-brand'
import { Navbar } from '@/components/site/Navbar'
import { Footer } from '@/components/site/Footer'
import { NotFound } from '@/components/site/NotFound'
import { GA_ID, pageHead } from '@/lib/seo'

// Runs before first paint: light by default, remembered choice wins. No flash.
const THEME_INIT = `try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}`
// Production only, after load, so analytics never competes with first render.
const GA_BOOT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');window.addEventListener('load',function(){setTimeout(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(s)},800)})`

export const rootOptions: NonNullable<Parameters<typeof createRootRoute>[0]> = {
  head: () => {
    const base = pageHead({ path: '/' })
    return {
      meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { name: 'theme-color', content: '#f4ecdd' }, ...base.meta.filter((m: any) => !m.title)],
      links: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        { rel: 'stylesheet', href: GOOGLE_FONTS_HREF },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', href: '/img/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/favicon-32x32.png' },
        { rel: 'apple-touch-icon', href: '/img/apple-touch-icon.png' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Pikku Blog', href: '/blog/rss.xml' },
        { rel: 'alternate', type: 'application/atom+xml', title: 'Pikku Blog', href: '/blog/atom.xml' },
      ],
      scripts: [
        { children: THEME_INIT },
        ...(import.meta.env.PROD ? [{ children: `if(location.hostname==='pikku.dev'||location.hostname==='www.pikku.dev'){${GA_BOOT}}` }] : []),
      ],
    }
  },
  notFoundComponent: NotFound,
  component: Root,
}

export const Route = createRootRoute(rootOptions)

function Analytics() {
  const router = useRouter()
  useEffect(() => router.subscribe('onResolved', ({ toLocation, fromLocation }) => {
    const w = window as any
    if (typeof w.gtag === 'function' && toLocation.pathname !== fromLocation?.pathname) w.gtag('config', GA_ID, { page_path: toLocation.pathname })
  }), [router])
  return null
}

function Root() {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head><HeadContent /></head>
      <body>
        <SvgDefs />
        <a href="#main" className="skip-link">Skip to content</a>
        <TanstackProvider>
          <Navbar />
          <main id="main" tabIndex={-1}><Outlet /></main>
          <Footer />
          <Analytics />
        </TanstackProvider>
        <Scripts />
      </body>
    </html>
  )
}
