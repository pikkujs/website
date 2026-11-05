# Branding

pikku.dev and pikkustudio.app share one brand package, `@pikku/theme-brand` (`packages/brand`, see its README for usage).

- Source of the first values: the pikkustudio.app working tree (apps/website, commit 667830c, which was mid-edit), copied 2026-10-12. The package is now the source of truth.
- pikku.dev imports it from the workspace. `src/styles.css` only imports the package plus site rules; `src/styles/tokens.css` maps the brand `--color-*` tokens to the `--paper-*` aliases the page modules use.
- The logo and mascot are the Pikku chameleon: `Pk` (the `#pk` symbol in `SvgDefs`, takes `currentColor`) in the site chrome and illustrations, `pikku.png` as the social-share image and the `.ico`/PNG favicons. Pikku is its own brand: the Blob is Studio's and is not used here.
- Fonts: Fraunces, Caveat, Work Sans from Google Fonts (same URL as Studio, in `GOOGLE_FONTS_HREF`). No monospace webfont: Studio has none, code uses the platform's `ui-monospace` stack.
- Contrast: clay for fills and large text, claydeep for small accent text. Dark mode faint text uses soft (Studio's faint fails on dark paper).

## Making a brand change

1. Edit `packages/brand/src/tokens.css` (or `utilities.css`).
2. `npm run gen:brand` if a colour or font token changed.
3. `npm run build` and `npm run console-audit`.

## Proposal for Studio

Studio would delete the `@theme` colour/font block and the utilities from `apps/website/src/styles.css`, and import `@pikku/theme-brand` instead (`tailwind-theme.css`, `fonts.css`, `tokens.css`, `utilities.css`). `palettes.generated.css` stays as is and overrides the same names. The Blob stays in Studio (`packages/blob`); this package no longer ships it, and its `SvgDefs` and `Pk` are Pikku's chameleon. Not applied; the Studio repo was not touched.

Open questions for the user: package name, npm org and repo home; publish to npm or consume as a git dependency; who owns releases; licence (Studio packages are BUSL-1.1, pikku is MIT).
