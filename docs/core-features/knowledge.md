---
title: Knowledge Base
description: Markdown notes that say what the app is, in the language its users use
---

# Knowledge Base

The knowledge base is `knowledge/` at the repo root: markdown notes about **what
the app is**, written for whoever picks the project up next — human or agent. It
is maintained by the `@pikku/knowledge` package and the `pikku knowledge`
commands.

:::info What belongs here
Pikku already knows every function, route, schema, table, queue, cron, channel
and permission — `pikku meta` prints them, and the generated meta is the truth.
Notes are for what no generator can derive: what a thing *means*, why a rule was
chosen, what it rules out, and what is still unanswered.
:::

## The note

A note is a markdown file whose **path is its identity** — moving it renames it.
It carries YAML frontmatter and a body:

```markdown
---
type: decision
title: Revocation ends a grant
description: A revoked grant stops working immediately, everywhere.
resource: func:revokeGrant, table:grant
tags: [sharing, access]
---

# Revocation ends a grant

When an owner revokes a grant, the person loses access on their next request —
no grace period and no scheduled cleanup.
```

| Field | Meaning |
| --- | --- |
| `type` | **The only required field**: `slice`, `milestone`, `entity`, `decision`, `note` or `overview` |
| `title` | What to call the note in a listing (falls back to the first heading, then the filename) |
| `description` | One line, used as the note's subtitle in a section index |
| `resource` | Comma-separated `<kind>:<id>` URIs — the code this note is about, e.g. `func:revokeGrant, table:grant` |
| `tags` | Flow list (`[a, b]`) or a `- item` block |
| `timestamp` | When it was written, if it matters |

`index.md` and `log.md` are reserved: an `index.md` maps a directory, a `log.md`
is an append-only record.

## Layout

```
knowledge/
  index.md                    # type: overview — the map
  slices/
    index.md
    01-the-daily-entry.md
  entities/
    index.md
    entry.md
  decisions/
    index.md
    revocation-ends-a-grant.md
    security/
      index.md
      one-account-one-person.md
  questions/
    index.md
    who-owns-a-shared-day.md
  wishlist/
    index.md
    export-to-a-calendar.md
```

Each section answers exactly one question:

| Section | The question it answers |
| --- | --- |
| `slices/` | What is one buildable piece of this app, and what proves it works? |
| `entities/` | What is this thing, in the words users use for it? |
| `decisions/` | What was chosen, and what does that rule out? |
| `decisions/security/` | Who may do what? |
| `questions/` | What has been asked and not yet answered? |
| `wishlist/` | What does somebody want that nobody has asked to be built? |

Create a section the same turn you have a note for it — never a scaffold of
empty directories, and never a section without its own `index.md`.

## CLI

```bash
pikku knowledge validate   # check the base against the app-project profile, resources included
pikku knowledge index      # refresh every index.md to list what is actually in it
pikku knowledge next       # say the one thing to do next: repair, plan, ask, build, or nothing
```

`pikku knowledge index --check` reports stale indexes without writing, for use as
a CI gate.

Plans live beside the notes, one per milestone:

```bash
pikku knowledge plan schema            # print the plan schema
pikku knowledge plan show <milestone>  # print a milestone's plan
pikku knowledge plan progress <milestone>  # what the milestone still owes its plan
pikku knowledge plan set <milestone> <file>  # validate and write a plan
pikku knowledge plan defer <milestone>       # record why a plan item is deferred
```

`plan show --for-build` renders the plan as the ordered list of work a build
follows, rather than as stored. Validation compares the plan against the
milestone note; `plan set` refuses to write a plan that does not conform and
says what is wrong instead.

## Next Steps

- **[Scenarios](./scenarios.md)** — the executable half of "what the app should do"
- **[Pikku Meta](../api/meta-service.md)** — what the generator already knows
