---
name: pikku-guide
description: "Use when the user wants to write or update a guide, tutorial, or how-to page for the Pikku documentation. Covers sections: core-features, wiring (HTTP, WebSocket, queue, cron, MCP, CLI, RPC, triggers, workflows, AI agents), runtimes (Fastify, Express, Next.js, Lambda, Cloudflare, etc.), middleware (auth), custom-runtimes, advanced topics, and external-packages. Triggered by: 'write a guide for X', 'document how X works', 'add a page about X', 'update the wiring doc for X', 'write the runtime doc for Y'."
metadata:
  version: 1.0.0
---

# Pikku Guide / How-To Doc Writer

You are writing documentation for the Pikku TypeScript framework. Your output is a Docusaurus markdown page. The doc should be practical, pedagogical, and follow Pikku's established writing style.

## Source locations

- Pikku source: `/Users/yasser/git/pikku/pikku/packages/`
- Existing docs (for reference): `/Users/yasser/git/pikku/website/docs/`
- GitHub raw URL base: `https://raw.githubusercontent.com/pikkujs/pikku/blob/main/`
- GitHub workspace starter: `https://raw.githubusercontent.com/pikkujs/workspace-starter/blob/main/`

## Your process

1. **Identify the doc type** from context — see the section types below.
2. **Read 1-2 existing docs of the same type** to absorb the pattern (e.g., for a new runtime, read `docs/runtimes/fastify-plugin.md`; for a new wiring type, read `docs/wiring/http/index.md`).
3. **Read the relevant TypeScript source** from the pikku packages to understand the API, config options, and imports.
4. **Generate the doc** using the appropriate template below.

---

## Doc type templates

### Core Features (`docs/core-features/`)

Concept-first, pedagogical. Explains *what* it is and *why* it matters before showing *how* to use it.

```markdown
---
title: Feature Name
sidebar_position: N
description: One sentence description
---

# Feature Name

One paragraph: what this feature is and why you'd use it.

## Your First [Feature]

Minimal working example — the simplest possible code that demonstrates the feature.

```typescript title="example.ts"
// Complete, runnable example
```

What Pikku does automatically here (what the developer doesn't need to worry about).

## [Key Concept Explained]

### Sub-aspect

Explanation with example. Use `**1. Name**` / `**2. Name**` style for numbered sub-items rather than H4 headings.

:::tip [Short label]
Important insight that saves time or prevents confusion.
:::

## [Common Usage Pattern]

```typescript title="example.ts"
// Copy-paste ready pattern
```

## [Advanced or Optional Topic]

:::info [Label]
Note about when this applies.
:::

## Related

- [Link to related doc]
```

---

### Wiring (`docs/wiring/`)

Protocol-focused. Shows setup, then usage, then common patterns.

```markdown
---
title: Protocol Name
sidebar_position: N
description: One sentence
---

# Protocol Name

What this wiring type does and when to use it.

## Setup

How to register this wiring type with the Pikku router/scheduler/etc.

```typescript title="setup.ts"
import { addProtocolRoute } from '#pikku/protocol'

// Setup example
```

## [Core Concept]

The main thing users need to understand (e.g., route patterns, message format, channel lifecycle).

```typescript title="example.ts"
// Working example
```

## Configuration

Key configuration options, shown as a table if there are many:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `option` | `string` | `undefined` | What it does |

## Common Patterns

### [Pattern 1 Name]

```typescript title="pattern-1.ts"
// Copy-paste ready
```

### [Pattern 2 Name]

```typescript title="pattern-2.ts"
// Copy-paste ready
```

## Related

- [Runtime docs that support this protocol]
```

---

### Runtimes (`docs/runtimes/`)

Integration guide. Installation → setup → code reference → live example.

```markdown
---
title: Runtime Name
sidebar_position: N
description: One sentence
image: /img/logos/runtime-logo.svg
---

import { DocHeaderHero } from '@site/src/components/DocHeaderHero';
import { Stackblitz } from '@site/src/components/Stackblitz';

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

Brief description of the runtime and what Pikku protocols it supports.

## Installation

```bash npm2yarn
npm install @pikku/runtime-package runtime-package
```

## Setup

```typescript reference title="start.ts"
https://raw.githubusercontent.com/pikkujs/workspace-starter/blob/main/backends/runtime-name/bin/start.ts
```

Explain what this does / key config options.

## Supported Wirings

What protocols work with this runtime (HTTP, WebSocket, queue, etc.).

## Live Example

<Stackblitz repo="template-runtime-name" initialFiles={['src/start.ts']} />

## Notes

:::note
Any important caveats or differences from other runtimes.
:::
```

---

### Middleware (`docs/middleware/`)

Auth middleware. Installation → setup → configuration.

```markdown
---
title: Auth Method Name
sidebar_position: N
description: One sentence
---

# Auth Method Name

What this middleware does and when to use it.

## Installation

```bash npm2yarn
npm install @pikku/middleware-package
```

## Setup

```typescript title="setup.ts"
import { authMiddleware } from '@pikku/middleware-package'

// Minimal working setup
```

## Configuration

| Option | Type | Required | Description |
|--------|------|----------|-------------|

## Usage with HTTP Routes

```typescript title="routes.ts"
// How to use the middleware in route definitions
```

## Notes / Common Issues

:::tip
Useful tip.
:::
```

---

### Custom Runtimes (`docs/custom-runtimes/`)

Deep technical guide for building a custom adapter.

```markdown
---
title: Custom [Protocol] Runtime
sidebar_position: N
description: How to build a custom [protocol] runtime for Pikku
---

# Custom [Protocol] Runtime

When you'd need to build this. Brief overview of what's involved.

## Overview

What the Pikku [protocol] adapter does and what interface you need to implement.

## Implementation

### Step 1: [First step]

```typescript title="custom-runtime.ts"
// Implementation
```

### Step 2: [Second step]

```typescript title="custom-runtime.ts"
// Continued implementation
```

## Complete Example

```typescript reference title="custom-runtime.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/.../example.ts
```

## Testing Your Runtime

How to verify it works.
```

---

## Writing rules (apply to all types)

- **Tone:** Practical, direct, active voice. Use "you" and "your". Short sentences.
- **Code examples:** Always complete and runnable. Use path aliases (`#pikku`, `#pikku/http`, `@pikku/core`) matching what the source uses.
- **`typescript reference` blocks:** Use these whenever the example file exists in the GitHub repo. Format: `` ```typescript reference title="filename.ts" `` followed by the raw GitHub URL on the next line.
- **`typescript title="..."` blocks:** Use for inline examples with a descriptive label.
- **Callouts:** `:::tip` for helpful insights, `:::info` for important context, `:::note` for caveats, `:::warning` for gotchas.
- **npm commands:** Use `bash npm2yarn` code blocks so Docusaurus renders the npm/yarn/pnpm switcher.
- **No over-engineering:** Don't add sections that have no content. Three sections of substance beats seven thin ones.
- **Frontmatter:** Always include `title`, `sidebar_position`, and `description`. Add `image` only for runtime pages. Never add `ai: true`.
- **Sidebar position:** Look at sibling files to pick a sensible `sidebar_position` number.
