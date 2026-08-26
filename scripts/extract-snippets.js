#!/usr/bin/env node
/**
 * Extracts @snippet regions from the online-shop example source files
 * and writes them to src/data/snippets.json.
 *
 * Snippet markers in TypeScript source files:
 *   // @snippet start mySnippetName
 *   ... code ...
 *   // @snippet end mySnippetName
 *
 * The source lives in the pikku monorepo, under examples/online-shop, which
 * this repo carries as the .pikku-core git submodule.
 *
 * Run via:  npm run sync-snippets
 * Update it with:  git submodule update --remote .pikku-core
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const PRETTIER_BIN = path.resolve(__dirname, '../node_modules/.bin/prettier')

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

const SUBMODULE_ROOT = path.resolve(__dirname, '../.pikku-core/examples/online-shop')
const SUBMODULE_SRC = path.resolve(SUBMODULE_ROOT, 'src')
/* Not everything the site shows is TypeScript. Migrations and the config that
   declares who the app is for are source too, and must come from here rather
   than be retyped into a page. */
/* Prefixes are relative to SUBMODULE_SRC, which is where origins are recorded
   from — `..` climbs out of src to the example root. */
const EXTRA_ROOTS = [
  { dir: path.resolve(SUBMODULE_ROOT, 'db'), prefix: '../db' },
  /* Scenarios are the example's tests, and the pages that document them want
     the real step definitions rather than a retyped approximation. */
  { dir: path.resolve(SUBMODULE_ROOT, 'test'), prefix: '../test' },
]
const OUTPUT_FILE      = path.resolve(__dirname, '../src/data/snippets.json')
const OUTPUT_META_FILE = path.resolve(__dirname, '../src/data/snippets-meta.json')

if (!fs.existsSync(SUBMODULE_SRC)) {
  console.error('[extract-snippets] Submodule not initialised. Run: git submodule update --init .pikku-core')
  process.exit(1)
}

// ── Recursive TS file scanner ──────────────────────────────

const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.sql']

function findTsFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.pikku') {
      findTsFiles(full, results)
    } else if (entry.isFile() && SOURCE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      results.push(full)
    }
  }
  return results
}

// ── Snippet extraction ─────────────────────────────────────

function dedent(lines) {
  const nonEmpty = lines.filter((l) => l.trim().length > 0)
  const minIndent = nonEmpty.length
    ? Math.min(...nonEmpty.map((l) => l.match(/^(\s*)/)[1].length))
    : 0
  return lines
    .map((l) => l.slice(minIndent))
    .join('\n')
    .trim()
}

/**
 * Regions may nest and overlap. A page rarely wants a whole wiring file, so a
 * narrow region is marked inside a wide one; every open region collects the
 * line, and a marker line itself belongs to none of them.
 */
function extractSnippets(content, { format = true, file = '' } = {}) {
  const snippets = {}
  const open = new Map() // name → collected lines

  for (const line of content.split('\n')) {
    const startMatch = line.match(/(?:\/\/|--)\s*@snippet start\s+(\S+)/)
    const endMatch = line.match(/(?:\/\/|--)\s*@snippet end\s+(\S+)/)

    if (startMatch) {
      open.set(startMatch[1], [])
      continue
    }
    if (endMatch && open.has(endMatch[1])) {
      const raw = dedent(open.get(endMatch[1]))
      snippets[endMatch[1]] = format ? formatSnippet(raw) : raw
      open.delete(endMatch[1])
      continue
    }
    for (const collected of open.values()) collected.push(line)
  }

  // A region with no matching `@snippet end` yields nothing, which reaches the
  // site as a page rendering `undefined` rather than as a build failure.
  for (const name of open.keys()) {
    console.warn(`[extract-snippets] Unclosed snippet "${name}" in ${file} — no @snippet end, so it was not emitted`)
  }

  return snippets
}

// ── Main ───────────────────────────────────────────────────

const all     = {}
const origins = {} // snippet name → file path (for collision warnings)

const roots = [
  { dir: SUBMODULE_SRC, prefix: '' },
  ...EXTRA_ROOTS.filter((r) => fs.existsSync(r.dir)),
]

for (const root of roots) {
  for (const file of findTsFiles(root.dir)) {
    const content  = fs.readFileSync(file, 'utf8')
    // Prettier's TypeScript parser cannot read SQL; those regions ship verbatim.
    const rel      = path.join(root.prefix, path.relative(root.dir, file))
    const snippets = extractSnippets(content, { format: !file.endsWith('.sql'), file: rel })

    for (const [name, code] of Object.entries(snippets)) {
      if (origins[name]) {
        console.warn(`[extract-snippets] Duplicate snippet "${name}" in ${rel} (already from ${origins[name]})`)
      }
      all[name]     = code
      origins[name] = rel
    }
  }
}

/* The scenario config is the one place the app declares who it is for. It is
   JSON, so it carries no marker comments — the slice is named here instead. */
const CONFIG_FILE = path.resolve(SUBMODULE_ROOT, 'pikku.config.json')
if (fs.existsSync(CONFIG_FILE)) {
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
  if (config.scenarios) {
    all.scenarioConfig = JSON.stringify({ scenarios: config.scenarios }, null, 2)
    origins.scenarioConfig = '../pikku.config.json'
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
