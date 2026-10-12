# @pikku/theme-brand

The paper-and-clay brand shared by pikku.dev and pikkustudio.app: CSS-variable tokens, plain-CSS utilities, font fallbacks, and the React pieces (Blob character, SVG defs, four-step pattern). Change a token here and both sites pick it up.

Status: local workspace package, unpublished, `private: true`. It lives at `packages/brand` in the pikku.dev repo and is written so it can move to its own repo unchanged. Values were taken from the pikkustudio.app working tree (commit 667830c, apps/website/src/styles.css and palettes.generated.css, paper palette) on 2026-10-12. This package is now the source of truth.

## What is inside

| File | What |
| --- | --- |
| `src/tokens.css` | Every colour, font, radius and shadow as a CSS variable, light on `:root`, dark on `:root.dark` and `:root[data-theme=dark]`. Also `--grain`, `--grain-dark`, `--scribble`. |
| `src/utilities.css` | `.display .hand .btn-ink .btn-line .btn-cream .btn-ghost .btn-solid .field .fld .torn .scribble .nav-link .tbc .soon .facts .band .eyebrow`, focus ring, grain body background, Blob animations. Variables only, no Tailwind. |
| `src/fonts.css` | Metric-matched fallback `@font-face`s (`Fraunces Fallback`, `Work Sans Fallback`). |
| `src/tailwind-theme.css` | Generated `@theme` block (colours and fonts) so Tailwind v4 makes `bg-paper`, `text-claydeep`, `font-display`. Generated from `tokens.css` by `npm run gen`, so values live in one place. |
| `src/index.ts` | `Blob`, `BlobMark`, `BLOB_POSES`, `SvgDefs`, `Steps`, `GOOGLE_FONTS_HREF`. |

## Consume it

```json
"workspaces": ["packages/brand"], "dependencies": { "@pikku/theme-brand": "*" }
```

```css
@import 'tailwindcss';                         /* optional, only if you use Tailwind */
@import '@pikku/theme-brand/tailwind-theme.css';
@import '@pikku/theme-brand/fonts.css';
@import '@pikku/theme-brand/tokens.css';
@import '@pikku/theme-brand/utilities.css';
@source '../packages/brand/src';               /* Tailwind only: Steps uses utility classes */
```

In the document head load the fonts (`GOOGLE_FONTS_HREF`, with preconnects to fonts.googleapis.com and fonts.gstatic.com) and render `<SvgDefs />` once near the top of `<body>` (the Blob scenes and `Steps` use `#rough`, `#wash`, `#cur`).

Dark mode: the consumer sets `data-theme="dark"` or class `dark` on `<html>`. Light is the default and there is no `prefers-color-scheme` switching in the package; pikku.dev's toggle stores the choice in localStorage and sets `data-theme` before first paint.

## Overriding (palettes)

Token names follow Studio's Tailwind theme (`--color-paper`, `--color-clay` ...). `@pikku/theme-studio` palettes already override exactly these names with `:root[data-palette='x']` and `:root.dark[data-palette='x']`, which out-specify the defaults here, so layering works with no changes: import `tokens.css` first, then the palette css. A site can also override one token locally (`:root { --color-clay: #b0380a }`) after the import.

Site-only aliases (pikku.dev keeps `--paper-*` names for its components) belong in the site, mapped onto `--color-*`; they are not part of the package.

## Contrast rule

`--color-clay` (#c2410c) is for fills, strokes and large text (24px+, or 18.66px bold). Small accent text uses `--color-claydeep` (#9a3412). Faint text uses `--color-faint` on paper; on dark paper `--color-faint` is below 4.5:1, use `--color-soft`.

## Change a token once

Edit the value in `src/tokens.css` (light block, and the dark block if dark differs), run `npm run gen` (regenerates `tailwind-theme.css`), commit. Each site updates by bumping or re-linking the package; no other file holds a copy.

## Versioning

Semver, once published. Token renames and removals are breaking (major); new tokens, utilities and components are minor; value tweaks are patch. Until a decision on publishing is made the version is `0.0.1`, private, and consumed through npm workspaces (or as a git dependency after the move to its own repo).
