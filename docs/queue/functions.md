---
sidebar_position: 1
title: Queue Functions
description: Learn how to create and structure queue functions
---

# Queue Functions

Queue functions are the core building blocks of Pikku's background processing system. They are regular Pikku functions that process individual jobs with full type safety and access to your application's services.

## Basic Queue Function

Queue functions are created using `pikkuSessionlessFunc` since they don't have access to session data:

```typescript
// email-worker.functions.ts
import { pikkuSessionlessFunc } from '@pikku/core'

export const sendWelcomeEmail = pikkuSessionlessFunc<
  { userId: string; email: string; name: string },
  { messageId: string; sentAt: Date }
>(async (context, data) => {
  const { logger, services } = context
  
  logger.info('Sending welcome email', { userId: data.userId })
  
  const messageId = await services.emailService.send({
    to: data.email,
    subject: `Welcome ${data.name}!`,
    template: 'welcome',
    data: { name: data.name }
  })
  
  return {
    messageId,
    sentAt: new Date()
  }
})
```

## Function Signature

Queue functions follow this pattern:

```typescript
pikkuSessionlessFunc<InputType, OutputType>(
  async (context, data) => {
    // Process the job
    return result
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

export const processEmail = pikkuSessionlessFunc<EmailJobData, { messageId: string }>(
  async (context, data) => {
    // data is fully typed as EmailJobData
    const messageId = await sendEmail(data.to, data.subject, data.body)
    return { messageId }
  }
)
```

### Output Type

The output type defines what the function returns when successful:

```typescript
interface EmailResult {
  messageId: string
  sentAt: Date
  deliveryStatus: 'sent' | 'queued' | 'failed'
}

export const processEmail = pikkuSessionlessFunc<EmailJobData, EmailResult>(
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

## Context Object

Queue functions receive a context object with access to:

```typescript
export const processOrder = pikkuSessionlessFunc<OrderData, OrderResult>(
  async (context, data) => {
    const {
      logger,        // Logger instance
      services,      // Registered services
      config,        // Application configuration
      requestId      // Unique request identifier
    } = context
    
    logger.info('Processing order', { orderId: data.orderId })
    
    // Access services
    const user = await services.userService.getById(data.userId)
    const payment = await services.paymentService.charge(data.amount)
    
    return { success: true, paymentId: payment.id }
  }
)
```

## Error Handling

Queue functions should handle errors appropriately:

```typescript
export const processPayment = pikkuSessionlessFunc<PaymentData, PaymentResult>(
  async (context, data) => {
    const { logger } = context
    
    try {
      const result = await processPaymentInternal(data)
      return { success: true, transactionId: result.id }
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

## Long-Running Tasks

For long-running tasks, use progress logging:

```typescript
export const processLargeFile = pikkuSessionlessFunc<
  { fileUrl: string; userId: string },
  { processedRecords: number; errors: string[] }
>(async (context, data) => {
  const { logger } = context
  const records = await downloadFile(data.fileUrl)
  
  let processedRecords = 0
  const errors: string[] = []
  
  for (const [index, record] of records.entries()) {
    try {
      await processRecord(record)
      processedRecords++
      
      // Log progress every 100 records
      if (index % 100 === 0) {
        logger.info('Processing progress', { 
          processed: processedRecords,
          total: records.length,
          percentage: Math.round((processedRecords / records.length) * 100)
        })
      }
    } catch (error) {
      errors.push(`Record ${index}: ${error.message}`)
      logger.warn('Record processing failed', { index, error: error.message })
    }
  }
  
  return { processedRecords, errors }
})
```

## Best Practices

### 1. Keep Functions Pure

Avoid side effects outside of your function's core responsibility:

```typescript
// ✅ Good - focused responsibility
export const sendNotification = pikkuSessionlessFunc<NotificationData, NotificationResult>(
  async (context, data) => {
    return await context.services.notificationService.send(data)
  }
)

// ❌ Avoid - mixing responsibilities
export const sendNotificationAndLog = pikkuSessionlessFunc<NotificationData, NotificationResult>(
  async (context, data) => {
    const result = await context.services.notificationService.send(data)
    await context.services.analyticsService.track('notification_sent', data) // Side effect
    return result
  }
)
```

### 2. Use Descriptive Names

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

### 3. Validate Input Data

Always validate incoming job data:

```typescript
import { z } from 'zod'

const EmailJobSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1)
})

export const sendEmail = pikkuSessionlessFunc<
  z.infer<typeof EmailJobSchema>,
  { messageId: string }
>(async (context, data) => {
  // Validate input
  const validatedData = EmailJobSchema.parse(data)
  
  // Process with validated data
  const messageId = await context.services.emailService.send(validatedData)
  return { messageId }
})
```

### 4. Handle Timeouts

For functions that might run long, implement timeout handling:

```typescript
export const processWithTimeout = pikkuSessionlessFunc<JobData, JobResult>(
  async (context, data) => {
    const timeout = 5 * 60 * 1000 // 5 minutes
    
    const result = await Promise.race([
      processJob(data),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Job timeout')), timeout)
      )
    ])
    
    return result as JobResult
  }
)
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
  
  const result = await sendWelcomeEmail(mockContext, jobData)
  
  assert.strictEqual(result.messageId, 'msg-123')
  assert.ok(result.sentAt instanceof Date)
})
```