# Goal: the dev docs cover all of full-stack Pikku

Pikku is now full-stack: backend wirings, frontends, native apps, deploy, and
the services underneath. The APIs are still settling, but the concepts are not.
The docs must explain every concept we have, so that only API details change
from here on. Developer docs only. The Console is out of scope for now (Studio
comes later).

## Source of truth

There are **two inventories**, and both must be covered. The import surface
alone is not enough: plenty of full-stack functionality is reached through the
CLI, config and generated files rather than an import.

**1. The import surface.** `static/api-surface.json` is the inventory of what
you can import. Regenerate it first with `npm run sync-api-surface` (it goes
stale when core moves). Then: It has two entry points, `app`
("build an app") and `addon` ("build an addon"), each with leaves (function,
setup, addon, error, middleware, secrets, variables, channel, cli, gateway,
http, mcp, queue, scheduler, trigger, auth, scopes, agent, workflow,
scenarios). Each leaf lists its `symbols`. Where the JSON and older docs
disagree, the JSON wins. Check anything it doesn't answer against core main
(`/Users/yasser/git/pikku/pikku`), not against memory.

**2. Everything the CLI touches.** Build this inventory from
`packages/cli/src/cli.wiring.ts` and `packages/cli/src/utils/pikku-cli-config.ts`:
- every command and every **subcommand**, with every option, short flag and default
- every `pikku.config.json` key, including each `scaffold.*` flag
- every generated file and where it lands
- every platform the CLI builds for: web, **iOS and other native apps, desktop
  apps (Tauri)**, and the runtimes `pikku deploy` targets
- the Fabric flows: deploy, `fabric changes` (the changes queue), addons, login

Also compare core's wirings (`packages/core/src/wirings/*`) and services
against the docs, since a concept can exist in core before it reaches the
surface JSON (feature flags and virtual users did).

## Done when

0. **Both inventories are written down.** Keep a coverage table with one row
   per leaf, per CLI command/subcommand, per config key and per platform, each
   mapped to a page and a status. A symbol only counts as covered when a page
   explains it, not when it's merely named in an error page, a generated-files
   list or an import list.
1. **Every leaf has a home.** For each leaf under both entry points, a docs
   page (or a clearly titled section of one) explains the concept, shows a
   working example, and links to the reference. Build a coverage table in
   `docs/` or in the PR description: leaf → page → status. No leaf is left
   unmapped.
2. **Every public symbol is documented.** Every symbol listed under a leaf
   appears in the docs with its real signature, or is deliberately excluded
   with a one-line reason in the coverage table. The `app` and `addon` entry
   points are kept distinct: say which one a symbol belongs to.
3. **The full-stack story is complete, not just the wirings.** Beyond the
   leaves, cover what makes it full-stack:
   - frontends (React, i18n, UI packages) and how they connect to wired functions
   - native apps (`pikku app`)
   - deploy (`pikku deploy`, Fabric, each runtime)
   - the services layer (`docs/api/*`) and storage
   - the CLI (`pikku dev`, codegen, config, error codes)
   - addons: using them, building them, and the `app` / `addon` split

   Check the sidebar for gaps in this list and add pages for what's missing.
4. **Concepts first, APIs second.** Each page opens with what the thing is for
   and when to reach for it, then the API. Concept pages shouldn't need
   rewriting when a signature changes, so keep signatures in snippets and
   reference sections, not in prose.
5. **No Console.** Remove every Console mention:
   - `docs/console/` (all three pages) and its sidebar entry
   - every `/docs/console` link (secrets, variables, oauth2, workflows, AI
     agents, storage/*, core-features, deploy/fabric, docs/index.mdx)
   - `pikku serve --console` and the other Console flags in the CLI docs
   - the `FeaturesMegaMenu` entry, the terminal URL in
     `src/components/PaperLayout/index.tsx`, and the shipped-addons entry

   Rewrite sentences that leaned on the Console (for example "manage secrets
   in the Console") so they still make sense, or delete them. Don't leave
   dangling links. Leave `src/components/Surface/` provenance comments alone.
6. **Everything builds and is true.** Code examples match the current API
   (use generated snippets from `snippets.json` where they exist; never edit
   it by hand). `npm run build` passes with no broken links. Pages written by
   AI carry `ai: true`.

## Out of scope

- Studio docs (later).
- Marketing pages and the homepage (separate brief).
- Blog posts and the comparison pages.
- Migration or deprecation notes. There are no live users.

## How to work

- Start with the coverage table, then fill the gaps leaf by leaf. The table is
  the progress tracker.
- Use the `pikku-website-guide`, `pikku-website-api-doc` and
  `pikku-website-error-doc` skills for page format.
- Land it in small PRs, one per area (Console removal first, then one per leaf
  group). Don't build one giant branch.
- Keep the voice casual, honest and developer-to-developer.
