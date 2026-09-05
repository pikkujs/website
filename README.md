# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

This is done automatically by CI.

### Submodules

Two submodules feed generated content into the site, and both track `main` rather
than a pinned commit:

| Submodule | Repo | Feeds |
| --- | --- | --- |
| `.pikku-core` | `pikkujs/pikku` | The framework source the docs are checked against |
| `.template-online-shop` | `pikkujs/template-online-shop` | Every code snippet on the site, via `@snippet` markers |

```
$ yarn sync-submodules     # move both to the tip of main
$ yarn install-hooks       # run the above after every `git pull` (once per clone)
```

`git pull` on its own only ever restores the commit this repo records, so
`sync-submodules` is what "always on latest" needs. `install-hooks` writes a
`post-merge` hook that calls it; hooks are not tracked by git, so each clone runs
it once.

### Generated data

Neither of these is written by hand — edit the source and re-run:

```
$ yarn sync-snippets       # .template-online-shop -> src/data/snippets.json
$ yarn sync-api-surface    # @pikku/cli surface.json -> docs/api-reference/
```

`sync-snippets` reads `@snippet start|end <name>` markers out of the template's
`packages/functions/src`. Regions may nest, so the same lines can be published
under both a concrete name and a role-descriptive one; an unclosed or unmatched
marker is warned about rather than silently dropped.

`sync-api-surface` regenerates all 27 pages under `docs/api-reference/` from the
API surface that ships inside a *built* `@pikku/cli`. A fresh `.pikku-core`
checkout has no `surface.json` until the CLI is built there, so the script falls
back to `src/data/surface.json`, which is vendored for exactly that reason.