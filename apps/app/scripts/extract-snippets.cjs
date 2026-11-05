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
 * The template is real code, the website teaches one idea at a time, so:
 *   // @snippet hide [mySnippetName]   lines up to the matching show become `// ...`
 *   // @snippet show [mySnippetName]   (no name: every open region)
 * Own-line comment blocks of three or more lines are maintainer notes and are dropped;
 * put the explanation in the page's prose, or precede a teaching comment with
 *   // @snippet keep
 * and silence a short one the same way with
 *   // @snippet skip
 *
 * Run via:  npm run sync-snippets
 *
 * The template source lives in the .template-online-shop git submodule.
 * Update it with:  git submodule update --remote .template-online-shop
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const PRETTIER_BIN = path.resolve(__dirname, '../../../node_modules/.bin/prettier')

function formatSnippet(code) {
  if (!PRETTIER_BIN) return code
  try {
    return execSync(
      `${PRETTIER_BIN} --parser typescript --print-width 80 --tab-width 2 --single-quote --trailing-comma all`,
      { input: code, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).trimEnd()
  } catch {
    return code
  }
}

const SUBMODULE_SRC = path.resolve(__dirname, '../../../.template-online-shop/packages/functions/src')
const OUTPUT_FILE      = path.resolve(__dirname, '../src/data/snippets.json')
const OUTPUT_META_FILE = path.resolve(__dirname, '../src/data/snippets-meta.json')

if (!fs.existsSync(SUBMODULE_SRC)) {
  console.error('[extract-snippets] Submodule not initialised. Run: git submodule update --init')
  process.exit(1)
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

/** Strip the common leading indent, then run the result through prettier. */
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

const KEEP = /\/\/\s*@snippet keep\s*$/
const SKIP = /\/\/\s*@snippet skip\s*$/
const TOOL_DIRECTIVE = /^\s*\/\/\s*@coverage-unreachable\b/

/**
 * Own-line comment blocks of 3+ lines, `//` or JSDoc, explain the template to its maintainers rather
 * than the idea to a reader. Tool directives are never for readers.
 */
function dropCommentBlocks(lines) {
  const out = []
  for (let i = 0; i < lines.length; ) {
    let j = i
    if (/^\s*\/\*\*/.test(lines[i])) {
      while (j < lines.length - 1 && !lines[j].includes('*/')) j++
      j++
    } else if (/^\s*\/\//.test(lines[i])) {
      while (j < lines.length && /^\s*\/\//.test(lines[j])) j++
    } else {
      out.push(lines[i++])
      continue
    }
    const block = lines.slice(i, j).filter((l) => !TOOL_DIRECTIVE.test(l))
    if (KEEP.test(block[0] ?? '')) out.push(...block.slice(1))
    else if (!SKIP.test(block[0] ?? '') && block.length < 3) out.push(...block)
    i = j
  }
  return out
}

/**
 * Regions may nest and overlap — the template wraps a role-descriptive alias
 * (`writeFunction`) around the same lines as a concrete one (`addToBasket`), and
 * both are referenced by the site. So every open region collects every line, and
 * an `end` closes the region of that name rather than whichever opened last.
 * Marker lines themselves are never collected, so an inner marker does not leak
 * into the snippet around it.
 */
function extractSnippets(content, rel, problems) {
  const snippets = {}
  const open = new Map()
  const hidden = new Map() // region name -> placeholder still to be written?

  const regions = new Map() // region name -> { start, trimmed }

  for (const [index, line] of content.split('\n').entries()) {
    const hideMatch = line.match(/\/\/\s*@snippet hide(?:\s+(\S+))?\s*$/)
    if (hideMatch) {
      const names = hideMatch[1] ? [hideMatch[1]] : [...open.keys()]
      if (names.length === 0 || names.some((n) => !open.has(n))) problems.push(`"@snippet hide" outside its region in ${rel}`)
      for (const n of names) {
        hidden.set(n, true)
        if (regions.has(n)) regions.get(n).trimmed = true
      }
      continue
    }

    const showMatch = line.match(/\/\/\s*@snippet show(?:\s+(\S+))?\s*$/)
    if (showMatch) {
      const names = showMatch[1] ? [showMatch[1]] : [...hidden.keys()]
      if (names.length === 0 || names.some((n) => !hidden.has(n))) problems.push(`"@snippet show" with no hide in ${rel}`)
      for (const n of names) hidden.delete(n)
      continue
    }

    const startMatch = line.match(/\/\/\s*@snippet start\s+(\S+)/)
    if (startMatch) {
      if (snippets[startMatch[1]] || open.has(startMatch[1])) {
        problems.push(`Duplicate snippet "${startMatch[1]}" within ${rel}`)
      }
      open.set(startMatch[1], [])
      regions.set(startMatch[1], { start: index + 2, trimmed: false })
      continue
    }

    const endMatch = line.match(/\/\/\s*@snippet end\s+(\S+)/)
    if (endMatch) {
      const name = endMatch[1]
      const collected = open.get(name)
      if (collected) {
        if (hidden.delete(name)) problems.push(`"@snippet hide" never shown in ${name} (${rel})`)
        snippets[name] = {
          code: formatSnippet(dedent(dropCommentBlocks(collected))),
          lines: `L${regions.get(name).start}-L${index}`,
          trimmed: regions.get(name).trimmed,
        }
        open.delete(name)
      } else {
        problems.push(`"@snippet end ${name}" with no matching start in ${rel}`)
      }
      continue
    }

    for (const [name, collected] of open) {
      if (!hidden.has(name)) collected.push(line)
      else if (hidden.get(name) && line.trim()) {
        collected.push(`${line.match(/^\s*/)[0]}// ...`)
        hidden.set(name, false)
      }
    }
  }

  for (const name of open.keys()) {
    problems.push(`"@snippet start ${name}" is never closed in ${rel}`)
  }

  return snippets
}

// ── Main ───────────────────────────────────────────────────

const TEMPLATE_ROOT = path.resolve(__dirname, '../../../.template-online-shop')
const files   = findTsFiles(SUBMODULE_SRC)
// Frontend snippets: every app's src/ plus its vite.config.ts.
const APPS_DIR = path.join(TEMPLATE_ROOT, 'apps')
if (fs.existsSync(APPS_DIR)) {
  for (const app of fs.readdirSync(APPS_DIR, { withFileTypes: true })) {
    if (!app.isDirectory()) continue
    const appSrc = path.join(APPS_DIR, app.name, 'src')
    if (fs.existsSync(appSrc)) findTsFiles(appSrc, files)
    const vite = path.join(APPS_DIR, app.name, 'vite.config.ts')
    if (fs.existsSync(vite)) files.push(vite)
  }
}
/* Every definition problem is collected and reported together, and nothing is
   written while any remain: a stale snippets.json is better than one that
   silently drops a region or shows the wrong code. */
const problems = []
const all     = {}
const origins = {} // snippet name → file path (for collision warnings)
const sources = {} // snippet name → where it lives in the template, and whether code is hidden

for (const file of files) {
  const content  = fs.readFileSync(file, 'utf8')
  const rel      = (file.startsWith(SUBMODULE_SRC + path.sep) ? path.relative(SUBMODULE_SRC, file) : path.relative(TEMPLATE_ROOT, file))
  const snippets = extractSnippets(content, rel, problems)

  for (const [name, { code, lines, trimmed }] of Object.entries(snippets)) {
    if (origins[name]) {
      problems.push(`Duplicate snippet "${name}" in ${rel} (already from ${origins[name]})`)
      continue
    }
    all[name]     = code
    origins[name] = rel
    sources[name] = { path: `${path.relative(TEMPLATE_ROOT, file)}#${lines}`, ...(trimmed ? { trimmed } : {}) }
  }
}

if (problems.length > 0) {
  for (const problem of problems) console.error(`[extract-snippets] ${problem}`)
  console.error(`[extract-snippets] ${problems.length} invalid snippet definition${problems.length !== 1 ? 's' : ''} — nothing written`)
  process.exit(1)
}

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(all, null, 2) + '\n')
// Pinned to the commit the code came from, so a link's line numbers stay right as the template moves on.
const commit = execSync('git rev-parse HEAD', { cwd: TEMPLATE_ROOT, encoding: 'utf8' }).trim()
const base = `https://github.com/pikkujs/template-online-shop/blob/${commit}/`
fs.writeFileSync(OUTPUT_META_FILE, JSON.stringify({ base, sources }, null, 2) + '\n')

const count = Object.keys(all).length
console.log(`[extract-snippets] Wrote ${count} snippet${count !== 1 ? 's' : ''} → src/data/snippets.json`)
for (const [name, file] of Object.entries(origins)) {
  console.log(`  ${name.padEnd(36)} ${file}`)
}
