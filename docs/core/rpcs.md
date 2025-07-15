---
sidebar_position: 60
title: RPCs (Remote Procedure Calls)
description: Calling functions from within other functions
---

RPCs (Remote Procedure Calls) in Pikku allow you to call one function from within another function. This is useful for code reuse, creating helper functions, and building complex workflows by composing smaller functions.

## How RPCs Work

Any `pikkuFunc`, `pikkuSessionlessFunc`, or `pikkuVoidFunc` can be called as an RPC from within another function using the `rpc.invoke()` method. The RPC system automatically handles:

- **Type safety**: Full TypeScript support for inputs and outputs
- **Session management**: Sessions are passed through to the called function
- **Service injection**: All services are available to the called function
- **Recursion protection**: Built-in depth tracking to prevent infinite loops

## Basic RPC Usage

### Creating Functions That Can Be Called as RPCs

Any Pikku function can be invoked as an RPC:

```typescript
import { pikkuFunc, pikkuSessionlessFunc } from '#pikku/pikku-types.gen.js'

// This function can be called as an RPC
export const calculateTax = pikkuSessionlessFunc<
  { amount: number; rate: number },
  { tax: number; total: number }
>(async ({ logger }, { amount, rate }) => {
  logger.info(`Calculating tax for amount: ${amount}`)
  
  const tax = amount * rate
  const total = amount + tax
  
  return { tax, total }
})

// Session based RPC functions can also be called as an RPC
export const validateUser = pikkuFunc<
  { userId: string },
  { isValid: boolean; user?: { name: string; email: string } }
>(async ({ todos, logger }, { userId }, session) => {
  logger.info(`Validating user: ${userId}`)
  
  const user = await todos.getUserById(userId)
  if (!user) {
    return { isValid: false }
  }
  
  return { 
    isValid: true, 
    user: { name: user.name, email: user.email }
  }
})
```

### Calling Functions as RPCs

Use the `rpc` service to invoke other functions:

```typescript
export const processOrder = pikkuFunc<
  { userId: string; items: Array<{ price: number }> },
  { success: boolean; total: number; tax: number }
>(async ({ rpc, logger }, { userId, items }, session) => {
  logger.info(`Processing order for user: ${userId}`)
  
  // First, validate the user (RPC call)
  const userValidation = await rpc.invoke('validateUser', { userId })
  
  if (!userValidation?.isValid) {
    throw new Error('Invalid user')
  }
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  
  // Calculate tax (RPC call)
  const taxResult = await rpc.invoke('calculateTax', {
    amount: subtotal,
    rate: 0.08
  })
  
  logger.info(`Order processed: ${taxResult?.total}`)
  
  return {
    success: true,
    total: taxResult?.total || subtotal,
    tax: taxResult?.tax || 0
  }
})
```

## Advanced RPC Patterns

### RPC Depth Tracking

Pikku automatically tracks RPC call depth to prevent infinite recursion:

```typescript
export const recursiveFunction = pikkuSessionlessFunc<
  { count: number },
  { result: number }
>(async ({ rpc, logger }, { count }) => {
  logger.info(`RPC depth: ${rpc?.depth || 0}`)
  
  // Prevent infinite recursion
  if (rpc?.depth && rpc.depth >= 5) {
    return { result: count }
  }
  
  if (count > 0) {
    // Recursive RPC call
    const result = await rpc.invoke('recursiveFunction', { 
      count: count - 1 
    })
    return { result: result?.result || 0 }
  }
  
  return { result: count }
})
```

### Error Handling in RPCs

RPC calls can throw errors just like regular function calls:

```typescript
export const safeRPCCall = pikkuSessionlessFunc<
  { userId: string },
  { success: boolean; error?: string }
>(async ({ rpc, logger }, { userId }) => {
  try {
    const result = await rpc.invoke('validateUser', { userId })
    
    if (result?.isValid) {
      return { success: true }
    } else {
      return { success: false, error: 'User validation failed' }
    }
  } catch (error) {
    // You can either handle the error or bubble it up
    throw error
  }
})
```

## Common Use Cases

### 1. Code Reuse Across Routes

```typescript
// Shared business logic
export const getUserProfile = pikkuFunc<...>(async ({ todos }, { userId }) => {
  return await todos.getProfile(userId)
})

// Multiple HTTP routes can use the same logic
export const publicProfile = pikkuSessionlessFunc(async ({ rpc }, { userId }) => {
  return await rpc.invoke('getUserProfile', { userId })
})

export const privateProfile = pikkuFunc(async ({ rpc }, { userId }, session) => {
  // Add session-specific logic
  const profile = await rpc.invoke('getUserProfile', { userId })
  return { ...profile, isOwner: profile.userId === session.userId }
})
```

### 2. Complex Workflows

```typescript
export const completeOrderWorkflow = pikkuFunc<...>(async ({ rpc }, orderData, session) => {
  // Step 1: Validate order
  await rpc.invoke('validateOrder', orderData)
  
  // Step 2: Calculate totals
  const totals = await rpc.invoke('calculateOrderTotals', orderData)
  
  // Step 3: Process payment
  const payment = await rpc.invoke('processPayment', { 
    amount: totals.total,
    userId: session.userId 
  })
  
  // Step 4: Create order record
  return await rpc.invoke('createOrderRecord', { 
    ...orderData, 
    ...totals, 
    paymentId: payment.id 
  })
})
```

## Summary

RPCs in Pikku provide a powerful way to compose functions and create reusable business logic. By using `rpc.invoke()`, you can call any Pikku function from within another function while maintaining type safety and proper error handling.

Remember to always use optional chaining, handle errors gracefully, and design your RPC functions to be pure and reusable.