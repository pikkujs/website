---
sidebar_position: 1
title: Queue Functions
description: Learn how to create and structure queue functions
---

<AIDisclaimer />


# Queue Functions

Queue functions are the core building blocks of Pikku's background processing system. They are regular Pikku functions that process individual jobs with full type safety and access to your application's services.

## Basic Queue Function

Queue functions are created using `pikkuSessionlessFunc` since they don't have access to session data:

```typescript
// email-worker.functions.ts
import { pikkuSessionlessFunc } from '@pikku/core'

export const sendWelcomeEmail = pikkuSessionlessFunc<
  { userId: string; email: string; name: string }
>(async (context, data) => {
  const { logger, services } = context
  
  logger.info('Sending welcome email', { userId: data.userId })
  
  await services.emailService.send({
    to: data.email,
    subject: `Welcome ${data.name}!`,
    template: 'welcome',
    data: { name: data.name }
  })
  
  logger.info('Welcome email sent successfully', { userId: data.userId })
})
```

## Function Signature

:::info
Queue functions by default shouldn't return an output unless the queue runtime supports it. This limits where they can be used (for example, SQS doesn't support it but BullMQ and pg-boss do).
:::

Queue functions follow this pattern:

```typescript
pikkuSessionlessFunc<InputType>(
  async (context, data) => {
    // Process the job
    // Return is optional and depends on queue runtime support
  }
)
```

### Input Type

The input type defines the structure of job data:

```typescript
interface EmailJobData {
  to: string
  subject: string
  body: string
  priority?: 'low' | 'normal' | 'high'
}

export const processEmail = pikkuSessionlessFunc<EmailJobData>(
  async (context, data) => {
    // data is fully typed as EmailJobData
    await sendEmail(data.to, data.subject, data.body)
    context.logger.info('Email processed successfully', { to: data.to })
  }
)
```

### Output Type (Optional)

For queue runtimes that support return values (like BullMQ and pg-boss), you can optionally define an output type:

```typescript
interface EmailResult {
  messageId: string
  sentAt: Date
  deliveryStatus: 'sent' | 'queued' | 'failed'
}

// Only use output type if your queue runtime supports it
export const processEmailWithResult = pikkuSessionlessFunc<EmailJobData, EmailResult>(
  async (context, data) => {
    const messageId = await sendEmail(data.to, data.subject, data.body)
    return {
      messageId,
      sentAt: new Date(),
      deliveryStatus: 'sent'
    }
  }
)
```

## Error Handling

Queue functions should handle errors appropriately:

```typescript
export const processPayment = pikkuSessionlessFunc<PaymentData>(
  async (context, data) => {
    const { logger } = context
    
    try {
      const result = await processPaymentInternal(data)
      logger.info('Payment processed successfully', { 
        paymentId: data.paymentId,
        transactionId: result.id 
      })
    } catch (error) {
      logger.error('Payment processing failed', { 
        error: error.message,
        paymentId: data.paymentId 
      })
      
      // Throw to trigger retry logic
      throw new Error(`Payment failed: ${error.message}`)
    }
  }
)
```

## Best Practices

### 1. Use Descriptive Names

Function names should clearly indicate their purpose:

```typescript
// ✅ Good
export const sendPasswordResetEmail = pikkuSessionlessFunc<...>
export const processSubscriptionRenewal = pikkuSessionlessFunc<...>
export const generateMonthlyReport = pikkuSessionlessFunc<...>

// ❌ Avoid
export const worker1 = pikkuSessionlessFunc<...>
export const handleStuff = pikkuSessionlessFunc<...>
```

## Testing Queue Functions

Queue functions are easy to test since they're pure functions:

```typescript
// email-worker.test.ts
import { test } from 'node:test'
import { sendWelcomeEmail } from './email-worker.functions'

test('sendWelcomeEmail processes job correctly', async () => {
  const mockContext = {
    logger: { info: () => {} },
    services: {
      emailService: {
        send: async () => 'msg-123'
      }
    }
  }
  
  const jobData = {
    userId: 'user-1',
    email: 'test@example.com',
    name: 'Test User'
  }
  
  // Should not throw any errors
  await sendWelcomeEmail(mockContext, jobData)
  
  // Verify the email service was called
  assert.strictEqual(mockContext.services.emailService.send.callCount, 1)
})
```