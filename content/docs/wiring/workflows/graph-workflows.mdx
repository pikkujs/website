---
sidebar_position: 4
title: Graph Workflows
description: Declarative node-based workflow definitions
---

# Graph Workflows

Graph workflows define multi-step processes declaratively as a graph of nodes. Instead of writing imperative code with `workflow.do()` and `workflow.sleep()`, you describe the workflow structure as data — nodes, connections, and data flow between them.

## When to Use Graph Workflows

**Use graph workflows when:**
- You want a visual/declarative workflow definition
- You want the structure to be inspectable as data
- You prefer configuration over code
- The flow is primarily RPC calls with data passing between them

**Use DSL workflows when:**
- You need complex conditional logic within steps
- You prefer imperative programming style
- You need inline code execution between steps

## Basic Example

```typescript @snippet wa-graph-basic
```

## Structure

A graph workflow has three main parts:

### nodes

`nodes` maps each node ID to the function it runs. In the example above `validate: 'validateBasket'` means the node `validate` calls the RPC function `validateBasket`. The value can also be a registered workflow name or an AI agent name.

### config

`config` is keyed by node ID. `next` names the node that runs after this one, `onError` names an error handler node, and `input` maps this node's input from other nodes, using the `ref` helper it is handed.

### description and tags

`description` and `tags` are optional metadata for documentation and filtering. Both appear on the graph in the example above.

## References with ref()

The `ref()` function connects nodes by referencing outputs from previous nodes or the workflow input.

### Reference workflow input

To reference the workflow input, pass `'trigger'` as the node ID, as in `ref('trigger', 'basketId')`.

### Reference node output

To reference another node's output, pass that node's ID and the output field, as in `ref('validate', 'totalCents')`.

The CLI generates types so `ref()` provides autocomplete for both node IDs and output fields.

## Sub-Workflow and Agent Nodes

A node's function name doesn't have to be an RPC — it can also be:

- **A registered workflow name.** The node starts a child workflow run and its result is the child's output.
- **A registered AI agent name.** The node runs the agent (via the agent-run path) and its result is the agent's declared output, so downstream nodes can `ref()` its output fields.

An agent node takes the standard agent input — `message`, `threadId`, and `resourceId`:

```typescript @snippet wa-graph-agent-node
```

The generated `pikkuWorkflowGraph` wrapper type-checks all three kinds of names, and `ref()` on an agent node resolves the keys of the agent's `output` schema. Give the agent an `output` schema if downstream nodes need typed access to its result — see [AI Agents](/docs/wiring/ai-agents).

## Flow Control

### Sequential

Nodes run one after another:

```typescript @snippet wa-graph-sequential
```

### Parallel

Multiple nodes run concurrently:

```typescript @snippet wa-graph-parallel
```

### Branching

Set `next` to an object whose keys are branch names and whose values are node IDs, for example `next: { inStock: 'processOrder', outOfStock: 'notifyBackorder', discontinued: 'refundCustomer' }`.

In your RPC function, call `graph.branch()` to select the path:

```typescript @snippet wa-graph-branch-fn
```

## Error Handling

Route errors to handler nodes with `onError`:

```typescript @snippet wa-graph-on-error
```

## State Management

Store and retrieve state across the workflow using `graph.setState()` and `graph.getState()`:

```typescript @snippet wa-graph-state
```

## Graph Wire Context

Functions running in a graph workflow receive a `graph` object on the **wire** (the 3rd function argument, alongside `rpc`/`http`/etc. — not a service):

| Field | Type | Description |
|-------|------|-------------|
| `runId` | `string` | Workflow run ID |
| `graphName` | `string` | Workflow name |
| `nodeId` | `string` | Current node ID |
| `branch` | `(key: string) => void` | Pick which `next` branch runs |
| `setState` | `(name: string, value: unknown) => Promise<void>` | Store a value for the run |
| `getState` | `() => Promise<Record<string, unknown>>` | Read the stored state |

## Starting a Graph Workflow

A `pikkuWorkflowGraph` exported from a `*.graph.ts` file is discovered and
registered automatically by `npx pikku` — the CLI generates a `graphStarter`
function and the route to start it. Start a run the same way as any workflow,
via `rpc.startWorkflow(name, input)` (on the wire object), which resolves to
`{ runId }`.

## Next Steps

- **[DSL Workflows](/docs/wiring/workflows)**: Imperative workflow style with `workflow.do()` and `workflow.sleep()`
- **[Steps](/docs/wiring/workflows/steps)**: Step types and retry configuration
- **[Configuration](/docs/wiring/workflows/configuration)**: State storage and execution mode setup
