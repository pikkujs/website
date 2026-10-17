// Generates src/routeTree.gen.ts without a full vite build, so `tsc` works on a clean checkout.
import { Generator, getConfig } from '@tanstack/router-generator'
const root = process.cwd()
const config = getConfig({ target: 'react', routesDirectory: './src/routes', generatedRouteTree: './src/routeTree.gen.ts', autoCodeSplitting: false }, root)
await new Generator({ config, root }).run()
console.log('route tree generated')
// Same module augmentation the Start vite plugin appends after generating.
import fs from 'node:fs'
const f = 'src/routeTree.gen.ts'
let s = fs.readFileSync(f, 'utf8')
if (!s.includes("declare module '@tanstack/react-start'")) {
  s += `\nimport type { getRouter } from './router.tsx'\nimport type { createStart } from '@tanstack/react-start'\ndeclare module '@tanstack/react-start' {\n  interface Register {\n    ssr: true\n    router: Awaited<ReturnType<typeof getRouter>>\n  }\n}\n`
  fs.writeFileSync(f, s)
}
