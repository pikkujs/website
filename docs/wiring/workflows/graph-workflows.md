---
sidebar_position: 4
title: Graph Workflows
description: Declarative node-based workflow definitions
draft: true
---

# Graph Workflows

:::caution Draft Documentation
This feature is still being finalized. The API may change.
:::

Graph workflows define multi-step processes declaratively as a graph of nodes. Instead of writing imperative code with `workflow.do()` and `workflow.sleep()`, you describe the workflow structure as data - nodes, connections, and data flow.

## When to Use Graph Workflows

**Use graph workflows when:**
- You want a visual/declarative workflow definition
- The workflow will be edited in Pikku Forge (visual editor)
- You prefer configuration over code
- The flow is primarily RPC calls with data passing between them

**Use DSL workflows when:**
- You need complex conditional logic within steps
- You prefer imperative programming style
- You need inline code execution between steps

## Basic Example

```typescript
import { pikkuWorkflowGraph, wireWorkflow } from '#pikku/workflow'

export const orderWorkflow = pikkuWorkflowGraph({
  description: 'Process a new order',
  tags: ['orders'],
  nodes: {
    validateOrder: 'validateOrder',
    processPayment: 'processPayment',
    sendConfirmation: 'sendOrderConfirmation',
  },
  wires: {
    http: [{ route: '/orders', method: 'post', startNode: 'validateOrder' }],
  },
  config: {
    validateOrder: {
      next: 'processPayment',
    },
    processPayment: {
      input: (ref) => ({
        orderId: ref('validateOrder', 'orderId'),
        amount: ref('validateOrder', 'total'),
      }),
      next: 'sendConfirmation',
    },
    sendConfirmation: {
      input: (ref) => ({
        email: ref('input', 'customerEmail'),
        orderId: ref('validateOrder', 'orderId'),
      }),
    },
  },
})

wireWorkflow({ graph: orderWorkflow })
```

## Structure

A graph workflow has four main parts:

### nodes

Maps node IDs to RPC function names:

```typescript
nodes: {
  createUser: 'userCreate',      // node ID -> RPC function name
  sendWelcome: 'emailSend',
  updateCRM: 'crmUserCreate',
}
```

### wires

Defines how the workflow can be triggered:

```typescript
wires: {
  http: [{ route: '/signup', method: 'post', startNode: 'createUser' }],
  schedule: [{ cron: '0 9 * * *', startNode: 'dailyReport' }],
  queue: [{ name: 'orders', startNode: 'processOrder' }],
}
```

### config

Configures each node's behavior:

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
  func: async ({ graph }, { productId }) => {
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
      // error details available in the error handler
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
  func: async ({ graph }, { step }) => {
    // Get current state
    const state = await graph.getState()
    const completedSteps = (state.completedSteps as string[]) || []

    // Update state
    await graph.setState('completedSteps', [...completedSteps, step])
    await graph.setState('lastUpdated', new Date().toISOString())

    return { updated: true }
  },
})
```

## Graph Wire Context

Functions running in a graph workflow receive a `graph` object in their services:

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

## Wiring the Workflow

After defining the graph, wire it to enable triggers:

```typescript
wireWorkflow({
  graph: orderWorkflow,
  enabled: true,   // default: true
})
```

## Trigger Types

Graph workflows support multiple trigger types in the `wires` configuration:

```typescript
wires: {
  // HTTP endpoint
  http: [{ route: '/start', method: 'post', startNode: 'entry' }],

  // Scheduled (cron)
  schedule: [{ cron: '0 * * * *', startNode: 'hourlyJob' }],

  // Queue message
  queue: [{ name: 'orders', startNode: 'processOrder' }],

  // WebSocket channel
  channel: [{
    name: 'notifications',
    onConnect: 'handleConnect',
    onMessage: 'handleMessage',
  }],
}
```
