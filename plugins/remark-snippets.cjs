/**
 * remark-snippets — injects code from snippets.json into fenced code blocks.
 *
 * Usage in Markdown / MDX:
 *
 *   ```ts @snippet listCategories
 *   ```
 *
 * The meta string `@snippet <name>` is replaced with the snippet's code and
 * the `@snippet …` token is removed from the meta so Docusaurus never sees it.
 *
 * If a snippet name is unknown the original (empty) block is left in place and
 * a warning is printed — the build never fails over a missing snippet.
 */

const fs   = require('fs')
const path = require('path')

const SNIPPETS_PATH = path.join(__dirname, '../src/data/snippets.json')

let _cache = null

function loadSnippets() {
  if (_cache) return _cache
  if (!fs.existsSync(SNIPPETS_PATH)) {
    console.warn(
      '[remark-snippets] src/data/snippets.json not found.\n' +
      '  Run `npm run sync-snippets` to generate it from the template.'
    )
    _cache = {}
    return _cache
  }
  _cache = JSON.parse(fs.readFileSync(SNIPPETS_PATH, 'utf8'))
  return _cache
}

function walk(node, type, fn) {
  if (node.type === type) fn(node)
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, type, fn)
  }
}

module.exports = function remarkSnippets() {
  return (tree, file) => {
    const snippets = loadSnippets()

    walk(tree, 'code', (node) => {
      if (!node.meta || !node.meta.includes('@snippet')) return

      const match = node.meta.match(/@snippet\s+(\S+)/)
      if (!match) return

      const name = match[1]

      if (Object.prototype.hasOwnProperty.call(snippets, name)) {
        node.value = snippets[name]
      } else {
        const src = file?.path ?? 'unknown'
        console.warn(`[remark-snippets] Unknown snippet "${name}" referenced in ${src}`)
      }

      // Always strip @snippet token so Docusaurus never renders it as meta
      node.meta = node.meta.replace(/@snippet\s+\S+/, '').trim() || null
    })
  }
}
