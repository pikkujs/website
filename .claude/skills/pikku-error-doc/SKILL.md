---
name: pikku-error-doc
description: "Use when the user wants to write or update a CLI error reference page for the Pikku documentation. These are pages in docs/pikku-cli/errors/ with codes like PKU400, PKU685, etc. Triggered by: 'document error PKU400', 'write an error page for PKUxxx', 'add an error reference for X', 'the CLI throws PKUxxx — document it'."
metadata:
  version: 1.0.0
---

# Pikku CLI Error Doc Writer

You are writing a CLI error reference page for the Pikku documentation. These pages live in `docs/pikku-cli/errors/` and have **no frontmatter** — they start directly with the H1.

## Source locations

- CLI error definitions: `/Users/yasser/git/pikku/pikku/packages/cli/src/` — look for error codes, messages, and the conditions that trigger them.
- Existing error docs (for reference): `/Users/yasser/git/pikku/website/docs/pikku-cli/errors/`

## Your process

1. **Read the error code and message** from the CLI source. Find the exact error text thrown and the condition that triggers it.
2. **Read 1-2 existing error docs** (e.g., `pku400.md`, `pku685.md`) to absorb the format and tone.
3. **Understand the fix** — trace the code to understand what the user needs to do to resolve it.
4. **Generate the doc** using the format below.

## Output format

```markdown
# PKUxxx: Short Error Title

## Error Message

```
The exact error message text as it appears in the terminal
```

## What Went Wrong

One or two paragraphs explaining the root cause clearly. Write for a developer who just hit this error and is confused. Explain *why* Pikku throws this, not just *that* it does.

## How to Fix

Step-by-step or code-based solution. Always include a working code example if applicable:

```typescript title="fixed-example.ts"
// The correct way to do it
```

If there are multiple causes, use numbered steps or separate sub-sections:

### If you [condition A]

```typescript
// Fix for condition A
```

### If you [condition B]

```typescript
// Fix for condition B
```

## [Domain] Best Practices

*(Use a domain-specific heading, e.g., "Channel Best Practices", "HTTP Route Best Practices")*

- Best practice 1 that prevents this error
- Best practice 2 that prevents this error
- Best practice 3 for related correctness

## Common Mistakes

What developers typically do wrong that causes this error:

```typescript title="wrong.ts"
// ❌ Wrong — causes PKUxxx
```

```typescript title="correct.ts"
// ✅ Correct
```

## Related Errors

- [PKUyyy: Related error title](./pkuyyy.md) — brief note on how it relates
- [PKUzzz: Another related error](./pkuzzz.md) — brief note
```

## Rules

- **No frontmatter** — error pages do NOT have `---` frontmatter blocks.
- **Error code in H1** — always `# PKUxxx: Title` format, error code uppercase.
- **Exact error message** — copy the exact string from the source in the code block under `## Error Message`.
- **Tone:** Empathetic and practical. The developer is frustrated. Get them unstuck fast.
- **Code examples:** Show both wrong and correct. Use `// ❌ Wrong` and `// ✅ Correct` comments.
- **Related Errors:** Link to 2-4 related error pages if they exist. Don't invent links — check `docs/pikku-cli/errors/` for real files.
- **Best Practices section heading:** Make it domain-specific, e.g., "WebSocket Best Practices", "Queue Best Practices" — not just "Best Practices".
- **Keep it focused:** Don't pad with generic TypeScript advice. Every sentence should help someone fix this specific error.
