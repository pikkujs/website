---
title: Importing n8n Workflows
description: Turn an n8n export into a runnable Pikku workflow
---

# Importing n8n Workflows

`pikku import n8n` converts an [n8n](https://n8n.io) workflow export into a
Pikku workflow graph plus stub functions. The importer is deliberately
conservative: it does the provable, mechanical conversion and leaves everything
it cannot prove as a typed stub that throws at runtime (`— implement me`), so nothing
is silently mis-translated.

```bash
pikku import n8n <file> [--out <dir>]   # -o for short
```

`<file>` is one export **or a directory** — the command reads every `.json` in
it — and either form may hold a single workflow object, a bare array
(`n8n export:workflow --all`), or a `{ workflows: [...] }` wrapper. All of those
flatten into one import per workflow. The output directory is an option, not a
positional argument; omitted, it falls back to `scaffold.functionDir`, then the
working directory.

## What it writes

For each importable workflow:

- `<slug>.graph.ts` — the workflow graph
- `<slug>.graph.agent.ts` — for AI workflows
- `<slug>.addons.gen.ts` — the addons the nodes resolve to
- `<slug>.integrations.json` — the manifest of integrations the workflow needs
- one stub function per node it could not map

A workflow that cannot be imported as-is — a cross-workflow sub-workflow
reference, a dynamic workflow target, a mid-flow `respondToWebhook` — is reported
as `[reason] message` and **skipped**; nothing partial is written for it. Across
a batch the others still import, and the command exits `1` at the end if any
failed, so read the log rather than the exit code to know what landed. Relay
every skipped workflow to whoever asked for the import.

## Triage

Every unmapped node is a stub that throws. Classify each by its JSDoc marker:

| Stub marker / signal | What it means |
| --- | --- |
| `STUB — generated from n8n node "…" (type "n8n-nodes-base.<svc>…")` | An integration the importer has no Pikku addon for |
| `STUB — generated from n8n Code node "…"` | A Code node needs translating to a Pikku function |
| A `control` stub — Loop Over Items / `splitInBatches`, Switch expression mode | Control flow that needs an explicit graph shape |
| `STUB — … vector-store …` | An unmapped store from a RAG flow — report it, don't guess |
| Importer `diagnostics` (already exited 1) | The workflow is un-importable as-is; the reason is in the log |

## Rules

- **Do not re-do what the importer did.** It is frozen on purpose: what it
  produced is the mechanical part.
- **Do not hand-edit generated files to paper over a stub.** Fix the source cause
  — the stub function, the graph node, or a missing `@pikku/addon-*` dependency.
- **Report missing integrations** rather than writing a bespoke client for one
  workflow; an addon is the reusable form.
- Finish by compiling: `pikku all` (or `pikku tsc`) should pass with no
  surviving stubs.

## Next Steps

- **[Workflows](./index.md)** — graph workflows and step semantics
- **[Graph Workflows](./graph-workflows.md)** — the graph shape the importer emits
- **[Addons](../../addon/index.md)** — packaging an integration the importer can use
