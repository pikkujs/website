#!/usr/bin/env node
/**
 * Extracts @snippet regions from the online-shop-template source files
 * and writes them to src/data/snippets.json.
 *
 * Snippet markers in TypeScript source files:
 *   // @snippet start mySnippetName
 *   ... code ...
 *   // @snippet end mySnippetName
 *
 * Run via:  npm run sync-snippets
 *
 * Safe to run when the fabric repo is absent — just prints a warning.
 */

const fs = require('fs')
const path = require('path')

const TEMPLATE_SRC = path.resolve(
  __dirname,
  '../../fabric/templates/online-shop-template/packages/functions/src'
)
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/snippets.json')

if (!fs.existsSync(TEMPLATE_SRC)) {
  console.warn(
    `[extract-snippets] Template not found at:\n  ${TEMPLATE_SRC}\n` +
    `  Skipping — snippets.json will not be updated.`
  )
  process.exit(0)
}

// ── Recursive TS file scanner ──────────────────────────────

function findTsFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.pikku') {
      findTsFiles(full, results)
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      results.push(full)
    }
  }
  return results
}

// ── Snippet extraction ─────────────────────────────────────

function extractSnippets(content) {
  const snippets = {}
  const lines = content.split('\n')
  let currentName = null
  let currentLines = []

  for (const line of lines) {
    const startMatch = line.match(/\/\/\s*@snippet start\s+(\S+)/)
    const endMatch   = line.match(/\/\/\s*@snippet end\s+(\S+)/)

    if (startMatch) {
      currentName  = startMatch[1]
      currentLines = []
    } else if (endMatch && currentName) {
      // Strip common leading whitespace
      const nonEmpty = currentLines.filter((l) => l.trim().length > 0)
      const minIndent = nonEmpty.length
        ? Math.min(...nonEmpty.map((l) => l.match(/^(\s*)/)[1].length))
        : 0
      snippets[currentName] = currentLines
        .map((l) => l.slice(minIndent))
        .join('\n')
        .trim()
      currentName  = null
      currentLines = []
    } else if (currentName !== null) {
      currentLines.push(line)
    }
  }

  return snippets
}

// ── Main ───────────────────────────────────────────────────

const files   = findTsFiles(TEMPLATE_SRC)
const all     = {}
const origins = {} // snippet name → file path (for collision warnings)

for (const file of files) {
  const content  = fs.readFileSync(file, 'utf8')
  const snippets = extractSnippets(content)
  const rel      = path.relative(TEMPLATE_SRC, file)

  for (const [name, code] of Object.entries(snippets)) {
    if (origins[name]) {
      console.warn(`[extract-snippets] Duplicate snippet "${name}" in ${rel} (already from ${origins[name]})`)
    }
    all[name]     = code
    origins[name] = rel
  }
}

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(all, null, 2) + '\n')

const count = Object.keys(all).length
console.log(`[extract-snippets] Wrote ${count} snippet${count !== 1 ? 's' : ''} → src/data/snippets.json`)
for (const [name, file] of Object.entries(origins)) {
  console.log(`  ${name.padEnd(36)} ${file}`)
}
