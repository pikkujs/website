#!/usr/bin/env node
/**
 * Fails the build if any Pikku CLI error code (PKU###) is missing its
 * reference page under docs/pikku-cli/errors/.
 *
 * The canonical list of codes is the `ErrorCode` enum shipped by
 * `@pikku/inspector` — the same registry the CLI throws from. Every value must
 * have a matching `docs/pikku-cli/errors/pku<n>.md` page, otherwise the
 * `[PKU###] → https://pikku.dev/docs/pikku-cli/errors/pku###` link 404s.
 *
 * We import the enum from `@pikku/inspector`'s dependency-free `error-codes`
 * module directly (resolved via the package's own entry point) rather than its
 * barrel: the barrel pulls in @pikku/core and the TypeScript toolchain, which a
 * docs build has no reason to load just to read an enum.
 *
 * Missing pages are a hard error (exit 1). Orphan pages (a page whose code is
 * not in the enum) are only a warning: a few codes — e.g. PKU342 — are defined
 * as literals in @pikku/core rather than the inspector enum, and those pages
 * are legitimate.
 *
 * Run via:  yarn check-error-docs   (also chained into `yarn build`)
 */

import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ERRORS_DIR = join(__dirname, '..', 'docs', 'pikku-cli', 'errors')

async function loadErrorCodes() {
  // Resolve @pikku/inspector's main entry (dist/index.js) then import the
  // sibling error-codes module by file URL, which sidesteps the package's
  // `exports` map and its @pikku/core peer dependency.
  const entry = import.meta.resolve('@pikku/inspector')
  const errorCodesUrl = new URL('./error-codes.js', entry)
  const { ErrorCode } = await import(errorCodesUrl)
  if (!ErrorCode) {
    throw new Error('@pikku/inspector did not export ErrorCode')
  }
  return ErrorCode
}

let ErrorCode
try {
  ErrorCode = await loadErrorCodes()
} catch (err) {
  console.error(
    `❌ Could not load the Pikku ErrorCode enum from @pikku/inspector.\n` +
      `   Is it installed? (devDependency "@pikku/inspector")\n   ${err.message}`
  )
  process.exit(1)
}

const enumCodes = new Set(
  Object.values(ErrorCode).filter((v) => /^PKU\d+$/.test(v))
)

const pageCodes = new Set(
  readdirSync(ERRORS_DIR)
    .map((f) => /^(pku\d+)\.md$/i.exec(f)?.[1])
    .filter(Boolean)
    .map((name) => name.toUpperCase())
)

const missing = [...enumCodes].filter((c) => !pageCodes.has(c)).sort()
const orphans = [...pageCodes].filter((c) => !enumCodes.has(c)).sort()

if (orphans.length > 0) {
  console.warn(
    `⚠️  ${orphans.length} error page(s) have no matching ErrorCode (defined as a core literal, or a removed code): ${orphans.join(', ')}`
  )
}

if (missing.length > 0) {
  console.error(
    `\n❌ ${missing.length} Pikku error code(s) have no docs page under docs/pikku-cli/errors/:\n` +
      missing.map((c) => `   - ${c}  (create pku${c.slice(3)}.md)`).join('\n') +
      `\n\nEvery ErrorCode in @pikku/inspector must have a reference page so the ` +
      `[PKU###] links the CLI prints do not 404.\n`
  )
  process.exit(1)
}

console.log(
  `✅ All ${enumCodes.size} Pikku error codes have a docs page.` +
    (orphans.length ? ` (${orphans.length} non-enum page(s) allowed.)` : '')
)
