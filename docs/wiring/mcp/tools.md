# MCP Tools

Tools let AI agents perform actions in your application. They can create records, modify state, trigger operations, or orchestrate complex workflows.

:::warning Always Specify Output Types
MCP functions must **always specify the output type explicitly**. TypeScript's type inference doesn't work reliably for MCP responses, so you need to be explicit:

```typescript
// ✅ Correct - explicit type
pikkuMCPToolFunc<InputType, MCPToolResponse>

// ❌ Wrong - will cause type issues
pikkuMCPToolFunc<InputType>
```
:::

**Recommended Pattern**: Keep your MCP tools thin. Use RPC to invoke your existing domain functions, then format the response for MCP. This keeps your business logic reusable and your codebase clean.

## Your First Tool

Let's create a tool that creates issues. Both the domain function and MCP adapter live in the same file:

```typescript
// issues.function.ts
import { pikkuFunc, pikkuMCPToolFunc } from '#pikku'
import type { MCPToolResponse } from '#pikku'

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
  docs: {
    summary: 'Create a new issue',
    tags: ['issues'],
    errors: ['BadRequestError']
  }
})

// MCP adapter - just formats the response for AI agents
export const createIssueMCP = pikkuMCPToolFunc<
  { title: string; description: string; priority: 'low' | 'medium' | 'high' },
  MCPToolResponse
>({
  func: async ({ rpc }, data) => {
    const issue = await rpc.invoke('createIssue', data)

    return [
      {
        type: 'text',
        text: `Created issue #${issue.id}: ${issue.title} (${issue.status})`
      }
    ]
  },
  docs: {
    summary: 'Create a new issue (MCP adapter)',
    tags: ['mcp', 'issues']
  }
})
```

```typescript
// issues.mcp.ts
import { wireMCPTool } from '#pikku/mcp'
import { createIssueMCP } from './functions/issues.function.js'

wireMCPTool({
  name: 'createIssue',
  description: 'Create a new issue in the tracker',
  func: createIssueMCP,
  tags: ['issues', 'write']
})
```

Now your business logic in `createIssue` can be used from HTTP, WebSocket, queues, or MCP - and `createIssueMCP` just makes it MCP-compatible.

## Complex Operations

For complex workflows, invoke multiple functions via RPC:

```typescript
// Domain function
export const processOrder = pikkuFunc<
  { orderId: string },
  { orderId: string; invoiceId: string; paymentId: string; status: string }
>({
  func: async ({ database, rpc, logger }, data) => {
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
  docs: {
    summary: 'Process an order end-to-end',
    tags: ['orders']
  }
})
```

```typescript
// MCP adapter
export const processOrderMCP = pikkuMCPToolFunc<
  { orderId: string },
  MCPToolResponse
>({
  func: async ({ rpc }, data) => {
    const result = await rpc.invoke('processOrder', data)

    return [
      {
        type: 'text',
        text: `Processed order ${result.orderId}\nInvoice: #${result.invoiceId}\nPayment: #${result.paymentId}\nStatus: ${result.status}`
      }
    ]
  },
  docs: {
    summary: 'Process an order (MCP adapter)',
    tags: ['mcp', 'orders']
  }
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
export const generateChartMCP = pikkuMCPToolFunc<
  { datasetId: string },
  MCPToolResponse
>({
  func: async ({ rpc }, data) => {
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
  docs: {
    summary: 'Generate chart (MCP adapter)',
    tags: ['mcp', 'charts']
  }
})
```

## Wiring Configuration

Wire your tool functions with these options:

```typescript
import { wireMCPTool } from '#pikku/mcp'
import { processOrderMCP } from './functions/orders.mcp-function.js'
import { requireAdmin } from './permissions.js'
import { auditMiddleware } from './middleware.js'

wireMCPTool({
  // Required
  name: 'processOrder',
  description: 'Process an order end-to-end',
  func: processOrderMCP,

  // Optional
  middleware: [auditMiddleware],
  permissions: { admin: requireAdmin },
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

## Next Steps

- [MCP Resources](./resources.md) - Provide data sources for AI agents
- [MCP Prompts](./prompts.md) - Generate structured conversation templates