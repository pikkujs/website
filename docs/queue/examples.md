---
sidebar_position: 5
title: Examples
description: Real-world queue usage patterns and examples
---

# Queue Examples

This page shows practical examples of using Pikku queues for common use cases. Each example includes the function definition, worker registration, and client usage.

## Email Processing

### Function Definition

```typescript
// email-worker.functions.ts
import { pikkuSessionlessFunc } from '@pikku/core'

interface EmailJob {
  to: string
  subject: string
  body: string
  template?: string
  data?: Record<string, any>
}

interface EmailResult {
  messageId: string
  sentAt: Date
  provider: string
}

export const sendEmail = pikkuSessionlessFunc<EmailJob, EmailResult>(
  async (context, jobData) => {
    const { logger, services } = context
    
    logger.info('Sending email', { to: jobData.to, subject: jobData.subject })
    
    try {
      const result = await services.emailService.send({
        to: jobData.to,
        subject: jobData.subject,
        body: jobData.body,
        template: jobData.template,
        data: jobData.data
      })
      
      logger.info('Email sent successfully', { messageId: result.messageId })
      
      return {
        messageId: result.messageId,
        sentAt: new Date(),
        provider: 'sendgrid'
      }
    } catch (error) {
      logger.error('Email sending failed', { error: error.message })
      throw error
    }
  }
)
```

### Worker Registration

```typescript
// email-worker.wiring.ts
import { wireQueueWorker } from '../.pikku/pikku-types.gen.js'
import { sendEmail } from './email-worker.functions.js'

wireQueueWorker({
  queueName: 'email-queue',
  func: sendEmail,
  config: {
    concurrency: 5,
    retries: 3,
    retryDelay: 10000,
    timeout: 30000
  }
})
```

### Client Usage

```typescript
// In your application
import { PikkuQueue } from './.pikku/pikku-queue.gen'

const queueClient = new PikkuQueue(queueService)

// Send welcome email
async function sendWelcomeEmail(userEmail: string, userName: string) {
  const jobId = await queueClient.add('email-queue', {
    to: userEmail,
    subject: 'Welcome to our platform!',
    body: `Hello ${userName}, welcome to our platform!`,
    template: 'welcome',
    data: { name: userName }
  })
  
  return jobId
}

// Send password reset email
async function sendPasswordReset(userEmail: string, resetToken: string) {
  return await queueClient.add('email-queue', {
    to: userEmail,
    subject: 'Password Reset Request',
    body: `Click here to reset your password: ${resetToken}`,
    template: 'password-reset',
    data: { resetToken }
  }, {
    priority: 'high',  // High priority for security-related emails
    retries: 5         // More retries for important emails
  })
}
```

## Image Processing

### Function Definition

```typescript
// image-worker.functions.ts
import { pikkuSessionlessFunc } from '@pikku/core'

interface ImageJob {
  imageUrl: string
  userId: string
  operations: Array<{
    type: 'resize' | 'crop' | 'filter'
    params: Record<string, any>
  }>
}

interface ImageResult {
  processedUrl: string
  thumbnailUrl: string
  processedAt: Date
  fileSize: number
}

export const processImage = pikkuSessionlessFunc<ImageJob, ImageResult>(
  async (context, jobData) => {
    const { logger, services } = context
    
    logger.info('Processing image', { 
      imageUrl: jobData.imageUrl, 
      userId: jobData.userId 
    })
    
    // Download image
    const imageBuffer = await services.imageService.download(jobData.imageUrl)
    
    // Apply operations
    let processedImage = imageBuffer
    for (const operation of jobData.operations) {
      processedImage = await services.imageService.apply(
        processedImage, 
        operation.type, 
        operation.params
      )
    }
    
    // Generate thumbnail
    const thumbnail = await services.imageService.resize(processedImage, {
      width: 200,
      height: 200
    })
    
    // Upload processed images
    const processedUrl = await services.storageService.upload(
      processedImage,
      `processed/${jobData.userId}/${Date.now()}.jpg`
    )
    
    const thumbnailUrl = await services.storageService.upload(
      thumbnail,
      `thumbnails/${jobData.userId}/${Date.now()}.jpg`
    )
    
    return {
      processedUrl,
      thumbnailUrl,
      processedAt: new Date(),
      fileSize: processedImage.length
    }
  }
)
```

### Worker Registration

```typescript
// image-worker.wiring.ts
import { wireQueueWorker } from '../.pikku/pikku-types.gen.js'
import { processImage } from './image-worker.functions.js'

wireQueueWorker({
  queueName: 'image-processing',
  func: processImage,
  config: {
    concurrency: 2,     // CPU-intensive, limit concurrency
    retries: 2,         // Fewer retries for expensive operations
    timeout: 300000,    // 5 minute timeout for large images
    pollingInterval: 2000
  }
})
```

### Client Usage

```typescript
// User uploads image
async function processUserImage(userId: string, imageUrl: string) {
  const jobId = await queueClient.add('image-processing', {
    imageUrl,
    userId,
    operations: [
      { type: 'resize', params: { width: 1200, height: 800 } },
      { type: 'filter', params: { type: 'sharpen' } }
    ]
  })
  
  // Wait for processing to complete
  try {
    const result = await queueClient.waitForCompletion(
      'image-processing', 
      jobId,
      { timeout: 300000 }
    )
    
    return {
      originalUrl: imageUrl,
      processedUrl: result.processedUrl,
      thumbnailUrl: result.thumbnailUrl
    }
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`)
  }
}
```

## Data Export

### Function Definition

```typescript
// export-worker.functions.ts
import { pikkuSessionlessFunc } from '@pikku/core'

interface ExportJob {
  userId: string
  dataType: 'users' | 'orders' | 'analytics'
  format: 'csv' | 'json' | 'xlsx'
  filters?: Record<string, any>
  dateRange?: {
    start: Date
    end: Date
  }
}

interface ExportResult {
  fileUrl: string
  fileName: string
  recordCount: number
  fileSize: number
  exportedAt: Date
}

export const exportData = pikkuSessionlessFunc<ExportJob, ExportResult>(
  async (context, jobData) => {
    const { logger, services } = context
    
    logger.info('Starting data export', { 
      dataType: jobData.dataType,
      format: jobData.format,
      userId: jobData.userId
    })
    
    // Fetch data based on type and filters
    const data = await services.dataService.fetch({
      type: jobData.dataType,
      filters: jobData.filters,
      dateRange: jobData.dateRange
    })
    
    logger.info('Data fetched', { recordCount: data.length })
    
    // Generate export file
    const exportFile = await services.exportService.generate({
      data,
      format: jobData.format,
      fileName: `${jobData.dataType}_export_${Date.now()}.${jobData.format}`
    })
    
    // Upload to storage
    const fileUrl = await services.storageService.upload(
      exportFile.buffer,
      `exports/${jobData.userId}/${exportFile.fileName}`
    )
    
    // Send notification email
    await services.notificationService.send({
      userId: jobData.userId,
      type: 'export_complete',
      data: { fileUrl, fileName: exportFile.fileName }
    })
    
    return {
      fileUrl,
      fileName: exportFile.fileName,
      recordCount: data.length,
      fileSize: exportFile.buffer.length,
      exportedAt: new Date()
    }
  }
)
```

### Worker Registration

```typescript
// export-worker.wiring.ts
import { wireQueueWorker } from '../.pikku/pikku-types.gen.js'
import { exportData } from './export-worker.functions.js'

wireQueueWorker({
  queueName: 'data-export',
  func: exportData,
  config: {
    concurrency: 1,      // Sequential processing for large exports
    retries: 2,          // Limited retries for expensive operations
    timeout: 1800000,    // 30 minute timeout
    pollingInterval: 10000
  }
})
```

### Client Usage

```typescript
// Initiate data export
async function initiateDataExport(
  userId: string,
  dataType: 'users' | 'orders' | 'analytics',
  format: 'csv' | 'json' | 'xlsx'
) {
  const jobId = await queueClient.add('data-export', {
    userId,
    dataType,
    format,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    }
  })
  
  return jobId
}

// Check export status
async function checkExportStatus(jobId: string) {
  const job = await queueClient.getJob('data-export', jobId)
  
  return {
    status: job.status,
    progress: job.progress,
    result: job.result,
    error: job.error
  }
}
```

## Notification System

### Function Definition

```typescript
// notification-worker.functions.ts
import { pikkuSessionlessFunc } from '@pikku/core'

interface NotificationJob {
  userId: string
  type: 'email' | 'sms' | 'push' | 'webhook'
  template: string
  data: Record<string, any>
  priority: 'low' | 'normal' | 'high' | 'urgent'
  channels?: string[]
}

interface NotificationResult {
  deliveryId: string
  channel: string
  status: 'sent' | 'failed' | 'pending'
  sentAt: Date
  metadata?: Record<string, any>
}

export const sendNotification = pikkuSessionlessFunc<
  NotificationJob,
  NotificationResult[]
>(
  async (context, jobData) => {
    const { logger, services } = context
    
    logger.info('Processing notification', {
      userId: jobData.userId,
      type: jobData.type,
      priority: jobData.priority
    })
    
    // Get user notification preferences
    const userPrefs = await services.userService.getNotificationPreferences(
      jobData.userId
    )
    
    // Determine channels to use
    const channels = jobData.channels || [jobData.type]
    const enabledChannels = channels.filter(channel => 
      userPrefs[channel]?.enabled
    )
    
    if (enabledChannels.length === 0) {
      logger.info('No enabled channels for user', { userId: jobData.userId })
      return []
    }
    
    // Send notifications across all enabled channels
    const results: NotificationResult[] = []
    
    for (const channel of enabledChannels) {
      try {
        const result = await services.notificationService.send({
          userId: jobData.userId,
          channel,
          template: jobData.template,
          data: jobData.data,
          priority: jobData.priority
        })
        
        results.push({
          deliveryId: result.id,
          channel,
          status: 'sent',
          sentAt: new Date(),
          metadata: result.metadata
        })
      } catch (error) {
        logger.error('Notification sending failed', {
          channel,
          error: error.message
        })
        
        results.push({
          deliveryId: '',
          channel,
          status: 'failed',
          sentAt: new Date(),
          metadata: { error: error.message }
        })
      }
    }
    
    return results
  }
)
```

### Worker Registration

```typescript
// notification-worker.wiring.ts
import { wireQueueWorker } from '../.pikku/pikku-types.gen.js'
import { sendNotification } from './notification-worker.functions.js'

// High priority notifications
wireQueueWorker({
  queueName: 'notifications-urgent',
  func: sendNotification,
  config: {
    concurrency: 10,
    retries: 5,
    timeout: 15000,
    pollingInterval: 1000
  }
})

// Normal priority notifications
wireQueueWorker({
  queueName: 'notifications-normal',
  func: sendNotification,
  config: {
    concurrency: 5,
    retries: 3,
    timeout: 30000,
    pollingInterval: 5000
  }
})

// Low priority notifications
wireQueueWorker({
  queueName: 'notifications-low',
  func: sendNotification,
  config: {
    concurrency: 2,
    retries: 2,
    timeout: 60000,
    pollingInterval: 30000
  }
})
```

### Client Usage

```typescript
// Send notification based on priority
async function sendUserNotification(
  userId: string,
  type: 'email' | 'sms' | 'push',
  template: string,
  data: Record<string, any>,
  priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
) {
  const queueName = `notifications-${priority === 'urgent' ? 'urgent' : priority}`
  
  const jobId = await queueClient.add(queueName, {
    userId,
    type,
    template,
    data,
    priority
  })
  
  return jobId
}

// Batch notifications
async function sendBatchNotifications(notifications: NotificationJob[]) {
  const groupedByPriority = notifications.reduce((groups, notification) => {
    const priority = notification.priority
    if (!groups[priority]) groups[priority] = []
    groups[priority].push(notification)
    return groups
  }, {} as Record<string, NotificationJob[]>)
  
  const jobIds: string[] = []
  
  for (const [priority, batch] of Object.entries(groupedByPriority)) {
    const queueName = `notifications-${priority === 'urgent' ? 'urgent' : priority}`
    const batchJobIds = await queueClient.addBatch(queueName, batch)
    jobIds.push(...batchJobIds)
  }
  
  return jobIds
}
```

## Background Cleanup

### Function Definition

```typescript
// cleanup-worker.functions.ts
import { pikkuSessionlessFunc } from '@pikku/core'

interface CleanupJob {
  type: 'files' | 'logs' | 'cache' | 'database'
  olderThan: number // milliseconds
  dryRun?: boolean
}

interface CleanupResult {
  itemsRemoved: number
  spaceFreed: number // bytes
  errors: string[]
  duration: number // milliseconds
}

export const runCleanup = pikkuSessionlessFunc<CleanupJob, CleanupResult>(
  async (context, jobData) => {
    const { logger, services } = context
    const startTime = Date.now()
    
    logger.info('Starting cleanup', {
      type: jobData.type,
      olderThan: jobData.olderThan,
      dryRun: jobData.dryRun
    })
    
    let itemsRemoved = 0
    let spaceFreed = 0
    const errors: string[] = []
    
    try {
      switch (jobData.type) {
        case 'files':
          const fileResult = await services.storageService.cleanup({
            olderThan: jobData.olderThan,
            dryRun: jobData.dryRun
          })
          itemsRemoved = fileResult.filesRemoved
          spaceFreed = fileResult.spaceFreed
          break
          
        case 'logs':
          const logResult = await services.logService.cleanup({
            olderThan: jobData.olderThan,
            dryRun: jobData.dryRun
          })
          itemsRemoved = logResult.logsRemoved
          spaceFreed = logResult.spaceFreed
          break
          
        case 'cache':
          const cacheResult = await services.cacheService.cleanup({
            olderThan: jobData.olderThan,
            dryRun: jobData.dryRun
          })
          itemsRemoved = cacheResult.itemsRemoved
          spaceFreed = cacheResult.spaceFreed
          break
          
        case 'database':
          const dbResult = await services.databaseService.cleanup({
            olderThan: jobData.olderThan,
            dryRun: jobData.dryRun
          })
          itemsRemoved = dbResult.recordsRemoved
          spaceFreed = dbResult.spaceFreed
          break
      }
    } catch (error) {
      errors.push(error.message)
      logger.error('Cleanup failed', { error: error.message })
    }
    
    const duration = Date.now() - startTime
    
    logger.info('Cleanup completed', {
      itemsRemoved,
      spaceFreed,
      duration,
      errors: errors.length
    })
    
    return {
      itemsRemoved,
      spaceFreed,
      errors,
      duration
    }
  }
)
```

### Worker Registration

```typescript
// cleanup-worker.wiring.ts
import { wireQueueWorker } from '../.pikku/pikku-types.gen.js'
import { runCleanup } from './cleanup-worker.functions.js'

wireQueueWorker({
  queueName: 'cleanup-tasks',
  func: runCleanup,
  config: {
    concurrency: 1,      // Sequential cleanup to avoid conflicts
    retries: 1,          // Limited retries for cleanup tasks
    timeout: 3600000,    // 1 hour timeout
    pollingInterval: 60000
  }
})
```

### Client Usage

```typescript
// Schedule daily cleanup
async function scheduleCleanup() {
  const cleanupJobs = [
    {
      type: 'files' as const,
      olderThan: 30 * 24 * 60 * 60 * 1000, // 30 days
      dryRun: false
    },
    {
      type: 'logs' as const,
      olderThan: 7 * 24 * 60 * 60 * 1000,  // 7 days
      dryRun: false
    },
    {
      type: 'cache' as const,
      olderThan: 24 * 60 * 60 * 1000,      // 24 hours
      dryRun: false
    }
  ]
  
  const jobIds = await queueClient.addBatch('cleanup-tasks', cleanupJobs)
  return jobIds
}

// Run cleanup with monitoring
async function runCleanupWithMonitoring(type: string) {
  const jobId = await queueClient.add('cleanup-tasks', {
    type,
    olderThan: 24 * 60 * 60 * 1000,
    dryRun: false
  })
  
  // Monitor progress
  const job = await queueClient.getJob('cleanup-tasks', jobId)
  
  const result = await job.waitForCompletion?.({
    timeout: 3600000, // 1 hour
    pollInterval: 10000 // Check every 10 seconds
  })
  
  return result
}
```

## Best Practices from Examples

### 1. Error Handling

Always handle errors gracefully and provide meaningful error messages:

```typescript
try {
  const result = await processData(data)
  return result
} catch (error) {
  logger.error('Processing failed', { error: error.message, data })
  throw new Error(`Processing failed: ${error.message}`)
}
```

### 2. Progress Reporting

For long-running tasks, report progress:

```typescript
for (let i = 0; i < items.length; i++) {
  await processItem(items[i])
  
  if (i % 100 === 0) {
    logger.info('Progress update', {
      processed: i,
      total: items.length,
      percentage: Math.round((i / items.length) * 100)
    })
  }
}
```

### 3. Resource Management

Clean up resources properly:

```typescript
let connection
try {
  connection = await createConnection()
  const result = await processWithConnection(connection, data)
  return result
} finally {
  if (connection) {
    await connection.close()
  }
}
```

### 4. Timeout Handling

Set appropriate timeouts based on job complexity:

```typescript
const timeout = jobData.complexity === 'high' ? 1800000 : 300000
await queueClient.add('processing-queue', jobData, { timeout })
```

These examples show how to build robust, scalable background processing systems with Pikku queues. Each pattern can be adapted to your specific use case while maintaining type safety and reliability.