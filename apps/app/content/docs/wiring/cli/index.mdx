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

[Learn more about Local CLI →](/docs/wiring/cli/local-cli)

### Remote CLI

Run commands that invoke functions on a remote server over a WebSocket channel. The CLI acts as a thin client that sends requests over the network.

**Use remote CLI when:**
- Managing production systems from your terminal
- Executing admin commands on remote servers
- Building distributed admin tools
- Providing CLI access to cloud-hosted backends

[Learn more about Remote CLI →](/docs/wiring/cli/remote-cli)

## Your First CLI Command

Here are CLI wiring and renderers from the templates, showing a full todo CLI with list, add, show, complete, and delete commands:

Source: [`cli.wiring.ts`](https://github.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/cli.wiring.ts)

Source: [`cli.render.ts`](https://github.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/cli.render.ts)

Now you can use your CLI:

```bash
todo-cli list
# Found 3 todo(s):
# [ ] [HIGH] abc123: Buy groceries (due: 2024-12-31)

todo-cli add "Write tests" --priority high
# Success: Write tests

todo-cli complete <id>
# Success
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

```typescript @snippet wb-cli-parameters
```

### Options and Flags

Options are CLI flags with optional short forms:

Options are declared on the command as `options: { name: { description, short, default } }`. For example `environment` with `short: 'e'` and `default: 'dev'`, and `dryRun` with `short: 'd'` and `default: false`. The full list of properties is in the [Option Properties](#option-properties) table below.

### Nested Commands

Build hierarchical CLI structures with subcommands:

```typescript @snippet wb-cli-nested
```

### Custom Renderers

Renderers control how function output appears in the console:

```typescript @snippet cliRenderer
```

### Streaming Progress

For long-running operations, stream progress updates using `channel.send()`:

```typescript @snippet wb-cli-progress
```

## Configuration Reference

Add CLI entrypoints to `pikku.config.json`:

```json
{
  "cli": {
    "entrypoints": {
      "my-cli": [
        {
          "type": "local",
          "path": ".pikku/cli-local.gen.ts"
        },
        {
          "type": "channel",
          "name": "cli",
          "route": "/cli",
          "wirePath": "src/wirings/cli-channel.gen.ts",
          "path": ".pikku/cli-remote.gen.ts"
        }
      ]
    }
  }
}
```

Run `npx pikku` to generate the CLI executables. Each entrypoint can have both local and remote modes — they share the same `wireCLI` definition.

### wireCLI Options

| Property | Type | Description |
|----------|------|-------------|
| `program` | `string` | The CLI program name (shown in help text) |
| `description` | `string` | Program description |
| `commands` | `Record<string, Command>` | Top-level commands |
| `options` | `CLIOptions` | Flags accepted before any command |
| `render` | `PikkuCLIRender` | Default renderer for commands that declare none |
| `middleware` | `Middleware[]` | Wraps every command |
| `auth` | `boolean` | Requires a session on the generated remote (channel) backend; has no effect on local runs |

### pikkuCLICommand Options

| Property | Type | Description |
|----------|------|-------------|
| `func` | `PikkuFunc` | The Pikku function to invoke. Omit it on a command that only holds `subcommands` |
| `parameters` | `string` | Positional params: `<required>` `[optional]`. Each name must be a key of the function's input |
| `description` | `string` | Command description for help text |
| `options` | `Record<string, Option>` | Named flags and options |
| `render` | `PikkuCLIRender` | Output renderer function |
| `subcommands` | `Record<string, Command>` | Nested commands |
| `middleware` | `Middleware[]` | Wraps every run of this command |
| `auth` | `boolean` | Whether running this command requires a session (defaults to `true`) |

### Option Properties

| Property | Type | Description |
|----------|------|-------------|
| `description` | `string` | Help text for the option |
| `short` | `string` | Single-letter alias (e.g., `'v'` for `--verbose` / `-v`) |
| `default` | `any` | Default value (also determines the type: `false` → boolean flag) |
| `type` | `'string' \| 'number' \| 'boolean' \| 'string[]'` | How the value is parsed. Inferred from the function's input schema, then `default`, when omitted |
| `choices` | `any[]` | The values the option accepts |

A field with no entry in `options` is still accepted as `--field`; an entry is how it gets a short form, a default, or help text.

## Next Steps

- **[Local CLI](/docs/wiring/cli/local-cli)** - Run commands directly in-process
- **[Remote CLI](/docs/wiring/cli/remote-cli)** - Invoke remote functions over a WebSocket channel
- **[Core Functions](/docs/core-features/functions)** - Understanding Pikku functions
- **[Middleware](/docs/core-features/middleware)** - Adding middleware to CLI commands
- **[`#pikku/cli` in the SDK explorer](/api#app/cli)** - every export on the CLI door
