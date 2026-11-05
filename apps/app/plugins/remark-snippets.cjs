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
 * A snippet with hidden code is followed by a "View full code" link to its source.
 *
 * If a snippet name is unknown the original (empty) block is left in place and
 * a warning is printed — the build never fails over a missing snippet.
 */

const fs   = require('fs')
const path = require('path')

const SNIPPETS_PATH = path.join(__dirname, '../src/data/snippets.json')
const META_PATH = path.join(__dirname, '../src/data/snippets-meta.json')

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

/** A paragraph, so it renders through the MDX `a` component and sits under the block in tabs and lists alike. */
function fullCodeLink(url) {
  return {
    type: 'paragraph',
    data: { hProperties: { className: ['pk-code-source'] } },
    children: [{ type: 'link', url, children: [{ type: 'text', value: 'View full code' }] }],
  }
}

function walk(node, type, fn) {
  if (!Array.isArray(node.children)) return
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]
    if (child.type === type) {
      const after = fn(child)
      if (after) node.children.splice(++i, 0, after)
    }
    walk(child, type, fn)
  }
}

module.exports = function remarkSnippets() {
  return (tree, file) => {
    const snippets = loadSnippets()
    const meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'))

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

      const source = meta.sources[name]
      return source?.trimmed ? fullCodeLink(meta.base + source.path) : undefined
    })
  }
}
