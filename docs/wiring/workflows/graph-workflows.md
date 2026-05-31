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
- The workflow will be viewed or edited in the [Pikku Console](/docs/console)
- You prefer configuration over code
- The flow is primarily RPC calls with data passing between them

**Use DSL workflows when:**
- You need complex conditional logic within steps
- You prefer imperative programming style
- You need inline code execution between steps

## Basic Example

```typescript reference title="graph.graph.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/functions/src/wirings/graph.graph.ts
```

## Structure

A graph workflow has three main parts:

### nodes

Maps node IDs to RPC function names:

```typescript
nodes: {
  createUser: 'userCreate',      // node ID -> RPC function name
  sendWelcome: 'emailSend',
  updateCRM: 'crmUserCreate',
}
```

### config

Configures each node's input, flow control, and error handling:

```typescript
config: {
  createUser: {
    next: 'sendWelcome',           // which node runs next
    onError: 'handleError',        // error handler node
  },
  sendWelcome: {
    input: (ref) => ({             // map inputs from other nodes
      to: ref('createUser', 'email'),
      name: ref('createUser', 'name'),
    }),
  },
}
```

### description and tags

Optional metadata for documentation and filtering:

```typescript
description: 'User onboarding workflow',
tags: ['onboarding', 'users'],
```

## References with ref()

The `ref()` function connects nodes by referencing outputs from previous nodes or the workflow input.

### Reference workflow input

```typescript
input: (ref) => ({
  userId: ref('input', 'userId'),    // from workflow input
  email: ref('input', 'email'),
})
```

### Reference node output

```typescript
input: (ref) => ({
  orderId: ref('validateOrder', 'orderId'),   // from validateOrder node output
  total: ref('processPayment', 'chargedAmount'),
})
```

The CLI generates types so `ref()` provides autocomplete for both node IDs and output fields.

## Flow Control

### Sequential

Nodes run one after another:

```typescript
config: {
  step1: { next: 'step2' },
  step2: { next: 'step3' },
  step3: { /* no next = workflow ends */ },
}
```

### Parallel

Multiple nodes run concurrently:

```typescript
config: {
  fetchData: {
    next: ['sendEmail', 'updateCRM', 'logActivity'],  // all three run in parallel
  },
}
```

### Branching

Route to different nodes based on function logic:

```typescript
config: {
  checkInventory: {
    next: {
      inStock: 'processOrder',
      outOfStock: 'notifyBackorder',
      discontinued: 'refundCustomer',
    },
  },
}
```

In your RPC function, call `graph.branch()` to select the path:

```typescript
export const checkInventory = pikkuSessionlessFunc<
  { productId: string },
  { available: boolean }
>({
  func: async (services, { productId }, { graph }) => {
    const stock = await getStock(productId)

    if (stock.discontinued) {
      graph.branch('discontinued')
    } else if (stock.quantity > 0) {
      graph.branch('inStock')
    } else {
      graph.branch('outOfStock')
    }

    return { available: stock.quantity > 0 }
  },
})
```

## Error Handling

Route errors to handler nodes with `onError`:

```typescript
config: {
  processPayment: {
    next: 'sendConfirmation',
    onError: 'handlePaymentError',   // runs if processPayment fails
  },
  handlePaymentError: {
    input: (ref) => ({
      orderId: ref('input', 'orderId'),
    }),
  },
}
```

## State Management

Store and retrieve state across the workflow using `graph.setState()` and `graph.getState()`:

```typescript
export const updateProgress = pikkuSessionlessFunc<
  { step: string },
  { updated: boolean }
>({
  func: async (services, { step }, { graph }) => {
    const state = await graph.getState()
    const completedSteps = (state.completedSteps as string[]) || []

    await graph.setState('completedSteps', [...completedSteps, step])
    await graph.setState('lastUpdated', new Date().toISOString())

    return { updated: true }
  },
})
```

## Graph Wire Context

Functions running in a graph workflow receive a `graph` object on the **wire** (the 3rd function argument, alongside `rpc`/`http`/etc. — not a service):

```typescript
interface PikkuGraphWire {
  runId: string              // workflow run ID
  graphName: string          // workflow name
  nodeId: string             // current node ID
  branch: (key: string) => void
  setState: (name: string, value: unknown) => Promise<void>
  getState: () => Promise<Record<string, unknown>>
}
```

## Starting a Graph Workflow

A `pikkuWorkflowGraph` exported from a `*.graph.ts` file is discovered and
registered automatically by `npx pikku` — the CLI generates a `graphStarter`
function and the route to start it. Start a run the same way as any workflow,
via `rpc.startWorkflow(name, input)` (on the wire object), which resolves to
`{ runId }`.

## Visualizing in the Console

The [Pikku Console](/docs/console) renders graph workflows as interactive visual graphs, showing nodes, connections, and execution progress in real time. See [Console Features](/docs/console/features#workflows) for details.

## Next Steps

- **[DSL Workflows](./index.md)**: Imperative workflow style with `workflow.do()` and `workflow.sleep()`
- **[Steps](./steps.md)**: Step types and retry configuration
- **[Configuration](./configuration.md)**: State storage and execution mode setup
