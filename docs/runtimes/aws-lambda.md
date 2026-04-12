---
title: AWS Lambda
description: Deploy Pikku to AWS Lambda
hide_title: true
image: /img/logos/aws-light.svg
ai: true
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

AWS Lambda is a serverless compute platform by Amazon Web Services. Pikku supports Lambda through two paths:

1. **`pikku deploy --provider aws`** — automated deployment via the Serverless Framework (recommended)
2. **`@pikku/lambda`** — handler adapters for manual Lambda integration with your own IaC

## Recommended: Pikku Deploy

The deploy pipeline analyzes your project, generates Lambda entry points and `serverless.yml`, and provisions everything automatically.

### Setup

Install the deploy adapter:

```bash
npm install @pikku/deploy-serverless
```

Add to your `pikku.config.json`:

```json
{
  "deploy": {
    "providers": {
      "aws": "@pikku/deploy-serverless"
    },
    "defaultProvider": "aws"
  }
}
```

### Deploy

```bash
# Preview what will be created
npx pikku deploy plan --provider aws

# Deploy
npx pikku deploy apply --provider aws

# Check current state
npx pikku deploy info --provider aws
```

The pipeline generates one Lambda per deployment unit with:
- API Gateway HTTP routes
- SQS queues and consumers
- EventBridge rules for scheduled tasks
- WebSocket API (if channels are used)

See the [Deploy guide](/docs/deploy) for full documentation.

:::note Beta
The Serverless Framework deploy provider is in beta. The core flow works, but some advanced features are still being finalized.
:::

## Manual Setup with `@pikku/lambda`

If you're using CDK, Terraform, SST, or any other IaC tool, you can use the `@pikku/lambda` package directly. It provides handler adapters that convert Lambda events into Pikku requests.

### Installation

```bash
npm install @pikku/lambda
```

### Sub-path Exports

| Import | Description |
|--------|-------------|
| `@pikku/lambda` | All exports |
| `@pikku/lambda/http` | HTTP handler (API Gateway v1 and v2) |
| `@pikku/lambda/websocket` | WebSocket handlers (connect, disconnect, message) |
| `@pikku/lambda/queue` | SQS queue worker |
| `@pikku/lambda/scheduled` | EventBridge scheduled handler |

### Cold Start Pattern

Cache singleton services at the module level so they persist across warm invocations:

```typescript
import './.pikku/pikku-bootstrap.gen.js'

let cachedServices: SingletonServices | undefined

export const coldStart = async () => {
  if (!cachedServices) {
    const config = await createConfig()
    cachedServices = await createSingletonServices(config)
  }
  return cachedServices
}
```

### HTTP Handler

```typescript
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { runFetchV2 } from '@pikku/lambda/http'

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  await coldStart()
  return runFetchV2(event)
}
```

### SQS Queue Worker

Process SQS messages as Pikku queue jobs. Returns an `SQSBatchResponse` with batch item failures so failed messages are automatically retried.

```typescript
import type { SQSHandler } from 'aws-lambda'
import { runSQSQueueWorker } from '@pikku/lambda/queue'

export const handler: SQSHandler = async (event) => {
  await coldStart()
  return runSQSQueueWorker({ event })
}
```

### Scheduled Tasks

```typescript
import type { ScheduledEvent } from 'aws-lambda'
import { runLambdaScheduled } from '@pikku/lambda/scheduled'

export const handler = async (event: ScheduledEvent) => {
  await coldStart()
  await runLambdaScheduled(event)
}
```

### WebSocket (API Gateway)

WebSocket connections require three separate Lambda handlers and a persistent store for connection state:

```typescript
import {
  connectWebsocket,
  disconnectWebsocket,
  processWebsocketMessage,
} from '@pikku/lambda/websocket'

export const wsConnect = async (event) => {
  await coldStart()
  return connectWebsocket(event, singletonServices)
}

export const wsDisconnect = async (event) => {
  await coldStart()
  return disconnectWebsocket(event, singletonServices)
}

export const wsMessage = async (event) => {
  await coldStart()
  return processWebsocketMessage(event, singletonServices, createWireServices)
}
```

WebSocket support requires:
- **API Gateway WebSocket API** — a separate API Gateway configured for WebSocket
- **`ChannelStore`** — persists connection state across Lambda invocations (e.g., `PgChannelStore`)
- **`LambdaEventHubService`** — sends messages back to connected clients via API Gateway Management API

### Other Exports

| Export | Description |
|--------|-------------|
| `SQSQueueService` | Queue service that dispatches jobs via SQS |
| `LambdaDeploymentService` | Deployment service for Lambda environments |

### Multi-Handler Pattern

A single Lambda file can export multiple handlers for different event sources:

```typescript
// main.ts
export { httpHandler } from './http-handler.js'
export { scheduledHandler } from './scheduler-handler.js'
export { sqsHandler } from './sqs-handler.js'
```
