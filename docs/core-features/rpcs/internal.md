---
sidebar_position: 1
title: Internal RPCs
description: Function-to-function calls
---

# Internal RPCs

Internal RPCs let you call one function from another using `rpc.invoke()`. This is how you orchestrate workflows, reuse business logic, and transform outputs for specific transports.

## Your First Internal RPC

Let's call a function from another function:

```typescript
// Calculate order totals - reusable business logic
export const calculateOrderTotal = pikkuSessionlessFunc<
  { items: Array<{ price: number; quantity: number }> },
  { subtotal: number; tax: number; total: number }
>({
  func: async ({ database }, data) => {
    const subtotal = data.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    )

    const taxRate = await database.query('config', {
      where: { key: 'tax_rate' }
    })

    const tax = subtotal * (taxRate?.value ?? 0.08)
    const total = subtotal + tax

    return { subtotal, tax, total }
  },
  docs: {
    summary: 'Calculate order totals with tax',
    tags: ['orders']
  }
})

// Process order - uses RPC to calculate totals
export const processOrder = pikkuFunc<
  { items: Array<{ price: number; quantity: number }> },
  { orderId: string; total: number }
>({
  func: async ({ rpc, database }, data, session) => {
    // Internal RPC call
    const totals = await rpc.invoke('calculateOrderTotal', {
      items: data.items
    })

    const order = await database.insert('orders', {
      userId: session.userId,
      ...totals,
      status: 'pending'
    })

    return {
      orderId: order.id,
      total: totals.total
    }
  },
  auth: true,
  docs: {
    summary: 'Process a new order',
    tags: ['orders']
  }
})
```

Now `calculateOrderTotal` is reusable:
- Called via internal RPC from `processOrder`
- Can be wired to HTTP for price estimates
- Can be called from CLI commands
- Can be used in queue jobs

The function doesn't change - it works everywhere.

## Transforming Output for Transports

RPC is perfect for calling a function and transforming its output before returning to the client:

```typescript
// Domain function - returns structured data
export const getUserInfo = pikkuFunc<
  { userId: string },
  { userId: string; name: string; email: string }
>({
  func: async ({ database }, data) => {
    const user = await database.query('users', {
      where: { userId: data.userId }
    })

    if (!user) {
      throw new NotFoundError(`User not found`)
    }

    return { userId: user.userId, name: user.name, email: user.email }
  },
  docs: {
    summary: 'Get user information',
    tags: ['users']
  }
})

// MCP adapter - transforms output for AI agents
export const getUserInfoMCP = pikkuMCPResourceFunc<
  { userId: string },
  MCPResourceResponse
>({
  func: async ({ rpc }, data) => {
    // Call the function via RPC
    const user = await rpc.invoke('getUserInfo', data)

    // Transform for MCP format
    return [
      {
        uri: `user://${user.userId}`,
        text: JSON.stringify(user)
      }
    ]
  },
  docs: {
    summary: 'Get user information (MCP adapter)',
    tags: ['mcp', 'users']
  }
})
```

This pattern keeps business logic in one place while adapting output for different transports (HTTP, MCP, CLI, etc.).

## Orchestrating Complex Workflows

Use RPC to coordinate multiple operations:

```typescript
export const closeAccount = pikkuFunc<
  { accountId: string },
  { closed: true }
>({
  func: async ({ rpc, logger }, data, session) => {
    logger.info('Starting account closure', { accountId: data.accountId })

    // Each step is a separate, testable function
    await rpc.invoke('validateAccountOwnership', {
      accountId: data.accountId
    })

    await rpc.invoke('cancelActiveSubscriptions', {
      accountId: data.accountId
    })

    await rpc.invoke('revokeAccessKeys', {
      accountId: data.accountId
    })

    await rpc.invoke('sendClosureNotification', {
      accountId: data.accountId
    })

    await rpc.invoke('archiveAccountData', {
      accountId: data.accountId
    })

    logger.info('Account closure complete')

    return { closed: true }
  },
  auth: true,
  permissions: {
    owner: requireAccountOwner
  },
  docs: {
    summary: 'Close an account',
    tags: ['accounts']
  }
})
```

Each step:
- Can be tested independently
- Can be reused in other workflows
- Can be called from different transports
- Can be modified without affecting the orchestration
- On roadmap: Can be called on remote servers (microservices)

## Recursion with Depth Tracking

RPC automatically tracks call depth to prevent infinite loops:

```typescript
export const processNestedCategories = pikkuSessionlessFunc<
  { categoryId: string; depth?: number },
  { processed: number }
>({
  func: async ({ rpc, database, logger }, data) => {
    logger.info('Processing category', {
      categoryId: data.categoryId,
      depth: rpc.depth
    })

    // Prevent infinite recursion
    if (rpc.depth >= 10) {
      throw new Error('Maximum recursion depth exceeded')
    }

    // Get subcategories
    const subcategories = await database.query('categories', {
      where: { parentId: data.categoryId }
    })

    let processed = 1

    // Recursively process each subcategory
    for (const sub of subcategories) {
      const result = await rpc.invoke('processNestedCategories', {
        categoryId: sub.id
      })
      processed += result.processed
    }

    return { processed }
  },
  docs: {
    summary: 'Process nested categories recursively',
    tags: ['categories']
  }
})
```

Access current depth via `rpc.depth` to:
- Prevent infinite recursion
- Limit processing depth
- Track call chains for debugging

## Session and Auth Inheritance

Internal RPCs inherit the caller's session and still enforce auth/permissions:

```typescript
export const restrictedOperation = pikkuFunc<
  { resourceId: string },
  { success: boolean }
>({
  func: async ({ database }, data, session) => {
    // Requires auth and checks permissions
    return { success: true }
  },
  auth: true,
  permissions: {
    owner: requireResourceOwner
  }
})

export const orchestrator = pikkuFunc<
  { resourceId: string },
  { complete: boolean }
>({
  func: async ({ rpc }, data, session) => {
    // This RPC call inherits session from orchestrator
    // Auth and permissions are still checked
    await rpc.invoke('restrictedOperation', {
      resourceId: data.resourceId
    })

    return { complete: true }
  },
  auth: true  // Session is passed through
})
```

RPC calls:
- Inherit the caller's session
- Still enforce the called function's `auth` requirement
- Still check the called function's permissions
- Maintain security boundaries

## Error Handling

RPC calls throw errors just like direct function calls:

```typescript
export const safeWorkflow = pikkuFunc<
  { orderId: string },
  { success: boolean; error?: string }
>({
  func: async ({ rpc, logger }, data) => {
    try {
      await rpc.invoke('validateOrder', { orderId: data.orderId })
      await rpc.invoke('processPayment', { orderId: data.orderId })
      await rpc.invoke('fulfillOrder', { orderId: data.orderId })

      return { success: true }
    } catch (error) {
      logger.error('Workflow failed', {
        orderId: data.orderId,
        error: error.message
      })

      return {
        success: false,
        error: error.message
      }
    }
  },
  docs: {
    summary: 'Process order with error handling',
    tags: ['orders']
  }
})
```

## When NOT to Use Internal RPC

**Don't use RPC for simple service calls:**

```typescript
// ❌ Bad - wrapping simple service call in RPC
export const getCard = pikkuFunc<{ cardId: string }, Card>({
  func: async ({ rpc }, data) => {
    return await rpc.invoke('loadCard', { cardId: data.cardId })
  }
})

export const loadCard = pikkuFunc<{ cardId: string }, Card>({
  func: async ({ database }, data) => {
    return await database.query('cards', { where: { id: data.cardId } })
  }
})
```

**Instead, call services directly:**

```typescript
// ✅ Good - call service directly for simple CRUD
export const getCard = pikkuFunc<{ cardId: string }, Card>({
  func: async ({ database }, data) => {
    return await database.query('cards', { where: { id: data.cardId } })
  }
})
```

Use RPC when:
- Orchestrating multiple operations
- Transforming output for specific transports
- The operation involves reusable business logic
- Auth/permissions need to be enforced
- You need recursion with depth tracking

## Type Safety

Internal RPC calls are fully type-safe:

```typescript
// Function signature defines types
export const calculateTax = pikkuSessionlessFunc<
  { amount: number; rate: number },
  { tax: number; total: number }
>({ /* ... */ })

// TypeScript enforces correct input
const result = await rpc.invoke('calculateTax', {
  amount: 100,
  rate: 0.08
})

// TypeScript knows the output type
result.tax      // ✅ number
result.total    // ✅ number
result.invalid  // ❌ TypeScript error
```

## Next Steps

- [External RPCs](./external.md) - Exposing functions to clients
- [Functions](../functions.md) - Understanding Pikku functions
- [Middleware](../middleware.md) - Applying middleware
