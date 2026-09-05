---
title: '#pikku/function'
sidebar_label: '#pikku/function'
sidebar_position: 1
description: 'The function definers every wiring eventually points at, and the types they are written against. A function is handed services, then its input, then the w…'
---

# `#pikku/function`

The function definers every wiring eventually points at, and the types they are written against. A function is handed services, then its input, then the wire — and the wire is where the request lives: `session`, `setSession`, `clearSession`, `http`, `channel`, `rpc`. None of those are exports, so they are not listed here; destructure them from the third argument.

```typescript
import { pikkuApprovalDescription, pikkuFunc, pikkuListFunc } from '#pikku/function'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`InferSchemaOutput`](#inferschemaoutput) | type | Helper type to infer the output type from a Standard Schema |
| [`NodeConfig`](#nodeconfig) | type | Inline node configuration for function definitions. |
| [`pikkuApprovalDescription`](#pikkuapprovaldescription) | function | Factory function for creating approval description functions with tree-shaking support. |
| [`PikkuApprovalDescription`](#pikkuapprovaldescription-2) | type | A function that generates a human-readable description of a pending approval action. Used by AI agents to show meaningful approval prompts instead of raw tool arguments. |
| [`pikkuFunc`](#pikkufunc) | function | Creates a Pikku function that can be either session-aware or sessionless. This is the main function wrapper for creating API endpoints. |
| [`PikkuFunction`](#pikkufunction) | type | A session-aware API function that requires user authentication. Use this for protected endpoints that need access to user session data. |
| [`PikkuFunctionConfig`](#pikkufunctionconfig) | type | Configuration object for Pikku functions with optional middleware, permissions, tags, and documentation. This type wraps CorePikkuFunctionConfig with the user's custom types. |
| [`PikkuFunctionSessionless`](#pikkufunctionsessionless) | type | A sessionless API function that doesn't require user authentication. Use this for public endpoints, health checks, or operations that don't need user context. |
| [`pikkuListFunc`](#pikkulistfunc) | function | A `pikkuFunc` whose input and output are already the shared list shape — filters, sort, paging in; rows and a total out — so a listing endpoint pages the same way everywhere. |
| [`pikkuRemoteChannelFunc`](#pikkuremotechannelfunc) | function | Declares a capability the connected client answers, reachable from any `wireChannel` function as `channel.remote(name, input)`. |
| [`pikkuSessionlessFunc`](#pikkusessionlessfunc) | function | Creates a sessionless Pikku function that doesn't require user authentication. Use this for public endpoints, webhooks, or background tasks. |
| [`pikkuVoidFunc`](#pikkuvoidfunc) | function | Creates a function that takes no input and returns no output. Useful for health checks, triggers, or cleanup operations. |
| [`ref`](#ref) | function | References a registered function by name for use in any wiring. Works for both local and addon functions — resolves via RPC at runtime. |
| [`refChannel`](#refchannel) | function | Names a channel an installed addon wires, for connecting to it without hardcoding its name. |
| [`refCLI`](#refcli) | function | Names a CLI command an installed addon wires, for invoking it without hardcoding its name. |
| [`refHTTP`](#refhttp) | function | Names an HTTP route an installed addon wires, so you can link or redirect to it without hardcoding a path the addon may move. |
| [`Services`](#services) | interface | Everything a function is handed as its first argument: the singleton services plus whatever is built per request. This is the type to widen when you add a service. |
| [`Session`](#session) | type | The signed-in user as this project defines it. Reached on the wire as `session`, and replaced with `setSession`. |
| [`SingletonServices`](#singletonservices) | interface | The services that live for the process — the ones built once in `createConfig`/ `createSingletonServices` and shared by every request. |
| [`WiredServices`](#wiredservices) | type | The services a wired function actually receives. The inspector records which services each wired `func`, `permissions` and `middleware` destructures and emits them as `RequiredSingletonServices`; intersecting that here makes those services **non-optional** at every call site. A service is optional only when nothing destructures it — in which case it is never created either. This is why an `if (!service)` guard inside a function body is always dead code. |

## Reference

### `InferSchemaOutput` {#inferschemaoutput}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

Helper type to infer the output type from a Standard Schema

```typescript
InferSchemaOutput: InferSchemaOutput<T>
```

### `NodeConfig` {#nodeconfig}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

Inline node configuration for function definitions.

### `pikkuApprovalDescription` {#pikkuapprovaldescription}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Factory function for creating approval description functions with tree-shaking support.

```typescript
pikkuApprovalDescription: <In = unknown, RequiredServices extends SecretlessServices<Services> = WiredServices>(fn: PikkuApprovalDescription<In, RequiredServices>) => PikkuApprovalDescription<In, RequiredServices>
```

```typescript
export const deleteTodoApproval = pikkuApprovalDescription(
  async ({ todoStore }, { id }) => {
    const todo = await todoStore.get(id)
    return \`Delete todo: "${todo.title}"\`
  }
)
```

### `PikkuApprovalDescription` {#pikkuapprovaldescription-2}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

A function that generates a human-readable description of a pending approval action.
Used by AI agents to show meaningful approval prompts instead of raw tool arguments.

```typescript
PikkuApprovalDescription: PikkuApprovalDescription<In, RequiredServices>
```

### `pikkuFunc` {#pikkufunc}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a Pikku function that can be either session-aware or sessionless.
This is the main function wrapper for creating API endpoints.

Define the input and output with Zod schemas — the function's types are
inferred from them, and the schemas double as runtime validation.

```typescript
pikkuFunc: { <InputSchema extends StandardSchemaV1 | undefined = undefined, OutputSchema extends StandardSchemaV1 | undefined = undefined>(config: PikkuFunctionConfigWithSchema<InputSchema, OutputSchema, "session" | "rpc">): PikkuFunctionConfig<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "session" | "rpc">; <In, Out = unknown>(func: PikkuFunction<In, Out, "session" | "rpc"> | PikkuFunctionConfig<In, Out, "session" | "rpc">): PikkuFunctionConfig<In, Out, "session" | "rpc">; }
```

<details>
<summary>Config keys (25)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `after` | `CorePikkuFunctionHook<any, any, any>` | Scenarios only: always runs after the body, in a `finally`. Throwing fails an otherwise-passing run; on an already-failed run it attaches as `cause` and never replaces the original error. |
| `approvalRequired` | `boolean` | Under an agent's `explicit` approval policy, calling this pauses for a human to approve it. |
| `audit` | `boolean \| { durability?: "best-effort" \| "transactional"; }` | Records every call in the audit log. `transactional` durability writes the entry in the same transaction as the work, so the two cannot disagree; `best-effort` does not hold the request up for it. |
| `auth` | `boolean` | Whether calling this requires a session, wherever it is wired. A wiring can be more permissive than the function, never less. |
| `before` | `CorePikkuFunctionHook<any, any, any>` | Scenarios only: runs before the scenario body, with the scenario's own signature. Throwing skips the body and fails the run, but `after` still runs. |
| `deploy` | `"auto" \| "serverless" \| "server"` | Where this function is deployed when the build can go either way. `auto` lets the analyser decide from what the function touches. |
| `description` | `string` | What the function does. An agent choosing between tools reads this, so it is worth more care than a comment would be. |
| `errors` | `(typeof PikkuError)[]` | Error classes this may throw, so each one's registered HTTP status is used instead of a 500. |
| `expose` | `boolean` | Makes the function callable from outside as `POST /rpc/&lt;name&gt;`. Without a session requirement, a permission or an addon gate, that means callable by anyone. |
| `mcp` | `boolean` | Offers the function to MCP clients as a tool, without a separate `wireMCPTool`. |
| `middleware` | `PikkuMiddleware[]` | Wraps this function wherever it is called from, unlike wiring middleware which only wraps one route into it. |
| `override` | `string` | Explicit logical name override; lets multiple exports share a versioned base |
| `permissionsInBody` | `boolean` | Declares that the body does its own permission check, so the function is not open despite naming no session, scope or permission. It grants nothing — asserting it falsely just disables the audit that would have caught the mistake. Requires `allow.permissionsInBody` in the config. |
| `readonly` | `boolean` | Declares that the function only reads. It is enforced rather than decorative: a read-only session is refused any function without it, and an agent may call one without asking permission first. |
| `remote` | `boolean` | Publishes the function in this package's remote surface, which is what a `wireRemoteAddon` consumer gets a typed client for. |
| `requiresActor` | `boolean` | Scenario steps only, and set by the definer rather than by hand: this step needs a persona, so the runner injects `wire.actor`. |
| `scopes` | `import("#pikku/scopes/pikku-scopes.gen.js").ScopeId[]` | Scopes the session must hold. All are required, and checked before `permissions`, which OR together — a scope only narrows access. |
| `skip` | `string` | Scenarios only: why this scenario is held out of a default run. Reported as skipped rather than quietly omitted; naming it in `--flows` runs it. |
| `surfaces` | `ScenarioSurface[]` | Scenario steps only: which surfaces this step declares a binding for. The runner uses it to pick a binding, decide whether to provision a browser, and report how much of the flow each surface actually covers. |
| `tags` | `string[]` | Filters this function in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |
| `title` | `string` | A human name for this function, shown wherever it is listed rather than called. |
| `version` | `number` | Which version of this contract this export is. Two exports sharing an `override` and differing here are the same function at two versions. |
| `workflowQueued` | `boolean` | When true, workflow steps calling this function are dispatched via the queue. No queue service configured is a hard error. Defaults to false (inline). |
| `workflowRetries` | `number` | Number of retry attempts when this function is used as a workflow step. |
| `workflowTimeout` | `string` | Timeout for this function when used as a workflow step (e.g. '30s', '5m'). |

</details>

```typescript
export const getSession = pikkuFunc({
  expose: true,
  readonly: true,
  auth: true,
  description: 'Returns the current signed-in user.',
  input: GetSessionInput,
  output: GetSessionOutput,
  func: async ({ kysely }, _input, { session }) => {
    const user = await kysely
      .selectFrom('user')
      .select(['id', 'email', 'name'])
      .where('id', '=', session!.userId)
      .executeTakeFirstOrThrow()

    return {
      userId: user.id,
      email: user.email,
      name: user.name ?? null,
    }
  },
})
```

### `PikkuFunction` {#pikkufunction}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

A session-aware API function that requires user authentication.
Use this for protected endpoints that need access to user session data.

```typescript
PikkuFunction: PikkuFunction<In, Out, RequiredWires, RequiredServices>
```

### `PikkuFunctionConfig` {#pikkufunctionconfig}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

Configuration object for Pikku functions with optional middleware, permissions, tags, and documentation.
This type wraps CorePikkuFunctionConfig with the user's custom types.

```typescript
PikkuFunctionConfig: PikkuFunctionConfig<In, Out, RequiredWires, PikkuFunc, InputSchema, OutputSchema>
```

<details>
<summary>Config keys (30)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `after` | `CorePikkuFunctionHook<any, any, any>` | Scenarios only: always runs after the body, in a `finally`. Throwing fails an otherwise-passing run; on an already-failed run it attaches as `cause` and never replaces the original error. |
| `approvalDescription` | `any` | Builds the sentence a human is shown when asked to approve a call, from that call's own input. |
| `approvalRequired` | `boolean` | Under an agent's `explicit` approval policy, calling this pauses for a human to approve it. |
| `audit` | `boolean \| { durability?: "best-effort" \| "transactional"; }` | Records every call in the audit log. `transactional` durability writes the entry in the same transaction as the work, so the two cannot disagree; `best-effort` does not hold the request up for it. |
| `auth` | `boolean` | Whether calling this requires a session, wherever it is wired. A wiring can be more permissive than the function, never less. |
| `before` | `CorePikkuFunctionHook<any, any, any>` | Scenarios only: runs before the scenario body, with the scenario's own signature. Throwing skips the body and fails the run, but `after` still runs. |
| `deploy` | `"auto" \| "serverless" \| "server"` | Where this function is deployed when the build can go either way. `auto` lets the analyser decide from what the function touches. |
| `description` | `string` | What the function does. An agent choosing between tools reads this, so it is worth more care than a comment would be. |
| `errors` | `(typeof PikkuError)[]` | Error classes this may throw, so each one's registered HTTP status is used instead of a 500. |
| `expose` | `boolean` | Makes the function callable from outside as `POST /rpc/&lt;name&gt;`. Without a session requirement, a permission or an addon gate, that means callable by anyone. |
| `func` <sup>required</sup> | `PikkuFunction<In, Out, RequiredWires, any> \| PikkuFunctionSessionless<In, Out, RequiredWi…` | The body. Its first parameter is the services it needs, destructured inline so the build can tree-shake the rest away. |
| `input` | `InputSchema` | The input schema, which is also the input type — there is no separate generic to keep in step with it. |
| `mcp` | `boolean` | Offers the function to MCP clients as a tool, without a separate `wireMCPTool`. |
| `middleware` | `PikkuMiddleware[]` | Wraps this function wherever it is called from, unlike wiring middleware which only wraps one route into it. |
| `output` | `OutputSchema` | The output schema, which is also the return type. Naming a type here instead is what produces PKU463. |
| `override` | `string` | Explicit logical name override; lets multiple exports share a versioned base |
| `permissions` | `CorePermissionGroup<PikkuPermission<In>>` | Checks that run before the body. Grouped names OR together, so any one passing admits the caller; use `scopes` to require rather than offer. |
| `permissionsInBody` | `boolean` | Declares that the body does its own permission check, so the function is not open despite naming no session, scope or permission. It grants nothing — asserting it falsely just disables the audit that would have caught the mistake. Requires `allow.permissionsInBody` in the config. |
| `readonly` | `boolean` | Declares that the function only reads. It is enforced rather than decorative: a read-only session is refused any function without it, and an agent may call one without asking permission first. |
| `remote` | `boolean` | Publishes the function in this package's remote surface, which is what a `wireRemoteAddon` consumer gets a typed client for. |
| `requiresActor` | `boolean` | Scenario steps only, and set by the definer rather than by hand: this step needs a persona, so the runner injects `wire.actor`. |
| `scopes` | `import("#pikku/scopes/pikku-scopes.gen.js").ScopeId[]` | Scopes the session must hold. All are required, and checked before `permissions`, which OR together — a scope only narrows access. |
| `skip` | `string` | Scenarios only: why this scenario is held out of a default run. Reported as skipped rather than quietly omitted; naming it in `--flows` runs it. |
| `surfaces` | `ScenarioSurface[]` | Scenario steps only: which surfaces this step declares a binding for. The runner uses it to pick a binding, decide whether to provision a browser, and report how much of the flow each surface actually covers. |
| `tags` | `string[]` | Filters this function in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |
| `title` | `string` | A human name for this function, shown wherever it is listed rather than called. |
| `version` | `number` | Which version of this contract this export is. Two exports sharing an `override` and differing here are the same function at two versions. |
| `workflowQueued` | `boolean` | When true, workflow steps calling this function are dispatched via the queue. No queue service configured is a hard error. Defaults to false (inline). |
| `workflowRetries` | `number` | Number of retry attempts when this function is used as a workflow step. |
| `workflowTimeout` | `string` | Timeout for this function when used as a workflow step (e.g. '30s', '5m'). |

</details>

### `PikkuFunctionSessionless` {#pikkufunctionsessionless}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

A sessionless API function that doesn't require user authentication.
Use this for public endpoints, health checks, or operations that don't need user context.

```typescript
PikkuFunctionSessionless: PikkuFunctionSessionless<In, Out, RequiredWires, RequiredServices, ScenarioOut>
```

### `pikkuListFunc` {#pikkulistfunc}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

A `pikkuFunc` whose input and output are already the shared list shape —
filters, sort, paging in; rows and a total out — so a listing endpoint pages
the same way everywhere.

```typescript
pikkuListFunc: <F extends Record<string, unknown> = {}, Row = unknown, S extends string = never>(config: PikkuFunctionConfig<ListInput<F, S>, ListOutput<Row>, "session" | "rpc">) => PikkuFunctionConfig<ListInput<F, S>, ListOutput<Row>, "session" | "rpc">
```

<details>
<summary>Config keys (30)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `after` | `CorePikkuFunctionHook<any, any, any>` | Scenarios only: always runs after the body, in a `finally`. Throwing fails an otherwise-passing run; on an already-failed run it attaches as `cause` and never replaces the original error. |
| `approvalDescription` | `any` | Builds the sentence a human is shown when asked to approve a call, from that call's own input. |
| `approvalRequired` | `boolean` | Under an agent's `explicit` approval policy, calling this pauses for a human to approve it. |
| `audit` | `boolean \| { durability?: "best-effort" \| "transactional"; }` | Records every call in the audit log. `transactional` durability writes the entry in the same transaction as the work, so the two cannot disagree; `best-effort` does not hold the request up for it. |
| `auth` | `boolean` | Whether calling this requires a session, wherever it is wired. A wiring can be more permissive than the function, never less. |
| `before` | `CorePikkuFunctionHook<any, any, any>` | Scenarios only: runs before the scenario body, with the scenario's own signature. Throwing skips the body and fails the run, but `after` still runs. |
| `deploy` | `"auto" \| "serverless" \| "server"` | Where this function is deployed when the build can go either way. `auto` lets the analyser decide from what the function touches. |
| `description` | `string` | What the function does. An agent choosing between tools reads this, so it is worth more care than a comment would be. |
| `errors` | `(typeof PikkuError)[]` | Error classes this may throw, so each one's registered HTTP status is used instead of a 500. |
| `expose` | `boolean` | Makes the function callable from outside as `POST /rpc/&lt;name&gt;`. Without a session requirement, a permission or an addon gate, that means callable by anyone. |
| `func` <sup>required</sup> | `PikkuFunction<ListInput<F, S>, ListOutput<Row>, "rpc" \| "session", WiredServices> \| Pikku…` | The body. Its first parameter is the services it needs, destructured inline so the build can tree-shake the rest away. |
| `input` | `undefined` | The input schema, which is also the input type — there is no separate generic to keep in step with it. |
| `mcp` | `boolean` | Offers the function to MCP clients as a tool, without a separate `wireMCPTool`. |
| `middleware` | `PikkuMiddleware[]` | Wraps this function wherever it is called from, unlike wiring middleware which only wraps one route into it. |
| `output` | `undefined` | The output schema, which is also the return type. Naming a type here instead is what produces PKU463. |
| `override` | `string` | Explicit logical name override; lets multiple exports share a versioned base |
| `permissions` | `CorePermissionGroup<PikkuPermission<ListInput<F, S>>>` | Checks that run before the body. Grouped names OR together, so any one passing admits the caller; use `scopes` to require rather than offer. |
| `permissionsInBody` | `boolean` | Declares that the body does its own permission check, so the function is not open despite naming no session, scope or permission. It grants nothing — asserting it falsely just disables the audit that would have caught the mistake. Requires `allow.permissionsInBody` in the config. |
| `readonly` | `boolean` | Declares that the function only reads. It is enforced rather than decorative: a read-only session is refused any function without it, and an agent may call one without asking permission first. |
| `remote` | `boolean` | Publishes the function in this package's remote surface, which is what a `wireRemoteAddon` consumer gets a typed client for. |
| `requiresActor` | `boolean` | Scenario steps only, and set by the definer rather than by hand: this step needs a persona, so the runner injects `wire.actor`. |
| `scopes` | `import("#pikku/scopes/pikku-scopes.gen.js").ScopeId[]` | Scopes the session must hold. All are required, and checked before `permissions`, which OR together — a scope only narrows access. |
| `skip` | `string` | Scenarios only: why this scenario is held out of a default run. Reported as skipped rather than quietly omitted; naming it in `--flows` runs it. |
| `surfaces` | `ScenarioSurface[]` | Scenario steps only: which surfaces this step declares a binding for. The runner uses it to pick a binding, decide whether to provision a browser, and report how much of the flow each surface actually covers. |
| `tags` | `string[]` | Filters this function in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |
| `title` | `string` | A human name for this function, shown wherever it is listed rather than called. |
| `version` | `number` | Which version of this contract this export is. Two exports sharing an `override` and differing here are the same function at two versions. |
| `workflowQueued` | `boolean` | When true, workflow steps calling this function are dispatched via the queue. No queue service configured is a hard error. Defaults to false (inline). |
| `workflowRetries` | `number` | Number of retry attempts when this function is used as a workflow step. |
| `workflowTimeout` | `string` | Timeout for this function when used as a workflow step (e.g. '30s', '5m'). |

</details>

```typescript
export const listItemRows = pikkuListFunc<
  { categorySlug: string; inStock: boolean },
  { itemId: string; name: string; priceCents: number; stock: number }
>({
  expose: true,
  description: 'Catalogue rows in the standard list shape (rows + cursor).',
  func: async ({ kysely }, { limit, search }) => {
    let query = kysely
      .selectFrom('item')
      .innerJoin('category', 'category.categoryId', 'item.categoryId')
      .select(['item.itemId', 'item.name', 'item.priceCents', 'item.stock'])
      .where('item.isActive', '=', 1)

    if (search) query = query.where('item.name', 'like', `%${search}%`)

    const rows = await query.limit(limit ?? 20).execute()

    return { rows, nextCursor: null, totalCount: rows.length }
  },
})
```

### `pikkuRemoteChannelFunc` {#pikkuremotechannelfunc}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Declares a capability the connected client answers, reachable from any
`wireChannel` function as `channel.remote(name, input)`.

There is no `func`: this side owns the contract, the client owns the body.
The `description` is what a person is shown when asked to approve the call,
so write it for them rather than for the caller.

```typescript
pikkuRemoteChannelFunc: <InputSchema extends StandardSchemaV1 | undefined = undefined, OutputSchema extends StandardSchemaV1 | undefined = undefined>(config: Omit<PikkuFunctionSessionlessConfigWithSchema<InputSchema, OutputSchema, "session" | "rpc">, "func">) => PikkuFunctionConfig<SchemaInferred<InputSchema>, SchemaInferred<OutputSchema>, "session" | "rpc">
```

<details>
<summary>Config keys (24)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `after` | `CorePikkuFunctionHook<any, any, any>` | Scenarios only: always runs after the body, in a `finally`. Throwing fails an otherwise-passing run; on an already-failed run it attaches as `cause` and never replaces the original error. |
| `approvalRequired` | `boolean` | Under an agent's `explicit` approval policy, calling this pauses for a human to approve it. |
| `audit` | `boolean \| { durability?: "best-effort" \| "transactional"; }` | Records every call in the audit log. `transactional` durability writes the entry in the same transaction as the work, so the two cannot disagree; `best-effort` does not hold the request up for it. |
| `auth` | `boolean` | Whether calling this requires a session, wherever it is wired. A wiring can be more permissive than the function, never less. |
| `before` | `CorePikkuFunctionHook<any, any, any>` | Scenarios only: runs before the scenario body, with the scenario's own signature. Throwing skips the body and fails the run, but `after` still runs. |
| `deploy` | `"auto" \| "serverless" \| "server"` | Where this function is deployed when the build can go either way. `auto` lets the analyser decide from what the function touches. |
| `description` | `string` | What the function does. An agent choosing between tools reads this, so it is worth more care than a comment would be. |
| `errors` | `(typeof PikkuError)[]` | Error classes this may throw, so each one's registered HTTP status is used instead of a 500. |
| `expose` | `boolean` | Makes the function callable from outside as `POST /rpc/&lt;name&gt;`. Without a session requirement, a permission or an addon gate, that means callable by anyone. |
| `mcp` | `boolean` | Offers the function to MCP clients as a tool, without a separate `wireMCPTool`. |
| `middleware` | `CorePikkuMiddleware<any, any>[]` | Wraps this function wherever it is called from, unlike wiring middleware which only wraps one route into it. |
| `override` | `string` | Explicit logical name override; lets multiple exports share a versioned base |
| `permissionsInBody` | `boolean` | Declares that the body does its own permission check, so the function is not open despite naming no session, scope or permission. It grants nothing — asserting it falsely just disables the audit that would have caught the mistake. Requires `allow.permissionsInBody` in the config. |
| `readonly` | `boolean` | Declares that the function only reads. It is enforced rather than decorative: a read-only session is refused any function without it, and an agent may call one without asking permission first. |
| `remote` | `boolean` | Publishes the function in this package's remote surface, which is what a `wireRemoteAddon` consumer gets a typed client for. |
| `requiresActor` | `boolean` | Scenario steps only, and set by the definer rather than by hand: this step needs a persona, so the runner injects `wire.actor`. |
| `skip` | `string` | Scenarios only: why this scenario is held out of a default run. Reported as skipped rather than quietly omitted; naming it in `--flows` runs it. |
| `surfaces` | `ScenarioSurface[]` | Scenario steps only: which surfaces this step declares a binding for. The runner uses it to pick a binding, decide whether to provision a browser, and report how much of the flow each surface actually covers. |
| `tags` | `string[]` | Filters this function in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |
| `title` | `string` | A human name for this function, shown wherever it is listed rather than called. |
| `version` | `number` | Which version of this contract this export is. Two exports sharing an `override` and differing here are the same function at two versions. |
| `workflowQueued` | `boolean` | When true, workflow steps calling this function are dispatched via the queue. No queue service configured is a hard error. Defaults to false (inline). |
| `workflowRetries` | `number` | Number of retry attempts when this function is used as a workflow step. |
| `workflowTimeout` | `string` | Timeout for this function when used as a workflow step (e.g. '30s', '5m'). |

</details>

```typescript
export const localCheckoutOutput = z.object({ sha: z.string(), branch: z.string() })

export const localCheckout = pikkuRemoteChannelFunc({
  description: 'Read the current commit and branch of your working tree',
  output: localCheckoutOutput,
})
```

### `pikkuSessionlessFunc` {#pikkusessionlessfunc}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a sessionless Pikku function that doesn't require user authentication.
Use this for public endpoints, webhooks, or background tasks.

Define the input and output with Zod schemas — the function's types are
inferred from them, and the schemas double as runtime validation.

```typescript
pikkuSessionlessFunc: { <InputSchema extends StandardSchemaV1 | undefined = undefined, OutputSchema extends StandardSchemaV1 | undefined = undefined, RequiredServices extends SecretlessServices<Services> = WiredServices>(config: PikkuFunctionSessionlessConfigWithSchema<InputSchema, OutputSchema, "session" | "rpc", RequiredServices>): PikkuFunctionConfig<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "session" | "rpc">; <In, Out = unknown, RequiredServices extends SecretlessServices<Services> = WiredServices>(func: PikkuFunctionSessionless<In, Out, "session" | "rpc", RequiredServices> | PikkuFunctionSessionlessConfig<In, Out, "session" | "rpc", PikkuFunctionSessionless<In, Out, "session" | "rpc", RequiredServices>>): PikkuFunctionConfig<In, Out, "session" | "rpc">; }
```

<details>
<summary>Config keys (24)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `after` | `CorePikkuFunctionHook<any, any, any>` | Scenarios only: always runs after the body, in a `finally`. Throwing fails an otherwise-passing run; on an already-failed run it attaches as `cause` and never replaces the original error. |
| `approvalRequired` | `boolean` | Under an agent's `explicit` approval policy, calling this pauses for a human to approve it. |
| `audit` | `boolean \| { durability?: "best-effort" \| "transactional"; }` | Records every call in the audit log. `transactional` durability writes the entry in the same transaction as the work, so the two cannot disagree; `best-effort` does not hold the request up for it. |
| `auth` | `boolean` | Whether calling this requires a session, wherever it is wired. A wiring can be more permissive than the function, never less. |
| `before` | `CorePikkuFunctionHook<any, any, any>` | Scenarios only: runs before the scenario body, with the scenario's own signature. Throwing skips the body and fails the run, but `after` still runs. |
| `deploy` | `"auto" \| "serverless" \| "server"` | Where this function is deployed when the build can go either way. `auto` lets the analyser decide from what the function touches. |
| `description` | `string` | What the function does. An agent choosing between tools reads this, so it is worth more care than a comment would be. |
| `errors` | `(typeof PikkuError)[]` | Error classes this may throw, so each one's registered HTTP status is used instead of a 500. |
| `expose` | `boolean` | Makes the function callable from outside as `POST /rpc/&lt;name&gt;`. Without a session requirement, a permission or an addon gate, that means callable by anyone. |
| `mcp` | `boolean` | Offers the function to MCP clients as a tool, without a separate `wireMCPTool`. |
| `middleware` | `CorePikkuMiddleware<any, any>[]` | Wraps this function wherever it is called from, unlike wiring middleware which only wraps one route into it. |
| `override` | `string` | Explicit logical name override; lets multiple exports share a versioned base |
| `permissionsInBody` | `boolean` | Declares that the body does its own permission check, so the function is not open despite naming no session, scope or permission. It grants nothing — asserting it falsely just disables the audit that would have caught the mistake. Requires `allow.permissionsInBody` in the config. |
| `readonly` | `boolean` | Declares that the function only reads. It is enforced rather than decorative: a read-only session is refused any function without it, and an agent may call one without asking permission first. |
| `remote` | `boolean` | Publishes the function in this package's remote surface, which is what a `wireRemoteAddon` consumer gets a typed client for. |
| `requiresActor` | `boolean` | Scenario steps only, and set by the definer rather than by hand: this step needs a persona, so the runner injects `wire.actor`. |
| `skip` | `string` | Scenarios only: why this scenario is held out of a default run. Reported as skipped rather than quietly omitted; naming it in `--flows` runs it. |
| `surfaces` | `ScenarioSurface[]` | Scenario steps only: which surfaces this step declares a binding for. The runner uses it to pick a binding, decide whether to provision a browser, and report how much of the flow each surface actually covers. |
| `tags` | `string[]` | Filters this function in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |
| `title` | `string` | A human name for this function, shown wherever it is listed rather than called. |
| `version` | `number` | Which version of this contract this export is. Two exports sharing an `override` and differing here are the same function at two versions. |
| `workflowQueued` | `boolean` | When true, workflow steps calling this function are dispatched via the queue. No queue service configured is a hard error. Defaults to false (inline). |
| `workflowRetries` | `number` | Number of retry attempts when this function is used as a workflow step. |
| `workflowTimeout` | `string` | Timeout for this function when used as a workflow step (e.g. '30s', '5m'). |

</details>

```typescript
export const listItems = pikkuSessionlessFunc({
  expose: true,
  description: 'List items, optionally filtered by category or search query.',
  input: ListItemsInput,
  output: ListItemsOutput,
  func: async (
    { kysely },
    { categorySlug, search, limit = 20, offset = 0 }
  ) => {
    let query = kysely
      .selectFrom('item')
      .innerJoin('category', 'category.categoryId', 'item.categoryId')
      .select([
        'item.itemId',
        'item.name',
        'item.slug',
        'item.description',
        'item.priceCents',
        'item.stock',
        'item.imageUrl',
        'category.categoryId',
        'category.name as categoryName',
        'category.slug as categorySlug',
      ])
      .where('item.isActive', '=', 1)

    if (categorySlug) {
      query = query.where('category.slug', '=', categorySlug)
    }
    if (search) {
      query = query.where((eb) =>
        eb.or([
          eb('item.name', 'like', `%${search}%`),
          eb('item.description', 'like', `%${search}%`),
        ])
      )
    }

    const [rows, countRow] = await Promise.all([
      query.limit(limit).offset(offset).execute(),
      query
        .select((eb) => eb.fn.countAll<number>().as('count'))
        .executeTakeFirst(),
    ])

    return {
      items: rows.map((r) => ({
        itemId: r.itemId,
        name: r.name,
        slug: r.slug,
        description: r.description,
        priceCents: r.priceCents,
        stock: r.stock,
        imageUrl: r.imageUrl,
        category: {
          categoryId: r.categoryId,
          name: r.categoryName,
          slug: r.categorySlug,
        },
      })),
      total: Number(countRow?.count ?? 0),
    }
  },
})
```

### `pikkuVoidFunc` {#pikkuvoidfunc}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a function that takes no input and returns no output.
Useful for health checks, triggers, or cleanup operations.

```typescript
pikkuVoidFunc: (func: PikkuFunctionSessionless<void, void, "session" | "rpc"> | PikkuFunctionSessionlessConfig<void, void, "session" | "rpc">) => PikkuFunctionConfig<void, void, "session" | "rpc">
```

```typescript
export const cleanupAbandonedBaskets = pikkuVoidFunc({
  // Exposed so an operator can run the sweep on demand and a scenario can
  // prove it still works. A job reachable only by its schedule is a job
  // nobody can test and nobody can force when it matters.
  expose: true,
  description: 'Cron job: remove anonymous baskets older than 7 days.',
  func: async ({ kysely, logger }) => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 7)

    const result = await kysely
      .deleteFrom('basket')
      .where('userId', 'is', null)
      .where('updatedAt', '<', cutoff.toISOString())
      .executeTakeFirst()

    logger.info({
      event: 'cleanup_abandoned_baskets',
      deleted: Number(result.numDeletedRows ?? 0),
    })
  },
})
```

### `ref` {#ref}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

References a registered function by name for use in any wiring.
Works for both local and addon functions — resolves via RPC at runtime.

```typescript
ref: <Name extends keyof FlattenedRPCMap>(rpcName: Name) => PikkuFunctionConfig<FlattenedRPCMap[Name]["input"], FlattenedRPCMap[Name]["output"], "session" | "rpc">
```

```typescript
// Use in agent tools
tools: [ref('todos:listTodos'), ref('myLocalFunc')]

// Use in HTTP wiring
wireHTTP({ route: '/greet', method: 'post', func: ref('greet') })
```

### `refChannel` {#refchannel}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Names a channel an installed addon wires, for connecting to it without
hardcoding its name.

```typescript
refChannel: <Name extends keyof typeof __addonChannel>(name: Name) => (typeof __addonChannel)[Name]
```

### `refCLI` {#refcli}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Names a CLI command an installed addon wires, for invoking it without
hardcoding its name.

```typescript
refCLI: <Name extends keyof typeof __addonCli>(name: Name) => (typeof __addonCli)[Name]
```

### `refHTTP` {#refhttp}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Names an HTTP route an installed addon wires, so you can link or redirect to
it without hardcoding a path the addon may move.

```typescript
refHTTP: <Name extends keyof typeof __addonHttp>(name: Name, options?: { basePath?: string; }) => (typeof __addonHttp)[Name]
```

### `Services` {#services}

<span className="api-symbol-meta">interface · re-exported from `@pikku/templates-functions`</span>

Everything a function is handed as its first argument: the singleton services
plus whatever is built per request. This is the type to widen when you add a
service.

<details>
<summary>Config keys (23)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `agentRunService` | `AgentRunService` |  |
| `aiEmbedding` | `AIEmbeddingService` |  |
| `audit` | `AuditService` |  |
| `auditLog` | `AuditLog` | Request-scoped audit buffer that writes into `audit` (the durable sink). Returned as a wire service so the runner flushes it via `close()` when the invocation ends. |
| `config` <sup>required</sup> | `import("#pikku/setup/pikku-setup-types.gen.js").Config` |  |
| `content` | `ContentService<string>` |  |
| `coverageService` | `CoverageService` | V8 precise-coverage collector (`pikku dev --coverage` only) |
| `credentialService` | `CredentialService` |  |
| `deploymentService` | `DeploymentService` |  |
| `emailService` | `EmailService` |  |
| `logger` <sup>required</sup> | `Logger` |  |
| `metaService` | `MetaService` |  |
| `schedulerService` | `SchedulerService` |  |
| `schema` | `SchemaService` |  |
| `scopeService` | `ScopeService` | Resolves and administers user scopes. Called when building a session, never by the function runner. |
| `secrets` <sup>required</sup> | `SecretService` |  |
| `sessionStore` | `SessionStore<CoreUserSession>` | Session store for persisting user sessions keyed by pikkuUserId |
| `variables` <sup>required</sup> | `VariablesService` |  |
| `virtualUserRunStore` | `VirtualUserRunStore` | Where virtual-user runs are recorded. A run is dispatched and answered for later, so this store is the only trace it leaves — see &#123;@link VirtualUserRunStore&#125;. |
| `virtualUserScheduleStore` | `VirtualUserScheduleStore` | Each persona's cadence, for apps that want their virtual users to keep going without being asked. Separate from the run store on purpose: wiring nothing is how an app says it only wants the runs it starts itself. |
| `webhookService` | `WebhookService` | Queue-backed outgoing webhook delivery. The queue-only default throws on the delivery-read methods; a store-backed implementation records history. |
| `workflowRunService` | `WorkflowRunService` |  |
| `workflowService` | `WorkflowService` |  |

</details>

### `Session` {#session}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

The signed-in user as this project defines it. Reached on the wire as
`session`, and replaced with `setSession`.

```typescript
Session: UserSession
```

<details>
<summary>Config keys (4)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `actor` | `boolean` | True when the session belongs to a synthetic scenario actor — lets audits/analytics address synthetic traffic |
| `orgId` | `string` |  |
| `readonly` | `boolean` | Restricts the session to functions declared `readonly`. The function runner throws `ReadonlySessionError` for anything else. |
| `scopes` | `string[]` | Scopes granted to this session, checked against a function's `scopes`. Populated by whoever builds the session — core reads them, never fetches. |

</details>

### `SingletonServices` {#singletonservices}

<span className="api-symbol-meta">interface · re-exported from `@pikku/templates-functions`</span>

The services that live for the process — the ones built once in `createConfig`/
`createSingletonServices` and shared by every request.

<details>
<summary>Config keys (23)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `agentRunService` | `AgentRunService` |  |
| `aiEmbedding` | `AIEmbeddingService` |  |
| `audit` | `AuditService` |  |
| `auditLog` | `AuditLog` | Request-scoped audit buffer that writes into `audit` (the durable sink). Returned as a wire service so the runner flushes it via `close()` when the invocation ends. |
| `config` <sup>required</sup> | `import("#pikku/setup/pikku-setup-types.gen.js").Config` |  |
| `content` | `ContentService<string>` |  |
| `coverageService` | `CoverageService` | V8 precise-coverage collector (`pikku dev --coverage` only) |
| `credentialService` | `CredentialService` |  |
| `deploymentService` | `DeploymentService` |  |
| `emailService` | `EmailService` |  |
| `logger` <sup>required</sup> | `Logger` |  |
| `metaService` | `MetaService` |  |
| `schedulerService` | `SchedulerService` |  |
| `schema` | `SchemaService` |  |
| `scopeService` | `ScopeService` | Resolves and administers user scopes. Called when building a session, never by the function runner. |
| `secrets` <sup>required</sup> | `SecretService` |  |
| `sessionStore` | `SessionStore<CoreUserSession>` | Session store for persisting user sessions keyed by pikkuUserId |
| `variables` <sup>required</sup> | `VariablesService` |  |
| `virtualUserRunStore` | `VirtualUserRunStore` | Where virtual-user runs are recorded. A run is dispatched and answered for later, so this store is the only trace it leaves — see &#123;@link VirtualUserRunStore&#125;. |
| `virtualUserScheduleStore` | `VirtualUserScheduleStore` | Each persona's cadence, for apps that want their virtual users to keep going without being asked. Separate from the run store on purpose: wiring nothing is how an app says it only wants the runs it starts itself. |
| `webhookService` | `WebhookService` | Queue-backed outgoing webhook delivery. The queue-only default throws on the delivery-read methods; a store-backed implementation records history. |
| `workflowRunService` | `WorkflowRunService` |  |
| `workflowService` | `WorkflowService` |  |

</details>

### `WiredServices` {#wiredservices}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

The services a wired function actually receives. The inspector records which
services each wired `func`, `permissions` and `middleware` destructures and
emits them as `RequiredSingletonServices`; intersecting that here makes those
services **non-optional** at every call site. A service is optional only when
nothing destructures it — in which case it is never created either. This is
why an `if (!service)` guard inside a function body is always dead code.

Only the wire-services half lives here. The singleton half is declared by the
auth and middleware leaves that use it, because whether a name earns its
export is measured rather than chosen: emit declarations for a project and
`WiredServices` is named by 147 of its `.d.ts` files, while the singleton
intersection is named by none outside the leaves that declare it. Export the
latter and it is a compatibility promise nothing asked for; unexport
`WiredServices` and every wired module inlines the intersection instead,
which asks it to name each member service through a specifier it does not
have — 3308 TS2883s. `--noEmit` cannot surface any of that, so re-check with
`tsc --declaration --emitDeclarationOnly` before moving either one.

<details>
<summary>Config keys (22)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `agentRunService` <sup>required</sup> | `AgentRunService` |  |
| `aiEmbedding` | `AIEmbeddingService` |  |
| `audit` | `AuditService` |  |
| `auditLog` | `AuditLog` | Request-scoped audit buffer that writes into `audit` (the durable sink). Returned as a wire service so the runner flushes it via `close()` when the invocation ends. |
| `config` <sup>required</sup> | `import("#pikku/setup/pikku-setup-types.gen.js").Config` |  |
| `content` | `ContentService<string>` |  |
| `coverageService` <sup>required</sup> | `CoverageService` | V8 precise-coverage collector (`pikku dev --coverage` only) |
| `credentialService` <sup>required</sup> | `CredentialService` |  |
| `deploymentService` <sup>required</sup> | `DeploymentService` |  |
| `emailService` | `EmailService` |  |
| `logger` <sup>required</sup> | `Logger` |  |
| `metaService` <sup>required</sup> | `MetaService` |  |
| `schedulerService` <sup>required</sup> | `SchedulerService` |  |
| `schema` <sup>required</sup> | `SchemaService` |  |
| `scopeService` <sup>required</sup> | `ScopeService` | Resolves and administers user scopes. Called when building a session, never by the function runner. |
| `sessionStore` | `SessionStore<CoreUserSession>` | Session store for persisting user sessions keyed by pikkuUserId |
| `variables` <sup>required</sup> | `VariablesService` |  |
| `virtualUserRunStore` <sup>required</sup> | `VirtualUserRunStore` | Where virtual-user runs are recorded. A run is dispatched and answered for later, so this store is the only trace it leaves — see &#123;@link VirtualUserRunStore&#125;. |
| `virtualUserScheduleStore` <sup>required</sup> | `VirtualUserScheduleStore` | Each persona's cadence, for apps that want their virtual users to keep going without being asked. Separate from the run store on purpose: wiring nothing is how an app says it only wants the runs it starts itself. |
| `webhookService` <sup>required</sup> | `WebhookService` | Queue-backed outgoing webhook delivery. The queue-only default throws on the delivery-read methods; a store-backed implementation records history. |
| `workflowRunService` <sup>required</sup> | `WorkflowRunService` |  |
| `workflowService` <sup>required</sup> | `WorkflowService` |  |

</details>

## Inside an addon

Addon authors get this door unchanged as `#pikku/addon/function` — same 20 exports, same shapes. Only the import specifier differs.

---

Run `npx pikku doc function` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
