---
title: '#pikku/workflow'
sidebar_label: '#pikku/workflow'
sidebar_position: 2
description: 'Composes functions into a durable workflow whose steps survive a restart and retry on their own.'
---

# `#pikku/workflow`

Composes functions into a durable workflow whose steps survive a restart and retry on their own.

```typescript
import { pikkuWorkflowComplexFunc, pikkuWorkflowFunc, pikkuWorkflowGraph } from '#pikku/workflow'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`PikkuFunctionWorkflow`](#pikkufunctionworkflow) | type | The shape of a workflow's body — services, input, and the workflow wire. |
| [`pikkuWorkflowComplexFunc`](#pikkuworkflowcomplexfunc) | function | Declares a workflow whose control flow the DSL cannot express - a loop whose bound is only known at runtime, or branching that rejoins. An escape hatch: reach for `pikkuWorkflowFunc` unless the shape genuinely needs this. |
| [`pikkuWorkflowFunc`](#pikkuworkflowfunc) | function | Declares a workflow: the DSL form, where each step is awaited in order and the runner persists progress between them so a restart resumes rather than replays. The default choice for a workflow. |
| [`pikkuWorkflowGraph`](#pikkuworkflowgraph) | function | Declares a workflow as an explicit node graph, for a genuine cyclic dependency or a Node-only import the DSL cannot carry. The last resort of the three. |
| [`TypedWorkflow`](#typedworkflow) | interface | The wire a workflow step is handed: `step` to run one durably, plus sleeping, waiting for a signal and asking for approval. |
| [`WorkflowCancelledException`](#workflowcancelledexception) | class | Thrown inside a workflow step when the run has been cancelled, so the step stops rather than finishing work nobody wants. |

## Reference

### `PikkuFunctionWorkflow` {#pikkufunctionworkflow}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

The shape of a workflow's body — services, input, and the workflow wire.

```typescript
PikkuFunctionWorkflow: PikkuFunctionWorkflow<In, Out>
```

### `pikkuWorkflowComplexFunc` {#pikkuworkflowcomplexfunc}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Declares a workflow whose control flow the DSL cannot express - a loop whose
bound is only known at runtime, or branching that rejoins. An escape hatch:
reach for `pikkuWorkflowFunc` unless the shape genuinely needs this.

```typescript
pikkuWorkflowComplexFunc: { <InputSchema extends StandardSchemaV1 | undefined = undefined, OutputSchema extends StandardSchemaV1 | undefined = undefined>(config: PikkuWorkflowConfigWithSchema<InputSchema, OutputSchema>): PikkuFunctionConfig<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "workflow", PikkuFunctionWorkflow<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown>, InputSchema, OutputSchema>; <In, Out = unknown>(func: PikkuFunctionWorkflow<In, Out> | PikkuFunctionConfig<In, Out, "workflow", PikkuFunctionWorkflow<In, Out>>): PikkuFunctionConfig<In, Out, "workflow">; }
```

```typescript
/**
 * The DSL cannot express "one step per order item", so this one is written in
 * TypeScript. `workflow.do` still records each call, so a resumed run replays
 * the loop without repeating the work it already did.
 */
export const refundOrderWorkflow = pikkuWorkflowComplexFunc<
  { orderId: string },
  { refunded: number }
>({
  title: 'Refund Order',
  tags: ['orders'],
  func: async (_services, { orderId }, { workflow }) => {
    const order = await workflow.do('Read the order', 'getOrder', { orderId })

    for (const item of order.items) {
      await workflow.do(`Restock ${item.itemId}`, 'onLowStock', {
        itemId: item.itemId,
        name: item.name,
        stock: item.quantity,
      })
    }

    await workflow.do('Cancel the order', 'cancelOrder', { orderId })

    return { refunded: order.items.length }
  },
})
```

### `pikkuWorkflowFunc` {#pikkuworkflowfunc}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Declares a workflow: the DSL form, where each step is awaited in order and
the runner persists progress between them so a restart resumes rather than
replays. The default choice for a workflow.

```typescript
pikkuWorkflowFunc: { <InputSchema extends StandardSchemaV1 | undefined = undefined, OutputSchema extends StandardSchemaV1 | undefined = undefined>(config: PikkuWorkflowConfigWithSchema<InputSchema, OutputSchema>): PikkuFunctionConfig<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "workflow", PikkuFunctionWorkflow<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown>, InputSchema, OutputSchema>; <In, Out = unknown>(func: PikkuFunctionWorkflow<In, Out> | PikkuFunctionConfig<In, Out, "workflow", PikkuFunctionWorkflow<In, Out>>): PikkuFunctionConfig<In, Out, "workflow">; }
```

```typescript
// Every step of a DSL workflow is an ordinary pikku function. That is what
// makes a step retryable on its own, replayable from the durable log, and
// visible as a node in the generated workflow graph.
export const validateBasket = pikkuSessionlessFunc({
  description: 'Confirm the basket has items and enough stock to sell.',
  func: async ({ kysely }, { basketId }: { basketId: string }) => {
    const rows = await kysely
      .selectFrom('basketItem')
      .innerJoin('item', 'item.itemId', 'basketItem.itemId')
      .select([
        'basketItem.itemId',
        'basketItem.quantity',
        'item.stock',
        'item.name',
        'item.priceCents',
      ])
      .where('basketItem.basketId', '=', basketId)
      .execute()

    if (rows.length === 0) throw new Error('Basket is empty')
    for (const i of rows) {
      if (i.quantity > i.stock)
        throw new Error(`Insufficient stock for "${i.name}"`)
    }

    return {
      items: rows.map((i) => ({
        itemId: i.itemId,
        quantity: i.quantity,
        priceCents: i.priceCents,
      })),
      totalCents: rows.reduce((s, i) => s + i.priceCents * i.quantity, 0),
    }
  },
})
```

### `pikkuWorkflowGraph` {#pikkuworkflowgraph}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Declares a workflow as an explicit node graph, for a genuine cyclic
dependency or a Node-only import the DSL cannot carry. The last resort of the
three.

```typescript
pikkuWorkflowGraph: <const FuncMap extends Record<string, (keyof FlattenedRPCMap & string) | (keyof FlattenedWorkflowMap & string) | (keyof FlattenedAgentMap & string)>>(config: PikkuWorkflowGraphConfig<FuncMap, GraphNodeConfigMap<FuncMap>>) => PikkuWorkflowGraphResult
```

<details>
<summary>Config keys (7)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `config` | `GraphNodeConfigMap<FuncMap>` | Per-node settings — retries, timeouts, the edges between them. |
| `description` | `string` | What the graph does, for whoever is reading it rather than editing it. |
| `disabled` | `true` | Keeps the graph in the codebase but out of the build. |
| `name` | `string` | Unique across the project. It is how the graph is started and how its runs are grouped. |
| `nodes` <sup>required</sup> | `Record<string, 117 names (pikku meta)>` | The graph's steps, keyed by node id, each naming a function. `pikku meta` lists the names available here. |
| `notes` | `string[]` | Free text carried onto the rendered graph, for a reader who needs the reasoning the shape cannot show. |
| `tags` | `string[]` | Filters this graph in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |

</details>

```typescript
/**
 * The nightly housekeeping pass, declared as a graph rather than code: each
 * node names an RPC and says what feeds it, so the shape is data the console
 * can draw.
 */
export const nightlyHousekeeping = pikkuWorkflowGraph({
  description: 'Sweep abandoned baskets, then report the day',
  tags: ['reports'],
  nodes: {
    sweep: 'cleanupAbandonedBaskets',
    report: 'dailySalesReport',
  },
  config: {
    sweep: {
      next: 'report',
    },
    report: {},
  },
})
```

### `TypedWorkflow` {#typedworkflow}

<span className="api-symbol-meta">interface · generated into `.pikku` by the CLI</span>

The wire a workflow step is handed: `step` to run one durably, plus sleeping,
waiting for a signal and asking for approval.

<details>
<summary>Config keys (7)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `approval` <sup>required</sup> | `WorkflowWireApproval` | Suspend workflow until a human records a decision against this gate |
| `getRun` <sup>required</sup> | `() => Promise<WorkflowRun>` | Get the current workflow run |
| `name` <sup>required</sup> | `string` | The workflow name |
| `pikkuUserId` | `string` | Pikku user ID propagated from the originating request for credential resolution |
| `runId` <sup>required</sup> | `string` | The current run ID |
| `sleep` <sup>required</sup> | `WorkflowWireSleep` | Sleep for a duration |
| `suspend` <sup>required</sup> | `WorkflowWireSuspend` | Suspend workflow until explicitly resumed |

</details>

### `WorkflowCancelledException` {#workflowcancelledexception}

<span className="api-symbol-meta">class · re-exported from `@pikku/core/workflow`</span>

Thrown inside a workflow step when the run has been cancelled, so the step
stops rather than finishing work nobody wants.

```typescript
WorkflowCancelledException: new WorkflowCancelledException(runId: string, reason?: string)
```

<details>
<summary>Config keys (2)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `reason` | `string` |  |
| `runId` <sup>required</sup> | `string` |  |

</details>

## Inside an addon

Addon authors get this door unchanged as `#pikku/addon/workflow` — same 6 exports, same shapes. Only the import specifier differs.

---

Run `npx pikku doc workflow` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
