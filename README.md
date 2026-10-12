# pikku.dev

The Pikku website: marketing pages, docs, blog, the SDK explorer and the addon / OpenAPI catalogue.

Built with TanStack Start (Vite 8, React 19, Tailwind 4) and Fumadocs in headless mode for content. The site is
fully static: everything is prerendered into `dist/client` at build time and published to GitHub Pages
(`pikku.dev`). There is no server at runtime.

## Commands

```sh
npm ci --legacy-peer-deps   # install (needs the legacy flag for peer ranges)
npm run dev                 # dev server on http://localhost:3005
npm run build               # prerender everything into dist/client (the published site), runs the link gate
npm run preview             # serve dist/client the way GitHub Pages does (directory index, 404.html with status 404) on http://localhost:3000
npm run typecheck           # generate the route tree, then tsc --noEmit (works on a clean checkout)
npm run check-links         # re-run the link gate on dist/client
node scripts/smoke.mjs      # starts the Pages emulation and checks routes, redirect pages, 404s, CNAME
node scripts/audit-render.mjs   # structural audit of the rendered HTML (h1s, titles, empty pages)
npm run sync-snippets       # regenerate src/data/snippets.json from the template submodule
npm run sync-registry       # refresh the vendored addon / OpenAPI catalogue (needs network)
node scripts/gen-redirects.mjs  # regenerate the static redirect pages in public/ (old URLs that moved)
```

Use Node 22 or newer. `vite dev` is fine for most work; the `/api` SDK explorer is browser-only and is best checked
against `npm run build && npm run preview`.

## Structure

| Path | What lives there |
| --- | --- |
| `content/docs`, `content/blog` | All prose, as `.mdx`. Sidebar order comes from `meta.json` files. |
| `src/routes` | File routes. Marketing pages are thin wrappers around `src/views`; `docs.$` and `blog.*` render content from prerendered JSON payloads. |
| `src/views` | Marketing page bodies (home, developers, features, wires, core, deploy, openapis, addons). |
| `src/components` | Paper-theme kit (`PaperLayout`), MDX components, `site/` (navbar, footer, search, theme toggle, 404). |
| `src/lib` | Content source, payload builders, SEO helpers, search index, catalogue loaders. |
| `src/styles` | Tokens (`--paper-*`), base, prose, shell, docs, animation CSS. |
| `src/data` | Generated and vendored data: `snippets.json`, `surface.json`, catalogue JSON. |
| `packages/vite-link-check` | The prerender link gate. Policy lives in `link-gate.config.mjs`. |
| `plugins` | Build plugins (feeds / sitemap, Shiki themes, remark snippets). |
| `public` | Static assets, `robots.txt`, `CNAME`, static redirect pages. |

## Content rules

- **No code in the website.** Every TypeScript example is a snippet from the template project, referenced from MDX as
  ` ```typescript @snippet <id> `. Never hand-write a TS example in a doc, and never edit
  `src/data/snippets.json` by hand.
- Snippets come from the `.template-online-shop` submodule. To change an example: edit it there, push, run
  `npm run sync-snippets`, and commit the submodule bump together with the regenerated JSON.
- AI-generated pages carry `ai: true` in their frontmatter, which shows the disclaimer banner.
- There is no Console. Do not add Console links or docs.
- Deleted pages that must not be linked again: `/pricing`, `/use-cases/*`, `/instant-reload`, `/manual-setup`.

## The link gate

`npm run build` crawls every prerendered page and fails on any internal link or `#anchor` that does not resolve.
`link-gate.config.mjs` is the single place that lists exceptions: routes without prerendered HTML (`ssrRoutes`, empty), pages not yet
ported (`pendingPages`, empty) and ignored patterns.

## Catalogue

`/addons` (218 addons) and `/openapis` (2,523 specs) are fully prerendered, one HTML page each, and nothing calls the
hosted registry at runtime. The data is the vendored snapshot: `src/data/addons.json`, `public/registry/openapis.json`
and the generated per-spec detail files in `src/data/openapi-specs/` (untracked), refreshed by `npm run sync-registry`
in CI (best effort: if the registry is down the committed snapshot is used).

`scripts/gen-data.mjs` (run by `build` and `dev`) splits that snapshot into small files under `__data/`; the prerender
reads them from disk and client-side navigation fetches them (`/__data/openapis-browse.json` for the table,
`/__data/openapis/<slug>.json` and `/__data/addons/<slug>.json` for details).

Why prerender all 2,523 spec pages rather than a client-rendered detail page behind the `404.html` fallback: it
costs about 20 s and 2 GB of build memory, the published site stays far below Pages' 1 GB limit, every page is
indexable with a real 200, and the link gate checks every link on them. A client-rendered fallback would serve those
pages with HTTP 404 and need the router to boot from `404.html`.

## Deploy (GitHub Pages)

`.github/workflows/main.yml` runs on every push to `main`: checkout (with submodules), `npm ci --legacy-peer-deps`,
`sync-snippets`, best-effort `sync-registry`, `typecheck`, `build` (includes the link gate), then uploads `dist/client`
with `actions/upload-pages-artifact` and publishes it with `actions/deploy-pages` in the `github-pages` environment.
The repository's Pages source stays "GitHub Actions". `.github/workflows/branch.yml` runs the same checks without
deploying on pull requests and non-main pushes.

What Pages needs is in `public/`: `CNAME` (`www.pikku.dev`, the custom domain), `.nojekyll`, `robots.txt`. The build
also writes `404.html` (the paper-themed not-found page; Pages serves it with status 404 for unknown paths) and
`sitemap.xml` and the RSS / Atom feeds.

Pages cannot redirect, so every old URL that moved is a small static page with `<meta http-equiv="refresh">`, a
canonical link and a JS fallback (`/fabric` goes to pikkufabric.com, `/wires/bot` to `/wires/agent`, the old
`/docs/api-reference/*` URLs to `/api`). They are generated by `node scripts/gen-redirects.mjs` into `public/`.
Directory URLs follow Pages' behaviour: `/docs/x` redirects to `/docs/x/` and serves `docs/x/index.html`; canonical
URLs, the sitemap and the link gate use the slashless form, as the previous site did.

## Brand

Tokens, utilities, fonts, the Blob character and SVG defs come from the workspace package `packages/brand` (`@pikku/theme-brand`), shared with pikkustudio.app. See `docs/BRANDING.md`. `npm run gen:brand` regenerates its Tailwind theme file (the build does this).
