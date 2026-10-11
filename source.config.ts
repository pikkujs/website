import { defineConfig } from 'fumadocs-mdx/config'
import { createRequire } from 'node:module'
import remarkDirective from 'remark-directive'
import { remarkAdmonitions, remarkMermaid, remarkPkgTabs } from './src/lib/remark-plugins.ts'
import { paperLight, paperDark } from './plugins/shiki-themes.mjs'
const require = createRequire(import.meta.url)
const remarkSnippets = require('./plugins/remark-snippets.cjs')
export default defineConfig({
  mdxOptions: {
    // all content is .mdx (Docusaurus compiled .md as MDX; fumadocs picks the format from the extension)
    // Shiki runs at compile time only; dual themes switch via --shiki-light/--shiki-dark
    rehypeCodeOptions: { themes: { light: paperLight, dark: paperDark }, defaultColor: false },
    remarkPlugins: (defaults) => [remarkSnippets, remarkDirective, remarkAdmonitions, remarkMermaid, remarkPkgTabs, ...defaults],
  },
})
