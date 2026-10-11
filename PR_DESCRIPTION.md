# Move pikku.dev to TanStack Start + Fumadocs on a Cloudflare Worker

## Summary

Replaces the Docusaurus site with a TanStack Start app (Vite 8, React 19, Tailwind 4) using Fumadocs in headless mode
for content, deployed as a single Cloudflare Worker with static assets. All 293 old public URLs still resolve, the
paper theme is carried over (with a working light/dark toggle), and search is a local command palette with no Algolia.

## Why

- Memory: the Docusaurus build needed about 3.3 GB and was fragile in CI (yarn shim, two lockfiles).
- Dogfood: the site now runs on the stack we recommend (TanStack, Cloudflare, Fumadocs-style content).
- Control: routing, head/SEO, redirects, and the catalogue SSR are our own code, not plugin behaviour.

## Architecture

- `content/docs`, `content/blog`: `.mdx`, compiled by fumadocs-mdx. Shiki highlights at compile time (dual theme via CSS variables), so no highlighter ships to the Worker.
- Docs and blog are prerendered to HTML plus static JSON payloads (`/payload/**.json`); the client navigates by fetching JSON.
- Marketing pages are prerendered React routes (`src/routes/*` mounting `src/views/*`).
- `/addons` and `/openapis` are SSR on the Worker, reading generated data through the `ASSETS` binding; the browse table uses `/registry-data/openapis.json` (hosted registry with vendored fallback).
- Search: a 136 KB prerendered `/search-index.json` (titles, descriptions, headings) loaded on first open of the cmd/ctrl-K palette.
- Link gate (`packages/vite-link-check`) runs inside the build and fails on any broken internal link or anchor.
- Redirects: `public/_redirects` (`/fabric`, `/wires/bot`) and generated static pages for the 29 old `/docs/api-reference/*` URLs.

## What changed

- Root is now the TanStack app; `legacy/` (Docusaurus config, theme swizzles, plugins) is deleted. History keeps it.
- New shell: navbar with mega menu, developer/platform pill, search, theme toggle, mobile sheet, footer, 404.
- Docs layout (collapsible tree, TOC, breadcrumbs, pager), blog index/tags/posts, RSS and Atom feeds, sitemap, robots, favicons, OG/canonical per page, GA only in production.
- Workflows rewritten: npm-based build, Cloudflare deploy on `main`, preview version uploads on branches. GitHub Pages deploy removed.
- README.md and CLAUDE.md rewritten for the new stack.

## Before / after

| | Docusaurus (main) | This branch |
| --- | --- | --- |
| Build peak memory | about 3.3 GB | 3.1–3.6 GB across runs (no real saving on build; see gaps) |
| Build wall time | n/a here | about 16 s warm cache, 1 to 2 min cold |
| Pages | 293 routes | 328 prerendered HTML files + 2 SSR routes (addons, openapis) |
| Search index | about 10 MB | 136 KB (titles, descriptions, headings) |
| Worker | n/a | 2613 KiB total, 563 KiB gzip |
| Link gate | n/a | 328 pages, 30,186 links, 0 broken |

## URL compatibility

Old route set (docs ids and slugs, blog `/YYYY/MM/DD/slug`, `src/pages/*`, `/blog`) computed from the last Docusaurus commit
(`scripts/url-diff.py`): 293 URLs. 290 exist as prerendered HTML. Missing: `/openapis` (now Worker-rendered, 200),
`/fabric` (301 to https://pikkufabric.com), `/wires/bot` (301 to `/wires/agent`). The 29 `/docs/api-reference/*` URLs
redirect to `/api` or `/api#app/<name>`. Result: every old public URL returns 200 or a redirect.

## Known gaps

- The hosted registry API (`api.pikkustudio.app`) was down during development, so the vendored fixture backs the catalogue.
- The real Cloudflare deploy and the DNS cutover were not run; workflows are written but never executed.
- Build peak memory is 3.1–3.6 GB depending on the run (cold runs are higher), about the same as Docusaurus. The win is the dev server (about 1.1 GB after a handful of requests) and build control, not build memory. The cause is likely that the prerender crawls everything in one process; reducing it needs splitting the prerender.
- Marketing views still contain some hand-written code strings (core/versioning GitHub Actions YAML, wiring examples on the wires pages, Azure deploy strings). They predate this work but violate "no code in the website" and should become template snippets.
- axe (WCAG A/AA) still reports colour-contrast on decorative handwriting and some code tokens on `/developers` and `/`; alt text, landmarks, skip link, focus styles and the 404 title are fixed.
- Docs "last updated" dates are not shown.

## Cutover checklist

1. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets and a `production` environment.
2. Merge, let `main.yml` deploy, check the `*.workers.dev` URL.
3. Attach `pikku.dev` and `www.pikku.dev` as custom domains to the `pikku-site` Worker; remove GitHub Pages DNS records.
4. Disable GitHub Pages in settings.
5. Smoke test `/`, `/docs`, `/blog`, `/addons`, `/openapis`, `/fabric`, an old blog URL, `/nope` (404).

## Test plan

- [ ] `npm ci --legacy-peer-deps && npm run build` passes (link gate 0 broken)
- [ ] `npx tsc --noEmit` clean, `node scripts/audit-render.mjs` OK
- [ ] `npm run preview`, then click through home, developers, getting-started, a docs page, a blog post, /api, /addons, /openapis, 404 in light and dark at desktop and phone widths
- [ ] cmd/ctrl-K finds "middleware" and navigates
- [ ] `/fabric`, `/wires/bot`, `/docs/api-reference/wire/http` redirect

🤖 Generated with [Claude Code](https://claude.com/claude-code)
