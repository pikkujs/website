---
title: '#pikku/cli'
sidebar_label: '#pikku/cli'
sidebar_position: 2
description: 'Wires a function as a command, with its flags and arguments derived from the function input.'
---

# `#pikku/cli`

Wires a function as a command, with its flags and arguments derived from the function input.

```typescript
import { defineCLICommands, pikkuCLICommand, pikkuCLIRender } from '#pikku/cli'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`defineCLICommands`](#defineclicommands) | function | Type-safe helper for defining CLI commands that can be composed and spread into wireCLI. |
| [`pikkuCLICommand`](#pikkuclicommand) | function | Creates a CLI command definition with automatic option inference from the function's input type. This allows TypeScript to automatically derive CLI options from the function signature. |
| [`pikkuCLIRender`](#pikkuclirender) | function | Creates a type-safe CLI renderer with access to your application's singleton services. The renderer receives the full singleton services and output data to format and display results. |
| [`wireCLI`](#wirecli) | function | Registers a CLI application with the Pikku framework. Creates command-line interfaces with type-safe commands and options. |

## Reference

### `defineCLICommands` {#defineclicommands}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Type-safe helper for defining CLI commands that can be composed and spread into `wireCLI`.

```typescript
defineCLICommands: <T extends Record<string, CoreCLICommandConfig<any, PikkuMiddleware, PikkuCLIRender<any>, any>>>(commands: T) => T
```

```typescript
// The command map is a contract of its own, so it can be declared once and
// wired wherever the program is assembled.
const shopCommands = defineCLICommands({
  report: pikkuCLICommand({
    description: 'Generate the daily sales report',
    func: dailySalesReport,
  }),
  cleanup: pikkuCLICommand({
    description: 'Remove baskets abandoned for more than 24 h',
    func: cleanupAbandonedBaskets,
  }),
  items: pikkuCLICommand({
    description: 'List all items in the catalogue',
    func: listItems,
  }),
})
```

### `pikkuCLICommand` {#pikkuclicommand}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a CLI command definition with automatic option inference from the function's input type.
This allows TypeScript to automatically derive CLI options from the function signature.

```typescript
pikkuCLICommand: <FuncConfig extends PikkuFunctionConfig<any, any, "cli" | "rpc" | "session">, Params extends string>(config: CLICommandConfig<FuncConfig, any, any, Params>) => CoreCLICommandConfig<FuncConfig, PikkuMiddleware, PikkuCLIRender<any>, string>
```

<details>
<summary>Config keys (11)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `auth` | `boolean` | Whether running this requires a logged-in session. Defaults to true — a command is closed unless it says otherwise. |
| `description` | `string` | The one-line summary listed beside the command name. |
| `func` | `FuncConfig` | The function to run. Omit it on a command that exists only to hold `subcommands`. |
| `isDefault` | `boolean` | Runs when the parent is invoked with no subcommand named. |
| `middleware` | `PikkuMiddleware[]` | Wraps every run of this command. |
| `options` | `{ [K in keyof ExtractFunctionInput<FuncConfig>]?: { description?: string; short?: string;…` | Flags, keyed by the input field each one fills. A field with no entry is still accepted as `--field`; an entry is how it gets a short form, a default, or help text. |
| `parameters` | `ValidateParameters<Params, ExtractFunctionInput<FuncConfig>>` | Positional arguments, written the way `--help` prints them: `&lt;env&gt;` is required, `[region]` optional. Each name must be a key of the function's input schema, so a typo is a compile error rather than an argument that silently never arrives. |
| `permissions` | `any[]` | Permission checks run before the function, for a command that not every logged-in user may run. |
| `render` | `PikkuCLIRender<any, SingletonServices>` | Prints the result. The function returns data and this is the only thing that writes to stdout, which is what lets one command serve both a human reading it and a script parsing it. |
| `subcommands` | `Record<string, CoreCLICommandConfig<any, PikkuMiddleware, PikkuCLIRender<any, SingletonSe…` | Nested commands, keyed by the word that selects them: `deploy plan` is `deploy` with a `plan` subcommand. |
| `title` | `string` | The heading shown above this command's own help. |

</details>

```typescript
// The command map is a contract of its own, so it can be declared once and
// wired wherever the program is assembled.
const shopCommands = defineCLICommands({
  report: pikkuCLICommand({
    description: 'Generate the daily sales report',
    func: dailySalesReport,
  }),
  cleanup: pikkuCLICommand({
    description: 'Remove baskets abandoned for more than 24 h',
    func: cleanupAbandonedBaskets,
  }),
  items: pikkuCLICommand({
    description: 'List all items in the catalogue',
    func: listItems,
  }),
})

wireCLI({ program: 'shop', commands: shopCommands })
```

### `pikkuCLIRender` {#pikkuclirender}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a type-safe CLI renderer with access to your application's singleton services.
The renderer receives the full singleton services and output data to format and display results.

```typescript
pikkuCLIRender: <Data, RequiredServices extends SingletonServices = SingletonServices>(render: (services: SingletonServices, data: Data) => void | Promise<void>) => PikkuCLIRender<Data, RequiredServices>
```

```typescript
type ItemList = {
  items: Array<{
    itemId: string
    name: string
    priceCents: number
    stock: number
  }>
}

export const itemRenderer = pikkuCLIRender<ItemList>((_services, { items }) => {
  const rows = items.map(
    (i) =>
      `${i.itemId.padEnd(14)} ${i.name.padEnd(20)} £${(i.priceCents / 100).toFixed(2).padStart(8)}  ${String(i.stock).padStart(5)}`
  )
  console.log(
    ['ID             NAME                  PRICE     STOCK', ...rows].join('\n')
  )
})
```

### `wireCLI` {#wirecli}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Registers a CLI application with the Pikku framework.
Creates command-line interfaces with type-safe commands and options.

```typescript
wireCLI: <Commands extends Record<string, CoreCLICommandConfig<any, PikkuMiddleware, PikkuCLIRender<any>, any>>, GlobalOptions>(cli: CLIWiring<Commands, GlobalOptions>) => void
```

<details>
<summary>Config keys (10)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `auth` | `boolean` | Requires a session on the websocket serving this program remotely. Has no effect on local execution, where there is no connection to authenticate. |
| `commands` <sup>required</sup> | `Record<string, CoreCLICommandConfig<any, PikkuMiddleware, PikkuCLIRender<any, SingletonSe…` | Top-level commands, keyed by the word that selects them. |
| `description` | `string` | What the program is for, shown at the top of `--help`. |
| `errors` | `string[]` | Names of error classes any command may throw, so each one's registered exit behaviour is used. |
| `middleware` | `PikkuMiddleware[]` | Wraps every command. |
| `options` | `CLIOptions<GlobalOptions>` | Flags accepted before any command, for things that apply to the whole program. |
| `program` <sup>required</sup> | `string` | The command name a user types. It is also what `--help` prints as the program. |
| `render` | `PikkuCLIRender<any, SingletonServices>` | The fallback printer for commands that declare none of their own. |
| `summary` | `string` | A one-line description for listings, where the full `description` is too long. |
| `tags` | `string[]` | Filters this program in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |

</details>

```typescript
// The command map is a contract of its own, so it can be declared once and
// wired wherever the program is assembled.
const shopCommands = defineCLICommands({
  report: pikkuCLICommand({
    description: 'Generate the daily sales report',
    func: dailySalesReport,
  }),
  cleanup: pikkuCLICommand({
    description: 'Remove baskets abandoned for more than 24 h',
    func: cleanupAbandonedBaskets,
  }),
  items: pikkuCLICommand({
    description: 'List all items in the catalogue',
    func: listItems,
  }),
})

wireCLI({ program: 'shop', commands: shopCommands })
```

## Inside an addon

This door is application-only — there is no `#pikku/addon/cli`. Everything on it wires a function to the outside world, and that is the installing application's call, not the addon's. See [the addon surface](/docs/api-reference/addons) for the doors an addon does get.

---

Run `npx pikku doc cli` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
