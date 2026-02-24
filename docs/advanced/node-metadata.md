---
title: Node Metadata
description: Categorize functions as visual nodes for graph workflows and the Console
ai: true
---

# Node Metadata

Node metadata lets you annotate your functions with visual information — display names, categories, and node types — so they can be rendered as graph nodes in the [Console](/docs/console) and used in [graph workflows](/docs/wiring/workflows/graph-workflows).

## Overview

A node is a function with extra metadata that describes how it should appear in a visual graph:

```typescript
import { pikkuSessionlessFunc } from '#pikku'

export const sendEmail = pikkuSessionlessFunc<
  { to: string; subject: string; body: string },
  { messageId: string }
>({
  func: async ({ emailService }, data) => {
    return await emailService.send(data)
  },
  title: 'Send email',
  description: 'Sends an email via the configured email service',
  tags: ['email', 'notifications'],
  node: {
    displayName: 'Send Email',
    category: 'notifications',
    type: 'action',
  }
})
```

## CoreNodeConfig

The `node` property on a function definition accepts a `CoreNodeConfig`:

| Property | Type | Description |
|----------|------|-------------|
| `displayName` | `string` | Human-readable name shown in the graph UI |
| `category` | `string` | Grouping category (e.g., `'email'`, `'database'`, `'payment'`) |
| `type` | `NodeType` | Visual behavior: `'trigger'`, `'action'`, or `'end'` |
| `errorOutput` | `boolean` | Whether the node has an error output port (default: `false`) |

## NodeType

| Type | Description | Use For |
|------|-------------|---------|
| `'trigger'` | Entry point that starts a workflow | Event sources, webhook receivers, form submissions |
| `'action'` | Processes data and passes it along | Business logic, API calls, transformations |
| `'end'` | Terminal node that completes a branch | Final responses, notifications, cleanup |

## Node Categories

Categories group related nodes in the Console UI. Configure allowed categories in `pikku.config.json`:

```json
{
  "console": {
    "nodeCategories": ["notifications", "database", "payment", "auth", "utility"]
  }
}
```

The Pikku CLI validates that all node categories in your code match the configured list. Unrecognized categories produce a build error.

## NodeMeta

When the CLI processes your code, it generates `NodeMeta` objects that combine the `CoreNodeConfig` with function metadata:

| Property | Type | Source |
|----------|------|--------|
| `name` | `string` | Function name |
| `displayName` | `string` | From `node.displayName` |
| `category` | `string` | From `node.category` |
| `type` | `NodeType` | From `node.type` |
| `rpc` | `string` | RPC name for invoking the function |
| `description` | `string` | From function `description` |
| `errorOutput` | `boolean` | From `node.errorOutput` |
| `inputSchemaName` | `string \| null` | Schema name for the input type |
| `outputSchemaName` | `string \| null` | Schema name for the output type |
| `tags` | `string[]` | From function `tags` |

## Generating Node Metadata

The CLI generates node metadata files automatically:

```bash
npx pikku
```

This produces JSON files in the `.pikku/` output directory that the Console reads to render the graph UI.

## Use Cases

- **Graph workflow builder** — Nodes appear as draggable elements in the Console's graph editor, categorized by type
- **Function discovery** — The category and type annotations make it easier to browse large function registries
- **External packages** — Published Pikku packages can include node metadata so their functions appear correctly in the consumer's Console
