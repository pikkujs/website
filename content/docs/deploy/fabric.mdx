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
targets), see the [deploy overview](/docs/deploy) instead — the two paths share
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

| Command                                                                      | What it reads                                                    |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `pikku fabric status`                                                        | Current stage status                                             |
| `pikku fabric logs`                                                          | Stage logs                                                       |
| `pikku fabric report`                                                        | A consolidated report for a stage                                |
| `pikku fabric metrics`                                                       | Time-series metrics                                              |
| `pikku fabric trace`                                                         | Request traces                                                   |
| `pikku fabric errors`                                                        | Recent errors                                                    |
| `pikku fabric findings list\|flush\|clear`                                   | Verification findings                                            |
| `pikku fabric changes list\|show\|file\|next\|claim\|ask\|reply\|shot\|done` | The change board for a project — see [below](#the-changes-queue) |
| `pikku fabric projects`                                                      | Projects you can reach                                           |

This is the subset you will reach for day to day. `pikku fabric --help` lists
every command, and `pikku fabric <command> --help` its flags.

## The changes queue

Someone reviewing a deployed stage circles what is wrong and files it; each
filing becomes an item on the project's change board, numbered `#1`, `#2`, …
The checkout linked to that project is where the items get worked. An item can
be named by its number (`7`, `#7`) from inside the linked checkout, or by its
uuid from anywhere.

```bash
pikku fabric changes next --claim --claimed-by claude-code   # wait for work, claim it
pikku fabric changes show 7                                  # read an item and its thread
pikku fabric changes done --change-id 7 --note "…"            # close it, recording branch and commit
```

`next` blocks until there is something to do, prints it and exits, so a harness
can run it in the background and be woken on exit. It is woken by the project's
change events the moment an item is filed or answered, re-reads the board each
time, and still checks every three minutes as a safety net. A just-filed item is
held for about a minute so a batch being typed arrives together; `next` sleeps
exactly until the soonest held item becomes claimable, and `list` and `show`
print when that is (`claimable at 14:05`). If the event stream is unavailable it
falls back to checking every `--interval` seconds.

| exit code | meaning                                                             |
| --------- | ------------------------------------------------------------------- |
| `0`       | work printed — claimed items, and/or answers to questions you asked |
| `2`       | `--timeout` or `--once` found nothing                               |
| `3`       | the session was refused; run `pikku fabric login`                   |
| `1`       | anything else, such as fabric unreachable for minutes               |

There are three ways to speak on an item's thread, and they differ in what they
do to its status:

| command                               | status afterwards                               | use it for                                               |
| ------------------------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| `ask --change-id <id> --question "…"` | `needs_answer` — parked until the filer answers | a decision only they can make; `--option` offers choices |
| `reply <id> --message "…"`            | unchanged                                       | "not doing this, because…", "blocked on X"               |
| `done --change-id <id> --note "…"`    | `done`                                          | what was changed                                         |

`reply --image path` attaches a screenshot as evidence, for instance of what you
saw when an issue would not reproduce; `shot` attaches rendered options for the
filer to pick between.

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
pikku fabric addon verify [dir]
pikku fabric addon publish [dir]
pikku fabric addon add <id>
```

`verify` and `publish` take the addon package directory (defaulting to the
current one); `add` takes a registry id and installs that published addon into
the current project.

## Next Steps

- **[Deploy overview](/docs/deploy)** — providers, grouping and the deployment manifest
- **[Storage](/docs/storage)** — database backends, including libSQL/SQLite
