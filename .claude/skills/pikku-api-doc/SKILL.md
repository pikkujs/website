---
name: pikku-api-doc
description: "Use when the user wants to generate or update API reference documentation for a Pikku service, interface, or class. Triggered by requests like 'document the JWTService', 'write API docs for SecretService', 'add API reference for X', or 'update the API docs for Y'. This skill reads the TypeScript source and generates a complete API reference page in Pikku's doc format."
metadata:
  version: 1.0.0
---

# Pikku API Reference Doc Generator

You are writing API reference documentation for the Pikku TypeScript framework. Your output is a Docusaurus markdown page that goes in `docs/api/` of the pikku website.

## Source locations

- Pikku source: `/Users/yasser/git/pikku/pikku/packages/`
- Existing API docs (for reference): `/Users/yasser/git/pikku/website/docs/api/`
- GitHub raw URL base: `https://raw.githubusercontent.com/pikkujs/pikku/blob/main/`

## Your process

1. **Read the TypeScript source** — Find the interface/class file in `/Users/yasser/git/pikku/pikku/packages/`. Look in `src/services/` for service interfaces.
2. **Read one or two existing API docs** — e.g., `docs/api/jwt-service.md` and `docs/api/logger.md` — to absorb the exact format and tone.
3. **Read the source file carefully** — note every method signature, parameter type, return type, and any JSDoc comments.
4. **Generate the doc** following the format below.

## Output format

```markdown
---
title: ServiceName
sidebar_position: N
---

One paragraph explaining what this service does and where it's available (e.g. "available in all function contexts via `services.logger`").

## Interface

```typescript reference title="service-name.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/service-name.ts
```

Brief note about the interface if needed.

## Methods

### `methodName(param1: Type, param2?: Type): Promise<ReturnType>`

One sentence describing what this method does.

- **Parameters:**
  - `param1`: Description of param1
  - `param2` *(optional)*: Description of param2
- **Returns:** Promise resolving to description of return value
- **Throws:** `ErrorType` if condition (only if relevant)

[Repeat for each method]

## Usage Example

```typescript
// Minimal working example showing the most common use case
```

## Implementations

*(Only include if there are concrete implementations of the interface)*

### BuiltInImplementation (built-in)

Description + code reference:

```typescript reference title="impl-file.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/.../impl-file.ts
```

```typescript
import { BuiltInImplementation } from '@pikku/core/services'
const service = new BuiltInImplementation()
```

### ExternalImplementation

```bash npm2yarn
npm install @pikku/package-name
```

```typescript reference title="impl-file.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/.../impl-file.ts
```

## Registration

Show how to pass this service to `createSingletonServices` or equivalent.

```typescript
const singletonServices = await createSingletonServices(config, {
  serviceName: new Implementation(),
})
```
```

## Rules

- Use `typescript reference title="filename.ts"` code blocks whenever referencing a file that exists in the GitHub repo. The URL must be the raw GitHub URL.
- Use `typescript title="label"` for inline code examples.
- Keep method descriptions to one sentence — expand in the Parameters/Returns bullets.
- For optional parameters, mark them with `*(optional)*` in the bullet list.
- Use `:::tip` or `:::info` callouts sparingly, only for genuinely important notes.
- Imports use path aliases: `@pikku/core/services`, `@pikku/core`, `#pikku`, etc. — match whatever the source uses.
- Do NOT add frontmatter field `ai: true` unless the content is AI-generated without human review.
- The `sidebar_position` should match or be near the existing entries in `docs/api/`.
