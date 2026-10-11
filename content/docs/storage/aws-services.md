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

Import `S3Content` from `@pikku/aws-services` and construct it with three arguments: a config object (`bucketName`, `region`, and an optional `endpoint` for LocalStack or custom endpoints), your `logger`, and a CloudFront config with `keyPairId` and `privateKey` (here read from `CLOUDFRONT_KEY_PAIR_ID` and `CLOUDFRONT_PRIVATE_KEY`).

### Features

- **Logical buckets** — `config.bucketName` is the real S3 bucket. The `bucket`
  field every `ContentService` call takes is a logical bucket, stored as a path
  prefix inside it (`<bucket>/<key>`).
- **Signed uploads** — `getUploadURL()` generates presigned S3 PUT URLs (1 hour expiry)
- **Signed downloads** — `signContentKey()` and `signURL()` use CloudFront signing
- **File operations** — `readFile()`, `writeFile()`, `copyFile()`, `deleteFile()`
- **Streaming** — reads and writes use Node.js streams

### Usage

Every method takes a single options object, and `bucket` is a logical bucket (a path prefix inside `config.bucketName`), not a second S3 bucket.

| Method | Options | Returns |
| --- | --- | --- |
| `getUploadURL` | `bucket`, `fileKey`, `contentType` | `{ uploadUrl, assetKey }` for a client-side upload |
| `signContentKey` | `bucket`, `contentKey`, `dateLessThan` (a `Date`, e.g. one hour from now) | a signed download URL |
| `readFile` | `bucket`, `key` | the file as a stream |

See [ContentService API](/docs/api/content-service) for the full interface.

## AWSSecrets

Read-only access to AWS Secrets Manager:

Import `AWSSecrets` from `@pikku/aws-services` and construct it with `{ awsRegion: 'us-east-1' }`.

### Usage

`getSecret` returns a wrapped `SecretValue`, so call `.reveal()` to get the plain string: `(await secretService.getSecret('my-api-key')).reveal()`. For a JSON secret, pass the shape as the type argument (for example `getSecret<{ host: string; password: string }>('database-config')`) and reveal it the same way. `hasSecret('my-api-key')` returns whether the secret exists.

:::note
`AWSSecrets` is read-only. `setSecretJSON()` and `deleteSecret()` throw errors — use the AWS Console or CLI to manage secrets.
:::

See [SecretService API](/docs/api/secret-service) for the full interface.

## SQSQueueService

Fire-and-forget job publishing to SQS queues:

Import `SQSQueueService` from `@pikku/aws-services` and construct it with `region`, `queueUrlPrefix` (for example `https://sqs.us-east-1.amazonaws.com/123456789/`) and an optional `endpoint` for LocalStack.

### Usage

Call `queueService.add(queueName, data)` to add a job; it returns the message id. Pass `{ delay }` (in milliseconds) as a third argument to delay it. SQS caps the delay at 900 seconds (15 minutes), so `{ delay: 300_000 }` is five minutes.

### Limitations

SQS is a fire-and-forget service — `supportsResults` is `false`:

- No `getJob()` support (throws an error)
- No job status tracking after submission
- Delay limited to 900 seconds (SQS constraint)
- Standard queues only (no FIFO)

For job result tracking, use [BullMQ](/docs/runtimes/bullmq) or [PG Boss](/docs/runtimes/pg-boss) instead.

### Processing SQS Messages

On the worker side, use `runSQSQueueWorker` from `@pikku/lambda` to process messages:

The SQS handler is typed as `SQSHandler`. It awaits your `coldStart()` to get the `logger`, then returns `runSQSQueueWorker(logger, event)` from `@pikku/lambda`.

See [AWS Lambda — SQS Queue Worker](/docs/runtimes/aws-lambda#sqs-queue-worker) for the full setup.

## Setup Example

Register AWS services in your singleton services:

Pass all three to `createSingletonServices` as overrides: `content: new S3Content(s3Config, logger, cloudFrontConfig)`, `secrets: new AWSSecrets({ awsRegion: 'us-east-1' })` and `queueService: new SQSQueueService(sqsConfig)`.
