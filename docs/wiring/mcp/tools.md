# MCP Tools

Tools let AI agents perform actions in your application. They can create records, modify state, trigger operations, or orchestrate complex workflows.

:::info Single Type Parameter
MCP tool functions take a **single input type parameter** — the output is always `MCPToolResponse`:

```typescript
// ✅ Correct - input type only
pikkuMCPToolFunc<InputType>

// ❌ Wrong - there is no output type parameter
pikkuMCPToolFunc<InputType, MCPToolResponse>
```

Alternatively, pass a schema as `input` (e.g. Zod) and the input type is inferred.
:::

**Recommended Pattern**: Keep your MCP tools thin. Use RPC to invoke your existing domain functions, then format the response for MCP. This keeps your business logic reusable and your codebase clean.

## Your First Tool

Let's create a tool that creates issues. Both the domain function and MCP adapter live in the same file:

```typescript
// issues.function.ts
import { pikkuFunc, pikkuMCPToolFunc } from '#pikku'

// Domain function - reusable across all transports
export const createIssue = pikkuFunc<
  { title: string; description: string; priority: 'low' | 'medium' | 'high' },
  { id: string; title: string; status: string }
>({
  func: async ({ database, logger }, data) => {
    logger.info('Creating issue', { title: data.title })

    const issue = await database.insert('issues', {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'open',
      createdAt: Date.now()
    })

    return issue
  },
  title: 'Create a new issue',
  tags: ['issues']
})

// MCP adapter - just formats the response for AI agents
export const createIssueMCP = pikkuMCPToolFunc<
  { title: string; description: string; priority: 'low' | 'medium' | 'high' }
>({
  description: 'Create a new issue in the tracker',
  func: async (services, data, { rpc }) => {
    const issue = await rpc.invoke('createIssue', data)

    return [
      {
        type: 'text',
        text: `Created issue #${issue.id}: ${issue.title} (${issue.status})`
      }
    ]
  },
  title: 'Create a new issue (MCP adapter)',
  tags: ['mcp', 'issues']
})
```

There's no separate wiring step for tools — exporting a `pikkuMCPToolFunc` registers it. The tool name comes from the export name (override it with the `name` option).

Now your business logic in `createIssue` can be used from HTTP, WebSocket, queues, or MCP - and `createIssueMCP` just makes it MCP-compatible.

## Exposing Any Function with `mcp: true`

When you don't need a custom MCP response format, skip the adapter entirely: setting `mcp: true` on any Pikku function registers it as an MCP tool directly, with its input schema and description carried over:

```typescript
export const listIssues = pikkuFunc<
  { status?: 'open' | 'closed' },
  { issues: Issue[] }
>({
  func: async ({ database }, data) => {
    return { issues: await database.select('issues', data) }
  },
  description: 'List issues, optionally filtered by status',
  mcp: true,
})
```

Give the function a `description` — it's what the AI agent sees when deciding whether to call the tool (the inspector warns if it's missing). Use the `pikkuMCPToolFunc` adapter pattern instead when you want to control the tool's text output or combine multiple domain calls into one tool.

## Complex Operations

For complex workflows, invoke multiple functions via RPC:

```typescript
// Domain function
export const processOrder = pikkuFunc<
  { orderId: string },
  { orderId: string; invoiceId: string; paymentId: string; status: string }
>({
  func: async ({ database, logger }, data, { rpc }) => {
    logger.info('Processing order', { orderId: data.orderId })

    const invoice = await rpc.invoke('generateInvoice', {
      orderId: data.orderId
    })

    const payment = await rpc.invoke('processPayment', {
      invoiceId: invoice.id
    })

    await rpc.invoke('sendConfirmationEmail', {
      orderId: data.orderId,
      paymentId: payment.id
    })

    const order = await database.update('orders', {
      where: { id: data.orderId },
      set: { status: 'completed', completedAt: Date.now() }
    })

    return {
      orderId: order.id,
      invoiceId: invoice.id,
      paymentId: payment.id,
      status: order.status
    }
  },
  title: 'Process an order end-to-end',
  tags: ['orders']
})
```

```typescript
// MCP adapter
export const processOrderMCP = pikkuMCPToolFunc<{ orderId: string }>({
  description: 'Process an order end-to-end',
  func: async (services, data, { rpc }) => {
    const result = await rpc.invoke('processOrder', data)

    return [
      {
        type: 'text',
        text: `Processed order ${result.orderId}\nInvoice: #${result.invoiceId}\nPayment: #${result.paymentId}\nStatus: ${result.status}`
      }
    ]
  },
  title: 'Process an order (MCP adapter)',
  tags: ['mcp', 'orders']
})
```

## Response Format

Tools must return an array of content blocks:

```typescript
type MCPToolResponse = Array<
  | { type: 'text'; text: string }
  | { type: 'image'; data: string }
>
```

Most tools return text responses:

```typescript
return [
  {
    type: 'text',
    text: 'Operation completed successfully'
  }
]
```

For operations with visual output, you can return images (base64-encoded):

```typescript
export const generateChartMCP = pikkuMCPToolFunc<{ datasetId: string }>({
  description: 'Generate a chart from a dataset',
  func: async (services, data, { rpc }) => {
    const chartData = await rpc.invoke('generateChart', data)

    return [
      {
        type: 'text',
        text: 'Generated chart:'
      },
      {
        type: 'image',
        data: chartData.base64Image
      }
    ]
  },
  title: 'Generate chart (MCP adapter)',
  tags: ['mcp', 'charts']
})
```

## Tool Configuration

All tool options live on `pikkuMCPToolFunc` itself — there is no separate wiring call:

```typescript
import { pikkuMCPToolFunc } from '#pikku'
import { requireAdmin } from './permissions.js'
import { auditMiddleware } from './middleware.js'

export const processOrder = pikkuMCPToolFunc<{ orderId: string }>({
  // Required
  description: 'Process an order end-to-end',
  func: async (services, data, { rpc }) => {
    const result = await rpc.invoke('processOrder', data)
    return [{ type: 'text', text: `Processed order ${result.orderId}` }]
  },

  // Optional
  name: 'processOrder',   // defaults to the export name
  title: 'Process Order',
  summary: 'Runs invoicing, payment, and confirmation',
  middleware: [auditMiddleware],
  tags: ['orders', 'admin']
})
```

## Why This Pattern?

Keeping MCP tools as thin adapters has several benefits:

1. **Reusability**: Your domain functions work across all transports (HTTP, WebSocket, queues, CLI, MCP)
2. **Testability**: Test business logic separately from MCP formatting
3. **Consistency**: Same validation, auth, and permission logic everywhere
4. **Maintainability**: Changes to business logic don't require updating MCP adapters

The MCP function's only job is to format the response for AI agents. All the real work happens in your reusable domain functions.

## Real-World Example: Shop Catalogue Tools

From the [online shop template](https://github.com/pikkujs/fabric/tree/main/templates/online-shop-template) — the same HTTP route functions wired as MCP tools so AI agents can browse and manage the catalogue.

```typescript @snippet mcpTools
```

Note that `listCategories`, `listItems`, `getItem`, `getBasket`, and `addToBasket` are the exact same functions already wired to HTTP routes — no duplication of business logic.

## Next Steps

- [MCP Resources](./resources.md) - Provide data sources for AI agents
- [MCP Prompts](./prompts.md) - Generate structured conversation templates