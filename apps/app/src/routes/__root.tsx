/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Outlet, Scripts, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { TanstackProvider } from 'fumadocs-core/framework/tanstack' // headless provider (no fumadocs-ui)
import '../styles.css'
import { SvgDefs, GOOGLE_FONTS_HREF } from '@pikku/theme-brand'
import { Navbar } from '@/components/site/Navbar'
import { Footer } from '@/components/site/Footer'
import { NotFound } from '@/components/site/NotFound'
import { pageHead } from '@/lib/seo'
import { listenForClicks, trackPageView } from '@/lib/site-analytics'

// Runs before first paint: light by default, remembered choice wins. No flash.
const THEME_INIT = `try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}`

export const Route = createRootRoute({
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
      ],
    }
  },
  notFoundComponent: NotFound,
  component: Root,
})

function Analytics() {
  const router = useRouter()
  useEffect(() => {
    listenForClicks()
    trackPageView(location.pathname) // first view of the page load (a no-op unless VITE_SITE_ANALYTICS_URL is set)
    return router.subscribe('onResolved', ({ toLocation, fromLocation }) => {
      if (toLocation.pathname === fromLocation?.pathname) return
      trackPageView(toLocation.pathname)
    })
  }, [router])
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
