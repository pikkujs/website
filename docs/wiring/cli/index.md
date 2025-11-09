---
sidebar_position: 0
title: CLI Overview
description: Build command-line interfaces from your functions
---

# CLI Overview

CLI wiring turns your Pikku functions into command-line programs with nested commands, positional parameters, options, and formatted output.

Your domain functions don't need to know they're being called from the command line. They receive typed data, do their work, and return results. Pikku handles argument parsing, help text generation, and output formatting.

## Two Ways to Run CLI Commands

Pikku supports two modes of CLI execution:

### Local CLI

Run commands directly on your local machine. The CLI invokes functions in-process - no network requests, instant execution.

**Use local CLI when:**
- Building developer tools and scripts
- Running database migrations
- Executing admin tasks locally
- Working in development/testing environments

[Learn more about Local CLI →](./local-cli.mdx)

### Remote CLI

Run commands that invoke functions on a remote server via RPC. The CLI acts as a thin client that sends requests over the network.

**Use remote CLI when:**
- Managing production systems from your terminal
- Executing admin commands on remote servers
- Building distributed admin tools
- Providing CLI access to cloud-hosted backends

[Learn more about Remote CLI →](./remote-cli.md)

## Your First CLI Command

Let's create a simple greeting command:

```typescript
// greet.function.ts
import { pikkuSessionlessFunc } from '#pikku'

export const greetUser = pikkuSessionlessFunc<
  { name: string; loud?: boolean },
  { message: string; timestamp: string }
>({
  func: async (_, data) => {
    const message = `Hello, ${data.name}!`
    return {
      message: data.loud ? message.toUpperCase() : message,
      timestamp: new Date().toISOString()
    }
  },
  docs: {
    summary: 'Greet a user by name',
    tags: ['cli']
  }
})
```

```typescript
// greet.cli.ts
import { wireCLI, pikkuCLICommand } from '#pikku/cli'
import { pikkuCLIRender } from '@pikku/core'
import { greetUser } from './functions/greet.function.js'

wireCLI({
  program: 'greet-tool',
  description: 'A simple greeting CLI tool',
  commands: {
    greet: pikkuCLICommand({
      parameters: '<name>',
      func: greetUser,
      description: 'Greet a user by name',
      render: pikkuCLIRender((services, data) => {
        console.log(data.message)
      }),
      options: {
        loud: {
          description: 'Use loud greeting (uppercase)',
          short: 'l',
          default: false
        }
      }
    })
  }
})
```

Now you can use your CLI:

```bash
greet-tool greet Alice
# Hello, Alice!

greet-tool greet Alice --loud
# HELLO, ALICE!

greet-tool greet Alice -l
# HELLO, ALICE!
```

Pikku automatically:
- Parses command-line arguments
- Maps positionals to your function's input type
- Validates required vs optional parameters
- Generates help text
- Formats errors appropriately

## Core Features

### Positional Parameters

Use `<required>` and `[optional]` syntax to declare positionals:

```typescript
pikkuCLICommand({
  parameters: '<package> [version]',
  func: installPackage,
  description: 'Install a package'
})
```

### Options and Flags

Options are CLI flags with optional short forms:

```typescript
options: {
  environment: {
    description: 'Target environment',
    short: 'e',
    default: 'dev'
  },
  dryRun: {
    description: 'Simulate without applying changes',
    short: 'd',
    default: false
  }
}
```

### Nested Commands

Build hierarchical CLI structures with subcommands:

```typescript
wireCLI({
  program: 'my-tool',
  commands: {
    user: {
      description: 'User management',
      subcommands: {
        create: pikkuCLICommand({ /* ... */ }),
        list: pikkuCLICommand({ /* ... */ }),
        delete: pikkuCLICommand({ /* ... */ })
      }
    }
  }
})
```

### Custom Renderers

Renderers control how function output appears in the console:

```typescript
const userListRenderer = pikkuCLIRender<{ users: Array<User> }>(
  (services, data) => {
    console.table(data.users)
  }
)
```

### Streaming Progress

For long-running operations, stream progress updates using `channel.send()`:

```typescript
export const buildApp = pikkuSessionlessFunc({
  func: async ({ channel }, data) => {
    if (channel) {
      await channel.send({ type: 'progress', step: 'Installing', percent: 0 })
    }
    // ... work ...
    if (channel) {
      await channel.send({ type: 'progress', step: 'Compiling', percent: 50 })
    }
    // ... more work ...
  }
})
```

## Next Steps

- **[Local CLI](./local-cli.mdx)** - Run commands directly in-process
- **[Remote CLI](./remote-cli.md)** - Invoke remote functions via RPC
- **[Core Functions](../../core-features/functions.md)** - Understanding Pikku functions
- **[Middleware](../../core-features/middleware.md)** - Adding middleware to CLI commands
