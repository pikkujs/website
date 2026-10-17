import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fumadocsMdx } from 'fumadocs-mdx/vite'
import path from 'node:path'

// Builds the catalogue Worker: a second, minimal Start app (worker/) sharing the static site's components.
// It has no prerender and no docs content, so the bundle stays small.
export default defineConfig({
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  define: { 'import.meta.env.VITE_CATALOGUE_SOURCE': JSON.stringify('registry') },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    fumadocsMdx((await import('./source.config.ts')) as any),
    tailwindcss(),
    tanstackStart({ srcDirectory: 'worker', router: { routesDirectory: 'routes', generatedRouteTree: 'routeTree.gen.ts' } }),
    viteReact(),
  ],
})
