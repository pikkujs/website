---
sidebar_position: 0
title: CLI Commands
description: Build command-line interfaces from your functions
---

# CLI Commands

CLI wiring turns your Pikku functions into command-line programs with nested commands, positional parameters, options, and formatted output.

Your domain functions don't need to know they're being called from the command line. They receive typed data, do their work, and return results. Pikku handles argument parsing, help text generation, and output formatting.

## Your First CLI Command

Let's create a simple greeting command:

```typescript
// greet.function.ts
import { pikkuFuncSessionless } from '#pikku/pikku-types.gen.js'

export const greetUser = pikkuFuncSessionless<
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
import { wireCLI, pikkuCLICommand } from './pikku-types.gen.js'
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

## Positional Parameters

Use `<required>` and `[optional]` syntax to declare positionals:

```typescript
pikkuCLICommand({
  parameters: '<package> [version]',
  func: installPackage,
  description: 'Install a package'
})
```

These map directly to your function's input:

```typescript
export const installPackage = pikkuFuncSessionless<
  { package: string; version?: string; force?: boolean },
  { installed: string; version: string }
>({
  func: async ({ database }, data) => {
    const version = data.version ?? 'latest'

    if (!data.force) {
      const existing = await database.query('packages', {
        where: { name: data.package }
      })

      if (existing) {
        throw new BadRequestError('Package already installed. Use --force to overwrite')
      }
    }

    // Install package...
    return { installed: data.package, version }
  },
  docs: {
    summary: 'Install a package',
    tags: ['cli', 'packages']
  }
})
```

Usage:

```bash
my-tool install express
my-tool install express 4.18.0
my-tool install express --force
```

## Options and Flags

Options are CLI flags with optional short forms:

```typescript
wireCLI({
  program: 'deploy-tool',
  commands: {
    deploy: pikkuCLICommand({
      parameters: '<service>',
      func: deployService,
      description: 'Deploy a service',
      options: {
        environment: {
          description: 'Target environment',
          short: 'e',
          default: 'dev'
        },
        dryRun: {
          description: 'Simulate deployment without applying changes',
          short: 'd',
          default: false
        }
      }
    })
  }
})
```

Usage:

```bash
deploy-tool deploy api --environment prod
deploy-tool deploy api -e staging
deploy-tool deploy api --dry-run
deploy-tool deploy api -d
```

## Nested Commands

Build hierarchical CLI structures with subcommands:

```typescript
wireCLI({
  program: 'my-tool',
  commands: {
    user: {
      description: 'User management',
      subcommands: {
        create: pikkuCLICommand({
          parameters: '<username> <email>',
          func: createUser,
          description: 'Create a new user'
        }),
        list: pikkuCLICommand({
          func: listUsers,
          description: 'List all users'
        }),
        delete: pikkuCLICommand({
          parameters: '<username>',
          func: deleteUser,
          description: 'Delete a user'
        })
      }
    },
    config: {
      description: 'Configuration management',
      subcommands: {
        get: pikkuCLICommand({
          parameters: '<key>',
          func: getConfig,
          description: 'Get a config value'
        }),
        set: pikkuCLICommand({
          parameters: '<key> <value>',
          func: setConfig,
          description: 'Set a config value'
        })
      }
    }
  }
})
```

Usage:

```bash
my-tool user create alice alice@example.com
my-tool user list
my-tool user delete alice

my-tool config get api.url
my-tool config set api.url https://api.example.com
```

## Streaming Progress Updates

For long-running operations, you can stream progress updates to the renderer using `channel.send()`:

```typescript
type BuildProgress =
  | { type: 'progress'; step: string; percent: number }
  | { type: 'complete'; duration: number }

export const buildApp = pikkuFuncSessionless<
  { project: string },
  { success: boolean; duration: number }
>({
  func: async ({ channel }, data) => {
    const start = Date.now()

    // Send progress updates via channel
    if (channel) {
      await channel.send({ type: 'progress', step: 'Installing dependencies', percent: 0 })
    }

    // ... install dependencies

    if (channel) {
      await channel.send({ type: 'progress', step: 'Compiling TypeScript', percent: 33 })
    }

    // ... compile

    if (channel) {
      await channel.send({ type: 'progress', step: 'Bundling assets', percent: 66 })
    }

    // ... bundle

    const duration = Date.now() - start

    if (channel) {
      await channel.send({ type: 'complete', duration })
    }

    return { success: true, duration }
  },
  docs: {
    summary: 'Build application',
    tags: ['cli', 'build']
  }
})
```

Your renderer receives these updates and can display them in real-time:

```typescript
const buildRenderer = pikkuCLIRender<
  { success: boolean; duration: number },
  BuildProgress  // Channel message type
>(
  (services, data, session, channelMessage) => {
    if (channelMessage) {
      // Handle streaming updates
      if (channelMessage.type === 'progress') {
        process.stdout.write(`\r${channelMessage.step}... ${channelMessage.percent}%`)
      } else if (channelMessage.type === 'complete') {
        process.stdout.write('\n')
        console.log(`✓ Build completed in ${channelMessage.duration}ms`)
      }
    } else {
      // Handle final output
      if (data.success) {
        console.log(`\n✓ Build successful (${data.duration}ms)`)
      }
    }
  }
)

wireCLI({
  program: 'build-tool',
  commands: {
    build: pikkuCLICommand({
      parameters: '<project>',
      func: buildApp,
      render: buildRenderer,
      description: 'Build a project'
    })
  }
})
```

When you run the command, you'll see real-time progress:

```bash
$ build-tool build my-app
Installing dependencies... 0%
Compiling TypeScript... 33%
Bundling assets... 66%
✓ Build completed in 2341ms

✓ Build successful (2341ms)
```

The renderer is called:
1. For each `channel.send()` message (with `channelMessage` parameter)
2. Once at the end with the final function output (without `channelMessage`)

This pattern is perfect for:
- Progress bars
- Streaming logs
- Step-by-step status updates
- Real-time feedback during long operations

## Custom Renderers

Renderers control how function output appears in the console:

```typescript
import { pikkuCLIRender } from '@pikku/core'

// Simple text renderer
const greetRenderer = pikkuCLIRender<{ message: string }>(
  (services, data) => {
    console.log(data.message)
  }
)

// Table renderer for list commands
const userListRenderer = pikkuCLIRender<{ users: Array<User> }>(
  (services, data) => {
    console.table(data.users)
  }
)

// Formatted renderer with colors (if using a library like chalk)
const deployRenderer = pikkuCLIRender<{ success: boolean; service: string }>(
  (services, data) => {
    if (data.success) {
      console.log(`✓ Deployed ${data.service}`)
    } else {
      console.error(`✗ Failed to deploy ${data.service}`)
    }
  }
)

wireCLI({
  program: 'my-tool',
  // Global renderer (applies to all commands without specific renderer)
  render: pikkuCLIRender((services, data) => {
    console.log(JSON.stringify(data, null, 2))
  }),
  commands: {
    greet: pikkuCLICommand({
      func: greetUser,
      render: greetRenderer  // Command-specific renderer
    }),
    users: {
      description: 'User commands',
      subcommands: {
        list: pikkuCLICommand({
          func: listUsers,
          render: userListRenderer
        })
      }
    }
  }
})
```

**Renderer signature:**

```typescript
pikkuCLIRender<OutputType, ChannelMessageType?>(
  (services, data, session?, channelMessage?) => {
    // Format and output to console
    console.log(...)
  }
)
```

- `services` - Singleton services (logger, config, etc.)
- `data` - Function output
- `session` - Optional user session (if `auth: true`)
- `channelMessage` - Optional streaming message from `channel.send()`

If no renderer is provided, Pikku outputs JSON by default.

## Global Options

Define options that apply to all commands:

```typescript
wireCLI({
  program: 'my-tool',
  // Global options inherited by all commands
  options: {
    verbose: {
      description: 'Enable verbose logging',
      short: 'v',
      default: false
    },
    config: {
      description: 'Config file path',
      short: 'c',
      default: './config.json'
    }
  },
  commands: {
    deploy: pikkuCLICommand({
      func: deployService,
      // Command-specific options
      options: {
        force: {
          description: 'Force deployment',
          short: 'f',
          default: false
        }
      }
    })
  }
})
```

Usage:

```bash
# Global options work on any command
my-tool deploy api --verbose
my-tool deploy api -v

# Mix global and command options
my-tool deploy api --verbose --force
my-tool deploy api -v -f
```

**Option Resolution Priority** (highest to lowest):
1. CLI arguments (`--verbose`)
2. Command-specific defaults
3. Global defaults

## Smart Type Plucking

Functions only receive options they declare in their type signature:

```typescript
// Available through inheritance: verbose, config, force

export const deployService = pikkuFunc<
  { service: string; force?: boolean },  // Only declares 'force'
  DeployResult
>({
  func: async ({ database }, data) => {
    // data only contains: { service, force? }
    // verbose and config are NOT passed even though available

    if (data.force) {
      // Skip safety checks
    }

    return { success: true }
  }
})
```

This keeps functions clean and ensures they only receive data they explicitly need.

## Error Handling

CLI commands should throw errors when operations fail:

```typescript
import { BadRequestError, NotFoundError } from '@pikku/core/errors'

export const deleteUser = pikkuFuncSessionless<
  { username: string },
  { deleted: boolean }
>({
  func: async ({ database }, data) => {
    const user = await database.query('users', {
      where: { username: data.username }
    })

    if (!user) {
      throw new NotFoundError(`User not found: ${data.username}`)
    }

    await database.delete('users', {
      where: { username: data.username }
    })

    return { deleted: true }
  },
  docs: {
    summary: 'Delete a user',
    tags: ['cli', 'users'],
    errors: ['NotFoundError']
  }
})
```

Pikku automatically formats errors for the console:

```bash
$ my-tool user delete bob
Error: User not found: bob
```

## Middleware

Apply middleware to CLI commands for logging, metrics, or validation:

```typescript
import { pikkuMiddleware } from '#pikku/pikku-types.gen.js'

export const cliMetrics = pikkuMiddleware(
  async ({ logger }, interaction, next) => {
    if (!interaction.cli) {
      throw new InvalidMiddlewareInteractionError(
        'cliMetrics middleware can only be used with CLI'
      )
    }

    const start = Date.now()
    logger.info('CLI command started', {
      program: interaction.cli.program,
      command: interaction.cli.command.join(' ')
    })

    await next()

    logger.info('CLI command completed', {
      duration: Date.now() - start
    })
  }
)
```

Apply middleware globally or per-command:

```typescript
wireCLI({
  program: 'my-tool',
  // Global middleware (all commands)
  middleware: [cliMetrics],
  commands: {
    deploy: pikkuCLICommand({
      func: deployService,
      // Command-specific middleware
      middleware: [auditMiddleware]
    })
  }
})
```

## Help Text

Pikku automatically generates help text from your configuration:

```bash
$ my-tool --help
A simple tool for managing things

Usage: my-tool <command> [options]

Commands:
  user     User management
  config   Configuration management
  deploy   Deploy a service

Options:
  -v, --verbose    Enable verbose logging
  -c, --config     Config file path
  --help           Show help

$ my-tool user --help
User management

Usage: my-tool user <subcommand> [options]

Subcommands:
  create    Create a new user
  list      List all users
  delete    Delete a user
```

## Next Steps

- [Core Functions](../core/functions.md) - Understanding Pikku functions
- [Middleware](../core/middleware.md) - Adding middleware to CLI commands
- [Errors](../core/errors.md) - Error handling patterns
