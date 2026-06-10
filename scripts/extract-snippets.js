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
const { execSync } = require('child_process')

const SHOP_REPO_SSH   = 'git@github.com:pikkujs/template-online-shop.git'
const SHOP_REPO_HTTPS = 'https://github.com/pikkujs/template-online-shop.git'
const CLONED_DIR      = path.resolve(__dirname, '../.template-online-shop')

// Prettier binary — prefer fabric monorepo, then website node_modules
const PRETTIER_BIN = [
  path.resolve(__dirname, '../../fabric/node_modules/.bin/prettier'),
  path.resolve(__dirname, '../node_modules/.bin/prettier'),
].find(p => fs.existsSync(p))

function formatSnippet(code) {
  if (!PRETTIER_BIN) return code
  try {
    return execSync(
      `${PRETTIER_BIN} --parser typescript --print-width 68 --tab-width 2 --single-quote --trailing-comma all`,
      { input: code, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).trimEnd()
  } catch {
    return code
  }
}

const LOCAL_TEMPLATE_SRC = path.resolve(
  __dirname,
  '../../fabric/templates/online-shop-template/packages/functions/src'
)
const OUTPUT_FILE      = path.resolve(__dirname, '../src/data/snippets.json')
const OUTPUT_META_FILE = path.resolve(__dirname, '../src/data/snippets-meta.json')

function resolveTemplateSrc() {
  if (fs.existsSync(LOCAL_TEMPLATE_SRC)) return LOCAL_TEMPLATE_SRC

  // Local fabric repo not found — clone from GitHub
  const clonedSrc = path.join(CLONED_DIR, 'packages/functions/src')
  if (fs.existsSync(clonedSrc)) {
    console.log('[extract-snippets] Using cached clone at', CLONED_DIR)
    return clonedSrc
  }

  console.log('[extract-snippets] Cloning template-online-shop from GitHub...')
  fs.mkdirSync(CLONED_DIR, { recursive: true })
  fs.rmdirSync(CLONED_DIR) // let git clone create it

  // Try SSH first (local dev with keys), fall back to HTTPS (CI with token)
  try {
    execSync(`git clone --depth 1 ${SHOP_REPO_SSH} ${CLONED_DIR}`, { stdio: 'inherit' })
  } catch {
    console.log('[extract-snippets] SSH clone failed, trying HTTPS...')
    execSync(`git clone --depth 1 ${SHOP_REPO_HTTPS} ${CLONED_DIR}`, { stdio: 'inherit' })
  }

  if (!fs.existsSync(clonedSrc)) {
    console.error('[extract-snippets] Clone succeeded but src dir not found:', clonedSrc)
    process.exit(1)
  }

  return clonedSrc
}

const TEMPLATE_SRC = resolveTemplateSrc()

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
      const raw = currentLines
        .map((l) => l.slice(minIndent))
        .join('\n')
        .trim()
      snippets[currentName] = formatSnippet(raw)
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
fs.writeFileSync(OUTPUT_META_FILE, JSON.stringify(origins, null, 2) + '\n')

const count = Object.keys(all).length
console.log(`[extract-snippets] Wrote ${count} snippet${count !== 1 ? 's' : ''} → src/data/snippets.json`)
for (const [name, file] of Object.entries(origins)) {
  console.log(`  ${name.padEnd(36)} ${file}`)
}
