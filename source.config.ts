import { defineConfig } from 'fumadocs-mdx/config'
import { createRequire } from 'node:module'
import remarkDirective from 'remark-directive'
import { remarkAdmonitions, remarkMermaid, remarkPkgTabs } from './src/lib/remark-plugins.ts'
const require = createRequire(import.meta.url)
const remarkSnippets = require('./plugins/remark-snippets.cjs')
export default defineConfig({
  mdxOptions: {
    // Docusaurus parity: .md compiled as MDX
    format: 'mdx',
    remarkPlugins: (defaults) => [remarkSnippets, remarkDirective, remarkAdmonitions, remarkMermaid, remarkPkgTabs, ...defaults],
  },
})
