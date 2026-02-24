---
title: AWS Services
description: S3, Secrets Manager, and SQS implementations
sidebar_position: 4
ai: true
---

# AWS Services

The `@pikku/aws-services` package provides AWS implementations of Pikku's core service interfaces.

```bash npm2yarn
npm install @pikku/aws-services
```

## Services

| Class | Implements | AWS Service |
|-------|-----------|-------------|
| `S3Content` | `ContentService` | S3 + CloudFront |
| `AWSSecrets` | `SecretService` | Secrets Manager |
| `SQSQueueService` | `QueueService` | SQS |

## S3Content

File storage using S3 with CloudFront signed URLs:

```typescript
import { S3Content } from '@pikku/aws-services'

const contentService = new S3Content(
  {
    bucketName: 'my-bucket',
    region: 'us-east-1',
    endpoint: undefined, // Optional: for LocalStack or custom endpoints
  },
  logger,
  {
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
    privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
  }
)
```

### Features

- **Signed uploads** — `getUploadURL()` generates presigned S3 PUT URLs (1 hour expiry)
- **Signed downloads** — `signContentKey()` and `signURL()` use CloudFront signing
- **File operations** — `readFile()`, `writeFile()`, `copyFile()`, `deleteFile()`
- **Streaming** — reads and writes use Node.js streams

### Usage

```typescript
// Generate upload URL for client-side upload
const { uploadUrl, assetKey } = await contentService.getUploadURL(
  'uploads/photo.jpg',
  'image/jpeg'
)

// Sign a download URL (expires in 1 hour)
const signedUrl = await contentService.signContentKey(
  'uploads/photo.jpg',
  new Date(Date.now() + 3600_000)
)

// Read file as stream
const stream = await contentService.readFile('uploads/photo.jpg')
```

See [ContentService API](/docs/api/content-service) for the full interface.

## AWSSecrets

Read-only access to AWS Secrets Manager:

```typescript
import { AWSSecrets } from '@pikku/aws-services'

const secretService = new AWSSecrets({
  awsRegion: 'us-east-1',
})
```

### Usage

```typescript
// Get a plain string secret
const apiKey = await secretService.getSecret('my-api-key')

// Get and parse a JSON secret
const dbConfig = await secretService.getSecretJSON<{
  host: string
  password: string
}>('database-config')

// Check if a secret exists
const exists = await secretService.hasSecret('my-api-key')
```

:::note
`AWSSecrets` is read-only. `setSecretJSON()` and `deleteSecret()` throw errors — use the AWS Console or CLI to manage secrets.
:::

See [SecretService API](/docs/api/secret-service) for the full interface.

## SQSQueueService

Fire-and-forget job publishing to SQS queues:

```typescript
import { SQSQueueService } from '@pikku/aws-services'

const queueService = new SQSQueueService({
  region: 'us-east-1',
  queueUrlPrefix: 'https://sqs.us-east-1.amazonaws.com/123456789/',
  endpoint: undefined, // Optional: for LocalStack
})
```

### Usage

```typescript
// Add a job to a queue
const messageId = await queueService.add('my-queue', {
  userId: 'user-123',
  action: 'send-email',
})

// Add with delay (max 900 seconds / 15 minutes per SQS limits)
const delayedId = await queueService.add(
  'my-queue',
  { action: 'reminder' },
  { delay: 300_000 } // 5 minutes in milliseconds
)
```

### Limitations

SQS is a fire-and-forget service — `supportsResults` is `false`:

- No `getJob()` support (throws an error)
- No job status tracking after submission
- Delay limited to 900 seconds (SQS constraint)
- Standard queues only (no FIFO)

For job result tracking, use [BullMQ](/docs/runtimes/bullmq) or [PG Boss](/docs/runtimes/pg-boss) instead.

### Processing SQS Messages

On the worker side, use `runSQSQueueWorker` from `@pikku/lambda` to process messages:

```typescript
import { runSQSQueueWorker } from '@pikku/lambda'

export const sqsHandler: SQSHandler = async (event) => {
  const singletonServices = await coldStart()
  return await runSQSQueueWorker({
    singletonServices,
    createWireServices,
    event,
  })
}
```

See [AWS Lambda — SQS Queue Worker](/docs/runtimes/aws-lambda#sqs-queue-worker) for the full setup.

## Setup Example

Register AWS services in your singleton services:

```typescript
import { S3Content, AWSSecrets, SQSQueueService } from '@pikku/aws-services'

const singletonServices = await createSingletonServices(config, {
  content: new S3Content(s3Config, logger, cloudFrontConfig),
  secrets: new AWSSecrets({ awsRegion: 'us-east-1' }),
  queueService: new SQSQueueService(sqsConfig),
})
```
