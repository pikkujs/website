# AGENTS.md — pikku.dev

## Rule one: the website never writes code

**Every code sample published on this site is extracted from the online-shop
example in the pikku monorepo. None of it is typed into a page, a doc, or a
component.**

Code invented for a page looks right and is wrong. It drifts the moment an API
changes, and nobody notices because nothing compiles it. Worse, it invents API
that never existed — a config key, a field, a helper — and readers then file
bugs against a framework that does not have it.

If a page needs a sample and no snippet exists, **the snippet must be added to
the example first**, where it is real code in a real project that type-checks.
Adding one to the page instead is not a shortcut, it is a defect.

### How it works

Source of truth: `examples/online-shop` inside `.pikku-core`, a git submodule
tracking [`pikkujs/pikku`](https://github.com/pikkujs/pikku). The submodule is
the whole monorepo; only the example is read, so a sparse checkout keeps it
small:

```bash
git submodule update --init .pikku-core
git -C .pikku-core sparse-checkout set examples/online-shop   # optional, local only
```

Mark a region in the example:

```ts
// @snippet start scenarioSteps
const basket = await workflow.do('Shopper opens their basket', 'getBasket', {}, { actor: shopper })
// @snippet end scenarioSteps
```

Then extract:

```bash
git submodule update --remote .pikku-core   # pull core changes first
npm run sync-snippets                      # → src/data/snippets.json + snippets-meta.json
```

And reference it:

```tsx
import snippets from '../data/snippets.json'
import { snippetSourceUrl } from '../utils/snippets'
```

Details worth knowing:

- **Regions may nest and overlap.** A page rarely wants a whole wiring file, so a
  narrow region is marked inside a wide one. Both extract independently.
- **`src/`, `db/` and `test/` are scanned**, for `.ts`, `.tsx` and `.sql`; SQL
  uses `-- @snippet start`. Scenario step definitions live under `test/`.
  TypeScript regions are run through prettier at print-width 68 so they fit a
  half-width column; SQL ships verbatim.
- **`pikku.config.json` carries no comments**, so its `scenarios` block is
  extracted by name as `scenarioConfig` in `scripts/extract-snippets.js`.
- **`snippets-meta.json` records where each snippet came from**, and
  `snippetSourceUrl(name)` turns that into a GitHub link. Show it. A sample that
  links back to a compiling file is the whole point of this rule.

### What this rule does not cover

Terminal output, console screenshots and prose are not code, so they are written
here. They are still claims: check the CLI's own formatter before inventing a
report layout, and use the real command names.

## Design

The homepage and marketing surfaces use the "paper" theme —
`src/components/PaperLayout/paper.module.css` and the `--paper-*` tokens in
`src/css/tokens.css`. Cream `#f7f5f0`, Newsreader serif, Geist Mono, burnt
orange `#c2410c`. Geist Mono is incumbent brand type; the design detector flags
it and that finding is ignored deliberately.

## Licensing, when a page mentions it

The runtime is MIT. The compiler is BSL — `@pikku/cli`, `@pikku/console` and
`@pikku/inspector` are BUSL-1.1. "Open source · MIT" as a blanket claim is
wrong.
