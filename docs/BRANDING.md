# Branding

pikku.dev and pikkustudio.app share one brand package, `@pikku/theme-brand` (`packages/brand`, see its README for usage).

- Source of the first values: the pikkustudio.app working tree (apps/website, commit 667830c, which was mid-edit), copied 2026-10-12. The package is now the source of truth.
- pikku.dev imports it from the workspace. `src/styles.css` only imports the package plus site rules; `src/styles/tokens.css` maps the brand `--color-*` tokens to the `--paper-*` aliases the page modules use.
- The mascot is the Blob (`Blob`, `BlobMark`). The old chameleon (#pk symbol, pikku.png) is gone from the UI. `public/img/pikku.png` is still the social-share image in `src/lib/seo.ts` and has not been regenerated.
- Fonts: Fraunces, Caveat, Work Sans from Google Fonts (same URL as Studio, in `GOOGLE_FONTS_HREF`). No monospace webfont: Studio has none, code uses the platform's `ui-monospace` stack.
- Contrast: clay for fills and large text, claydeep for small accent text. Dark mode faint text uses soft (Studio's faint fails on dark paper).

## Making a brand change

1. Edit `packages/brand/src/tokens.css` (or `utilities.css`).
2. `npm run gen:brand` if a colour or font token changed.
3. `npm run build` and `npm run console-audit`.

## Proposal for Studio

Studio would delete the `@theme` colour/font block and the utilities from `apps/website/src/styles.css`, `src/components/{Blob,Pk}.tsx` and `blobPoses.ts`, and import `@pikku/theme-brand` instead (`tailwind-theme.css`, `fonts.css`, `tokens.css`, `utilities.css`, `SvgDefs`, `Blob`). `palettes.generated.css` stays as is and overrides the same names. Note that Studio also has `packages/blob` (`@pikku/blob-studio`) with its own Blob renderer: the two Blob implementations should be merged, not carried in three places. Not applied; the Studio repo was not touched.

Open questions for the user: package name, npm org and repo home; publish to npm or consume as a git dependency; who owns releases; which Blob implementation wins; licence (Studio packages are BUSL-1.1, pikku is MIT).
