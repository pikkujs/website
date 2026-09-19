#!/usr/bin/env node
/**
 * Vendors the API surface that ships inside `@pikku/cli` as `surface.json` —
 * the same data `pikku doc` prints — and writes the copy the SDK explorer at
 * /api fetches.
 *
 * Run via:  npm run sync-api-surface
 *
 * The surface is computed when the CLI is built, so it is always the truth
 * about the installed version rather than prose someone remembered to update.
 * We vendor a copy into src/data/surface.json so the site builds without the
 * monorepo checked out next to it.
 *
 * This script used to render the surface into ~28 markdown pages under
 * docs/api-reference/ as well. It no longer does: the explorer is the one
 * place the surface is published, and a generated page that restates it is a
 * second copy to keep honest. Nothing here is written by hand — to change what
 * the explorer says, change the JSDoc in the pikku source.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * In preference order. `surface.json` is a *build* artifact — it is listed in
 * @pikku/cli's `files`, so a published package carries one, but a fresh source
 * checkout does not until the CLI is built. That is why the .pikku-core
 * submodule sits below a sibling monorepo rather than above it: the submodule is
 * there to check prose against, and only has a surface if someone has built it.
 */
const SOURCES = [
  resolve(root, 'node_modules/@pikku/cli/surface.json'),
  resolve(root, '../pikku/packages/cli/surface.json'),
  resolve(root, '.pikku-core/packages/cli/surface.json'),
]
const VENDORED = resolve(root, 'src/data/surface.json')
/** The explorer at /api fetches this rather than importing it, so the page
    bundle stays empty and the 300-odd KB is a separate, cacheable request.
    It sits beside /api rather than under it: a static directory named `api`
    turns /api into a 301 to /api/, which the route then has to serve. */
const EXPLORER_DATA = resolve(root, 'static/api-surface.json')

/**
 * The steps the explorer knows how to place a door under, in the order the
 * surface itself defines: how you meet the doors while building. The labels
 * and prose live in src/components/Surface/surface-steps.ts — this is only
 * here so a step added upstream fails the sync rather than silently dropping
 * every door that arrives under it.
 */
const KNOWN_STEPS = [
  'create a function',
  'enhance it',
  'wire it up',
  'guard it',
  'orchestrate it',
  'test it',
]

// ── loading ────────────────────────────────────────────────

const loadSurface = () => {
  for (const source of SOURCES) {
    if (!existsSync(source)) continue
    const doc = JSON.parse(readFileSync(source, 'utf8'))
    return { doc, source }
  }
  if (existsSync(VENDORED)) {
    return { doc: JSON.parse(readFileSync(VENDORED, 'utf8')), source: VENDORED }
  }
  console.error(
    `[api-surface] No surface.json found. Looked in:\n  ${SOURCES.join('\n  ')}\n` +
      'Install @pikku/cli, or check the pikku monorepo out next to this repo and build the CLI.'
  )
  process.exit(1)
}

// ── main ───────────────────────────────────────────────────

const { doc, source } = loadSurface()
mkdirSync(dirname(VENDORED), { recursive: true })
writeFileSync(VENDORED, `${JSON.stringify(doc, null, 2)}\n`)

const entryPoint = doc.entryPoints.find((candidate) => candidate.id === 'app')
if (!entryPoint) {
  console.error('[api-surface] surface.json has no "app" entry point.')
  process.exit(1)
}

const addonEntryPoint = doc.entryPoints.find((candidate) => candidate.id === 'addon')
if (!addonEntryPoint) {
  console.error(
    '[api-surface] surface.json has no "addon" entry point. The explorer offers it as ' +
      'one of two entry points, so a missing one means the site would silently stop ' +
      'covering addon authors.'
  )
  process.exit(1)
}

const known = new Set(KNOWN_STEPS)
const unknown = [
  ...new Set(doc.entryPoints.flatMap((entry) => entry.leaves.map((leaf) => leaf.step))),
].filter((step) => !known.has(step))
if (unknown.length > 0) {
  console.error(
    `[api-surface] surface.json introduced step(s) the site does not know: ${unknown.join(', ')}.\n` +
      'Add them to STEPS in src/components/Surface/surface-steps.ts, then to KNOWN_STEPS here.'
  )
  process.exit(1)
}

/* ── the explorer's copy ────────────────────────────────────
   Same data, cut down to what src/components/Surface renders. The cut is
   the console's own `isEntrypoint` (surface-steps.ts): types and interfaces
   are reached through the values that take them, so listing them as exports
   in their own right is noise. Everything else the panel can show — docs,
   examples, members, signature — is kept.

   The prose for each step is NOT copied. It is fixed UI copy that lives in
   the component, exactly as it is a message rather than data in the console.
*/
const explorerDoc = {
  version: doc.version,
  entryPoints: doc.entryPoints.map((entry) => ({
    id: entry.id,
    job: entry.job,
    specifierBase: entry.specifierBase,
    summary: entry.summary,
    leaves: entry.leaves
      .map((leaf) => ({
        specifier: leaf.specifier,
        name: leaf.name,
        step: leaf.step,
        summary: leaf.summary,
        symbols: leaf.symbols.filter(
          (symbol) => symbol.kind !== 'type' && symbol.kind !== 'interface'
        ),
      }))
      .filter((leaf) => leaf.symbols.length > 0),
  })),
}

mkdirSync(dirname(EXPLORER_DATA), { recursive: true })
writeFileSync(EXPLORER_DATA, JSON.stringify(explorerDoc))

const total = entryPoint.leaves.reduce((count, leaf) => count + leaf.symbols.length, 0)
const addonTotal = addonEntryPoint.leaves.reduce((count, leaf) => count + leaf.symbols.length, 0)
console.log(
  `[api-surface] pikku ${doc.version} — app: ${entryPoint.leaves.length} doors / ${total} exports, ` +
    `addon: ${addonEntryPoint.leaves.length} doors / ${addonTotal} exports`
)
console.log(`[api-surface] read  ${source}`)
console.log(`[api-surface] wrote ${VENDORED}`)
console.log(`[api-surface] wrote ${EXPLORER_DATA}`)
