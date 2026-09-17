---
title: Pikku Fabric
description: Deploy and operate apps on the Pikku Fabric serverless platform
---

# Pikku Fabric

Pikku Fabric is the hosted serverless platform for Pikku apps. Every Fabric app
runs on Cloudflare Workers with a SQLite database (libSQL/Turso), and the
`pikku fabric` command group is the whole control surface: authenticate, link a
project, validate, deploy, and read back what a stage is doing.

For self-managed deployments (your own Cloudflare, AWS, Azure or standalone
targets), see the [deploy overview](./index.md) instead — the two paths share
config concepts but not commands.

## Getting started

```bash
pikku fabric login     # authenticate against fabric-api
pikku fabric init      # initialise the project for Fabric
pikku fabric link      # link the project to a Fabric app
```

Authentication is browser-based by default; `--api-key` uses a static API key
instead.

## Validate before anything else

```bash
pikku fabric validate --json
```

Validation checks the project structurally — missing files, misconfigured
fields, dependency gaps — and prints each finding with a `fixHint`. Address all
`error` findings before deploying: they block the deploy. `warn` findings predict
runtime failures and should be resolved before testing; `info` findings are
best-practice gaps that are safe to defer.

```bash
pikku fabric smoke     # run the local verification pass
```

## Deploy

```bash
pikku fabric deploy apply      # build and deploy the stage
pikku fabric deploy list       # list deployments
pikku fabric deploy units      # show the deployment units
pikku fabric rollback          # roll a stage back
```

Fabric apps use SQLite via libSQL, accessed with Kysely and the libSQL adapter.
Migrations are plain `.sql` files at the project root under `db/sqlite/` — never
`db/migrations/`. Locally, `pikku db migrate` runs them against a local `dev.db`
SQLite file; Fabric injects `DATABASE_URL` as a variable binding when a stage
starts.

## Operate

| Command | What it reads |
| --- | --- |
| `pikku fabric status` | Current stage status |
| `pikku fabric logs` | Stage logs |
| `pikku fabric report` | A consolidated report for a stage |
| `pikku fabric metrics` | Time-series metrics |
| `pikku fabric trace` | Request traces |
| `pikku fabric errors` | Recent errors |
| `pikku fabric findings list\|flush\|clear` | Verification findings |
| `pikku fabric changes list\|show\|file\|claim\|ask\|shot\|done` | The change board for a project |
| `pikku fabric projects` | Projects you can reach |

## Secrets, variables and data

```bash
pikku fabric secrets set|list|delete|rotate
pikku fabric variables set|get
pikku fabric db schema
pikku fabric domains list|add|remove
```

Secrets and variables mirror the app's `defineSecret` / `defineVariable`
declarations: provision the same names the app already reads. `db schema` is the
safe introspection surface for the attached database — inspect it there rather
than connecting with credentials.

## Addons

```bash
pikku fabric addon verify|publish|add
```

`verify` and `publish` work on an addon package; `add` installs a published addon
into the current project.

## Next Steps

- **[Deploy overview](./index.md)** — providers, grouping and the deployment manifest
- **[Storage](../storage/index.md)** — database backends, including libSQL/SQLite
- **[The Console](../console/index.md)** — the runtime view of a deployed stage
