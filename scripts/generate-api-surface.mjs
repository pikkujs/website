#!/usr/bin/env node
/**
 * Generates the API Reference from the API surface that ships inside
 * `@pikku/cli` as `surface.json` — the same data `pikku doc` prints.
 *
 * Run via:  npm run sync-api-surface
 *
 * The surface is computed when the CLI is built, so it is always the truth
 * about the installed version rather than prose someone remembered to update.
 * We vendor a copy into src/data/surface.json so the site builds without the
 * monorepo checked out next to it.
 *
 * Nothing in docs/api-reference/ is written by hand — edits there are lost on
 * the next run. To change a page, change the JSDoc in the pikku source.
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
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
const OUT_DIR = resolve(root, 'docs/api-reference')

/** The order the surface itself defines: how you meet the doors while building. */
const STEPS = [
  {
    step: 'create a function',
    slug: 'create',
    label: 'Create a function',
    blurb: 'The definers every wiring eventually points at, and the config and services they run against.',
  },
  {
    step: 'enhance it',
    slug: 'enhance',
    label: 'Enhance it',
    blurb: 'Errors, middleware, secrets, variables and addons — what wraps a function without changing it.',
  },
  {
    step: 'wire it up',
    slug: 'wire',
    label: 'Wire it up',
    blurb: 'One `wire*` call per protocol. The function does not change; only how the world reaches it does.',
  },
  {
    step: 'guard it',
    slug: 'guard',
    label: 'Guard it',
    blurb: 'Who may call a function, and under which scope or role.',
  },
  {
    step: 'orchestrate it',
    slug: 'orchestrate',
    label: 'Orchestrate it',
    blurb: 'Workflows and agents — composing functions into something longer-lived than one call.',
  },
  {
    step: 'test it',
    slug: 'test',
    label: 'Test it',
    blurb: 'Features, scenarios and steps that drive the whole system the way a user would.',
  },
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

// ── MDX-safe text ──────────────────────────────────────────

/**
 * Docusaurus parses .md as MDX, so a bare `{` opens an expression and a bare
 * `<` opens a JSX tag. Signatures live in fences and are safe; prose does not.
 */
const mdxSafe = (text = '') =>
  text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;')

/** Same, plus the pipe and newline that would break out of a table cell. */
const cell = (text = '') =>
  mdxSafe(text).replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim()

/**
 * A table cell that is wrapped in backticks. An inline code span already
 * protects `<` and `{` from MDX, so escaping them here would render the entity
 * literally — only the pipe and the backtick itself need dealing with.
 */
const codeCell = (text = '') =>
  text.replace(/\s*\n\s*/g, ' ').replace(/`/g, "'").replace(/\|/g, '\\|').trim()

const frontmatterString = (text) => `'${String(text).replace(/'/g, "''")}'`

const oneLine = (text = '') => text.replace(/\s+/g, ' ').trim()

const truncate = (text, max) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`

/**
 * Upstream JSDoc writes door specifiers and export names as bare words, which
 * read as prose on a reference page. Wrap them in backticks — but only outside
 * an existing code span, so a summary that already formatted them is left alone.
 */
const AUTO_CODE = /(?<![`\w/@.])(#pikku\/[a-z0-9/*-]+|(?:wire|pikku)[A-Z][A-Za-z0-9]*)(?![`\w])/g

const codeify = (part) =>
  part
    .split(/(`[^`]*`)/g)
    .map((chunk) =>
      chunk.startsWith('`') ? chunk : chunk.replace(AUTO_CODE, '`$1`')
    )
    .join('')

/**
 * The JSDoc arrives with `@example` blocks already split off, but the prose can
 * still carry fenced code. Escape only the parts outside a fence.
 */
const prose = (text = '') =>
  text
    .split(/(```[\s\S]*?```)/g)
    .map((part) => (part.startsWith('```') ? part : codeify(mdxSafe(part))))
    .join('')

/** An `@example` block is either already fenced, or bare code we must fence. */
const example = (text) => {
  const trimmed = text.trim()
  if (trimmed.startsWith('```')) return trimmed
  return ['```typescript', trimmed, '```'].join('\n')
}

const slugify = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/**
 * `pikkuFunc` and `PikkuFunction` slugify apart, but `pikkuApprovalDescription`
 * and `PikkuApprovalDescription` do not — so anchors are assigned per page and
 * written explicitly, rather than left to whatever the heading happens to slug to.
 */
const anchorsFor = (symbols) => {
  const taken = new Map()
  const anchors = new Map()
  for (const symbol of symbols) {
    const base = slugify(symbol.name)
    const seen = taken.get(base) ?? 0
    taken.set(base, seen + 1)
    anchors.set(symbol.name, seen === 0 ? base : `${base}-${seen + 1}`)
  }
  return anchors
}

// ── rendering ──────────────────────────────────────────────

const KIND_LABEL = {
  function: 'function',
  class: 'class',
  interface: 'interface',
  type: 'type',
  const: 'const',
  enum: 'enum',
  namespace: 'namespace',
}

const originNote = (origin) => {
  if (!origin) return null
  if (origin.via === 'generated') return 'generated into `.pikku` by the CLI'
  if (origin.via === 'core') return `re-exported from \`@pikku/core${origin.subpath.replace(/^\./, '')}\``
  if (origin.via === 'package') return `re-exported from \`${origin.packageName}\``
  return null
}

const renderMembers = (symbol) => {
  const members = symbol.members ?? []
  if (members.length === 0) return []
  const rows = members.map((member) => {
    const [key] = member.line.split(/[?:]/, 1)
    const optional = /^[^:?]*\?/.test(member.line)
    const type = member.line.slice(member.line.indexOf(':') + 1).trim()
    return `| \`${codeCell(key.trim())}\`${optional ? '' : ' <sup>required</sup>'} | \`${codeCell(truncate(oneLine(type), 90))}\` | ${cell(member.doc ?? '')} |`
  })
  return [
    '<details>',
    `<summary>Config keys (${members.length})</summary>`,
    '',
    '| Key | Type | What it does |',
    '| --- | --- | --- |',
    ...rows,
    '',
    '</details>',
    '',
  ]
}

const renderSymbol = (symbol, anchor) => {
  const lines = [`### \`${symbol.name}\` \{#${anchor}\}`, '']

  const meta = [KIND_LABEL[symbol.kind] ?? symbol.kind, originNote(symbol.origin)]
    .filter(Boolean)
    .join(' · ')
  lines.push(`<span className="api-symbol-meta">${mdxSafe(meta)}</span>`, '')

  if (symbol.deprecated) {
    lines.push(':::warning Deprecated', '', prose(symbol.deprecated), '', ':::', '')
  }

  const docs = symbol.docs ?? symbol.summary
  if (docs) lines.push(prose(docs), '')

  if (symbol.signature) {
    lines.push('```typescript', `${symbol.name}: ${oneLine(symbol.signature)}`, '```', '')
  }

  lines.push(...renderMembers(symbol))

  for (const block of symbol.examples ?? []) {
    lines.push(example(block), '')
  }

  return lines
}

/**
 * `#pikku/error` is 49 classes that differ only in the status they carry, so a
 * table says more than 49 near-identical sections would.
 */
const renderErrorTable = (statuses) => [
  '## Error classes',
  '',
  'Throw one of these and every wiring turns it into its status — HTTP responds with the code, a queue marks the job failed, an agent sees the message.',
  '',
  '| Error | Status | Thrown when |',
  '| --- | --- | --- |',
  ...statuses
    .slice()
    .sort((a, b) => (a.status ?? 0) - (b.status ?? 0) || a.name.localeCompare(b.name))
    .map((symbol) => `| \`${symbol.name}\` | ${symbol.status} | ${cell(symbol.summary ?? '')} |`),
  '',
]

const renderLeaf = (leaf, stepMeta, position, addonLeaf) => {
  const statuses = leaf.symbols.filter((symbol) => symbol.status !== undefined)
  const plain = leaf.symbols.filter((symbol) => symbol.status === undefined)

  const anchors = anchorsFor(plain)
  const showcase = [
    ...plain.filter((symbol) => symbol.kind === 'function' || symbol.kind === 'const'),
    ...plain.filter((symbol) => symbol.kind !== 'function' && symbol.kind !== 'const'),
  ].slice(0, 3)

  const lines = [
    '---',
    `title: ${frontmatterString(leaf.specifier)}`,
    `sidebar_label: ${frontmatterString(leaf.specifier)}`,
    `sidebar_position: ${position}`,
    `description: ${frontmatterString(truncate(oneLine(leaf.summary), 155))}`,
    '---',
    '',
    `# \`${leaf.specifier}\``,
    '',
    prose(leaf.summary),
    '',
    '```typescript',
    `import { ${showcase.map((symbol) => symbol.name).join(', ')} } from '${leaf.specifier}'`,
    '```',
    '',
  ]

  if (plain.length > 0) {
    lines.push(
      '## Exports',
      '',
      '| Export | Kind | Summary |',
      '| --- | --- | --- |',
      ...plain.map(
        (symbol) =>
          `| [\`${symbol.name}\`](#${anchors.get(symbol.name)}) | ${KIND_LABEL[symbol.kind] ?? symbol.kind} | ${cell(symbol.summary ?? '')} |`
      ),
      ''
    )
  }

  if (statuses.length > 0) lines.push(...renderErrorTable(statuses))

  if (plain.length > 0) {
    lines.push('## Reference', '')
    for (const symbol of plain) lines.push(...renderSymbol(symbol, anchors.get(symbol.name)))
  }

  lines.push(...renderAddonNote(leaf, addonLeaf))

  lines.push(
    '---',
    '',
    `Run \`npx pikku doc ${leaf.name}\` to print this door in the terminal, or \`npx pikku doc <export>\` for any one export above.`,
    ''
  )

  return lines.join('\n')
}

/**
 * Which exports an addon door has that the matching app door does not, and the
 * other way round. The surface is the authority here — nothing is hardcoded, so
 * a door that gains or loses a wiring call upstream shows up on the next run.
 */
const diffLeaves = (appLeaf, addonLeaf) => {
  const appNames = new Set(appLeaf.symbols.map((symbol) => symbol.name))
  const addonNames = new Set(addonLeaf.symbols.map((symbol) => symbol.name))
  return {
    appOnly: appLeaf.symbols.filter((symbol) => !addonNames.has(symbol.name)),
    addonOnly: addonLeaf.symbols.filter((symbol) => !appNames.has(symbol.name)),
  }
}

/** The short note an app door page carries when addon authors have the same door. */
const renderAddonNote = (appLeaf, addonLeaf) => {
  const lines = ['## Inside an addon', '']

  // No matching addon door at all: the whole door is a wiring concern, so an
  // addon never opens it. Say so rather than leaving the page silent.
  if (!addonLeaf) {
    lines.push(
      appLeaf.name === 'addon'
        ? `This door is application-only. Installing an addon is something an application does; an addon that installed other addons would be reaching into a registry it does not own. See [the addon surface](/docs/api-reference/addons) for the doors an addon does get.`
        : `This door is application-only — there is no \`#pikku/addon/${appLeaf.name}\`. Everything on it wires a function to the outside world, and that is the installing application's call, not the addon's. See [the addon surface](/docs/api-reference/addons) for the doors an addon does get.`,
      ''
    )
    return lines
  }

  const { appOnly, addonOnly } = diffLeaves(appLeaf, addonLeaf)

  if (appOnly.length === 0 && addonOnly.length === 0) {
    lines.push(
      `Addon authors get this door unchanged as \`${addonLeaf.specifier}\` — same ${appLeaf.symbols.length} exports, same shapes. Only the import specifier differs.`,
      ''
    )
  } else {
    const differences = (appOnly.length > 0 ? 1 : 0) + (addonOnly.length > 0 ? 1 : 0)
    lines.push(
      `Addon authors import this door as \`${addonLeaf.specifier}\`, with ${differences === 1 ? 'one difference' : 'two differences'}:`,
      ''
    )
    if (appOnly.length > 0) {
      lines.push(
        `- Not available: ${appOnly.map((symbol) => `\`${symbol.name}\``).join(', ')} — an addon ships functions, it does not wire them. The application that installs the addon does that.`
      )
    }
    if (addonOnly.length > 0) {
      lines.push(
        `- Addon-only: ${addonOnly.map((symbol) => `\`${symbol.name}\``).join(', ')} — see [the addon surface](/docs/api-reference/addons).`
      )
    }
    lines.push('')
  }

  return lines
}

/**
 * The whole addon surface on one page. Most addon doors are the app door with a
 * different specifier, so duplicating 49 error classes would make the reference
 * worse, not more complete: identical doors link across, and only the exports
 * that exist nowhere else are written out in full here.
 */
const renderAddonSurface = (doc, appEntry, addonEntry, stepOf) => {
  const appByName = new Map(appEntry.leaves.map((leaf) => [leaf.name, leaf]))
  const total = addonEntry.leaves.reduce((count, leaf) => count + leaf.symbols.length, 0)
  const appOnlyDoors = appEntry.leaves.filter(
    (leaf) => !addonEntry.leaves.some((candidate) => candidate.name === leaf.name)
  )

  const rows = []
  const exclusive = []

  for (const addonLeaf of addonEntry.leaves) {
    const appLeaf = appByName.get(addonLeaf.name)
    if (!appLeaf) {
      rows.push(
        `| \`${addonLeaf.specifier}\` | ${addonLeaf.symbols.length} | Addon-only door — documented below |`
      )
      exclusive.push([addonLeaf, addonLeaf.symbols])
      continue
    }

    const { appOnly, addonOnly } = diffLeaves(appLeaf, addonLeaf)
    const step = stepOf.get(appLeaf.name)
    const href = `/docs/api-reference/${step.slug}/${appLeaf.name}`
    let note
    if (appOnly.length === 0 && addonOnly.length === 0) {
      note = 'Identical — same exports, same shapes'
    } else {
      const parts = []
      if (appOnly.length > 0)
        parts.push(`no ${appOnly.map((symbol) => `\`${symbol.name}\``).join(', ')}`)
      if (addonOnly.length > 0)
        parts.push(`adds ${addonOnly.map((symbol) => `\`${symbol.name}\``).join(', ')}`)
      note = parts.join('; ')
    }

    rows.push(
      `| [\`${addonLeaf.specifier}\`](${href}) | ${addonLeaf.symbols.length} | ${cell(note)} |`
    )
    if (addonOnly.length > 0) exclusive.push([addonLeaf, addonOnly])
  }

  const lines = [
    '---',
    'title: The addon surface',
    "sidebar_label: 'Building an addon'",
    'sidebar_position: 7',
    `description: ${frontmatterString(`The ${addonEntry.leaves.length} doors an addon author imports from — what they share with the application surface, and what they do not.`)}`,
    '---',
    '',
    '# The addon surface',
    '',
    prose(addonEntry.summary),
    '',
    `An addon reaches its doors under \`#pikku/addon/*\` instead of \`#pikku/*\`: **${addonEntry.leaves.length} doors, ${total} exports**, from \`@pikku/cli@${doc.version}\`.`,
    '',
    '## An addon declares; the application wires',
    '',
    'That single rule explains almost every difference below. An addon ships functions, middleware, permissions and services — but the routes, channels and schedules that reach them belong to whoever installs it. So the addon doors are the application doors with the wiring calls taken out, and the CLI rejects an addon that tries anyway ([PKU920](/docs/pikku-cli/errors/pku920)).',
    '',
    'What an addon cannot open at all:',
    '',
    ...appOnlyDoors.map(
      (leaf) => `- \`${leaf.specifier}\` — ${cell(truncate(oneLine(leaf.summary), 150))}`
    ),
    '',
    '## Every addon door',
    '',
    'Doors marked *identical* export exactly what the application door does; follow the link for the full reference and read `#pikku/<door>` as `#pikku/addon/<door>`.',
    '',
    '| Door | Exports | Difference from the application door |',
    '| --- | --- | --- |',
    ...rows,
    '',
  ]

  if (exclusive.length > 0) {
    lines.push(
      '## Exports an addon has and an application does not',
      '',
      'These exist only on the addon surface, so they are documented here in full.',
      ''
    )
    for (const [leaf, symbols] of exclusive) {
      lines.push(`### \`${leaf.specifier}\``, '', prose(leaf.summary), '')
      const anchors = anchorsFor(symbols)
      for (const symbol of symbols) lines.push(...renderSymbol(symbol, anchors.get(symbol.name)))
    }
  }

  lines.push(
    '---',
    '',
    'Run `npx pikku doc --addon` to print this surface in the terminal, and see [Addons](/docs/addon) for how to build and publish one.',
    ''
  )

  return lines.join('\n')
}

const renderStepIndex = (stepMeta, leaves) =>
  [
    '---',
    `title: ${frontmatterString(stepMeta.label)}`,
    'sidebar_position: 0',
    `description: ${frontmatterString(truncate(oneLine(stepMeta.blurb), 155))}`,
    '---',
    '',
    `# ${stepMeta.label}`,
    '',
    prose(stepMeta.blurb),
    '',
    '| Door | Exports | What it is for |',
    '| --- | --- | --- |',
    ...leaves.map(
      (leaf) =>
        `| [\`${leaf.specifier}\`](./${leaf.name}.md) | ${leaf.symbols.length} | ${cell(truncate(oneLine(leaf.summary), 160))} |`
    ),
    '',
  ].join('\n')

const renderIndex = (doc, entryPoint, byStep) => {
  const total = entryPoint.leaves.reduce((count, leaf) => count + leaf.symbols.length, 0)
  return [
    '---',
    'title: API Reference',
    'sidebar_position: 0',
    `description: ${frontmatterString(`Every export pikku gives you, by the door you import it from — ${entryPoint.leaves.length} doors, ${total} exports.`)}`,
    '---',
    '',
    '# API Reference',
    '',
    `This is the whole surface pikku hands you: **${entryPoint.leaves.length} doors, ${total} exports**, generated from \`@pikku/cli@${doc.version}\`.`,
    '',
    prose(entryPoint.summary),
    '',
    '## You import from `#pikku`, not `@pikku`',
    '',
    'The CLI generates a barrel per concern into `.pikku`, and `package.json` maps `#pikku` onto it:',
    '',
    '```json title="package.json"',
    '{',
    '  "imports": {',
    '    "#pikku/*": "./.pikku/*"',
    '  }',
    '}',
    '```',
    '',
    "That indirection is the point. `#pikku/http` is *your* project's HTTP door — it carries your session type, your services and your function names, so `wireHTTP` knows what you may pass it. Importing the same helper from `@pikku/core` gets you the generic version with none of that.",
    '',
    '## The same thing in your terminal',
    '',
    'Everything on these pages is printed by the CLI, from the surface that ships inside the version you have installed:',
    '',
    '```bash',
    'npx pikku doc              # the index: every door, grouped as below',
    'npx pikku doc http         # one door: what it exports, and how',
    'npx pikku doc wireHTTP     # one export: signature, config keys, examples',
    'npx pikku doc http queue   # several at once',
    'npx pikku doc --ai         # the same, plus the skill to load per door',
    'npx pikku doc --addon      # the addon surface instead of the app one',
    '```',
    '',
    ':::tip For agents',
    '`pikku doc --ai` is the one to point a coding agent at. It names the skill that teaches each door, so the agent loads *how* only for the doors it actually needs — and the export list it reads is the installed version, not whatever it remembers.',
    ':::',
    '',
    '## The doors',
    '',
    'They are grouped in the order you meet them while building.',
    '',
    ...byStep.flatMap(([stepMeta, leaves]) => [
      `### ${stepMeta.label}`,
      '',
      prose(stepMeta.blurb),
      '',
      '| Door | Exports | What it is for |',
      '| --- | --- | --- |',
      ...leaves.map(
        (leaf) =>
          `| [\`${leaf.specifier}\`](./${stepMeta.slug}/${leaf.name}.md) | ${leaf.symbols.length} | ${cell(truncate(oneLine(leaf.summary), 160))} |`
      ),
      '',
    ]),
    '## Building an addon instead?',
    '',
    'An addon ships functions someone else wires, so it gets a parallel set of doors under `#pikku/addon/*` — the same shapes, minus the ones that only make sense in an application. [The addon surface](./addons.md) has every one of them, door by door, and `npx pikku doc --addon` prints the same thing.',
    '',
  ].join('\n')
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
    '[api-surface] surface.json has no "addon" entry point. The addon surface page ' +
      'is generated from it, so a missing one means the reference would silently ' +
      'stop covering addon authors.'
  )
  process.exit(1)
}

const known = new Set(STEPS.map((step) => step.step))
const unknown = [...new Set(entryPoint.leaves.map((leaf) => leaf.step))].filter(
  (step) => !known.has(step)
)
if (unknown.length > 0) {
  console.error(
    `[api-surface] surface.json introduced step(s) this script does not know: ${unknown.join(', ')}.\n` +
      'Add them to STEPS in scripts/generate-api-surface.mjs.'
  )
  process.exit(1)
}

rmSync(OUT_DIR, { recursive: true, force: true })
mkdirSync(OUT_DIR, { recursive: true })

const byStep = STEPS.map((stepMeta) => [
  stepMeta,
  entryPoint.leaves.filter((leaf) => leaf.step === stepMeta.step),
]).filter(([, leaves]) => leaves.length > 0)

writeFileSync(resolve(OUT_DIR, 'index.md'), renderIndex(doc, entryPoint, byStep))

/** door name -> the step it lives under, so the addon page can link across. */
const stepOf = new Map()
for (const [stepMeta, leaves] of byStep) for (const leaf of leaves) stepOf.set(leaf.name, stepMeta)

const addonByName = new Map(addonEntryPoint.leaves.map((leaf) => [leaf.name, leaf]))

let pages = 1
for (const [stepMeta, leaves] of byStep) {
  const dir = resolve(OUT_DIR, stepMeta.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.md'), renderStepIndex(stepMeta, leaves))
  pages++
  leaves.forEach((leaf, index) => {
    writeFileSync(
      resolve(dir, `${leaf.name}.md`),
      renderLeaf(leaf, stepMeta, index + 1, addonByName.get(leaf.name))
    )
    pages++
  })
}

writeFileSync(
  resolve(OUT_DIR, 'addons.md'),
  renderAddonSurface(doc, entryPoint, addonEntryPoint, stepOf)
)
pages++

const total = entryPoint.leaves.reduce((count, leaf) => count + leaf.symbols.length, 0)
const addonTotal = addonEntryPoint.leaves.reduce((count, leaf) => count + leaf.symbols.length, 0)
console.log(
  `[api-surface] pikku ${doc.version} — app: ${entryPoint.leaves.length} doors / ${total} exports, ` +
    `addon: ${addonEntryPoint.leaves.length} doors / ${addonTotal} exports, ${pages} pages`
)
console.log(`[api-surface] read  ${source}`)
console.log(`[api-surface] wrote ${OUT_DIR}`)
