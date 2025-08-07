---
title: AWS Lambda
description: Using AWS Lambda with Pikku
hide_title: true
image: /img/logos/aws-light.svg
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

AWS Lambda is a serverless compute platform by Amazon Web Services.

Pikku integrates with AWS Lambda using the Node.js 18+ runtime via the `@pikku/lambda` package. It supports WebSockets, HTTP, and scheduled tasks.

There are multiple ways to deploy a Lambda function. If you prefer not to sign up for any services, [OpenTofu / Terraform](https://opentofu.org/) and [AWS CDK](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-cdk.html) are good options.

Alternatively, [Serverless Framework](https://www.serverless.com/) can be used, though it requires an account.

This guide assumes you are using Serverless Framework due to its robust offline development experience, but the core principles apply to any deployment method.

## Getting Started

### 1. Setup

To create a new Pikku project:

```bash npm2yarn
npm create pikku@latest
```

### 2. Run Locally

Start a local development server:

```bash npm2yarn
npm run start
```

This compiles the `hello-world` example and runs a local server:

```bash
Server ready: http://localhost:3000 🚀
```

To verify, run:

```bash
curl -v localhost:3000/production/hello-world
```

## Deploying with Serverless

Before deployment, update the `serverless.yml` file to specify your organization:

```yaml
org: your-org
```

Then deploy:

```bash npm2yarn
npm run deploy
```

Since Serverless Framework now requires authentication, you will be prompted to log in. Once authenticated, the deployment process will set up your stack and upload the code.

If successful, the output should resemble:

```bash
Deploying "my-app" to stage "production" (us-east-1)

✔ Service deployed to stack my-app-production (54s)

endpoint: ANY - https://<domain-name>.execute-api.us-east-1.amazonaws.com/production/{proxy+}
functions:
  http: my-app-production-http (12 MB)
  cron: my-app-production-cron (12 MB)
```

To verify the deployment, use the url prefix above, replace `{proxy+}` with `hello-world` and run via curl:

```bash
curl https://<domain name>.execute-api.us-east-1.amazonaws.com/production/hello-world
```

## How Pikku Works with AWS Lambda

Pikku requires two key files for AWS Lambda integration:

### 1. Cold Start

```typescript reference title="cold-start.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/aws-lambda/src/cold-start.ts
```

This initializes singleton services and configurations the first time a function is invoked.

### 2. Entry Point

```typescript reference title="main.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/templates/aws-lambda/src/main.ts
```

This file acts as the Lambda entry point and routes requests to the Pikku runtime.

## HTTP API Options

Pikku provides three ways to handle HTTP requests:

### 1. `corsHandler`

The `corsHandler` allows you to specify permitted origins.

### 2. `corslessHTTP`

The `corslessHTTP` method disables CORS and directly forwards requests to Pikku.

### 3. `anywhereHTTP`

The `anywhereHTTP` method dynamically sets the request origin as the CORS origin.

:::danger
Use `anywhereHTTP` with caution, as it permits requests from any domain. Only enable it if you understand the security implications.
:::

## Scheduled Tasks

To define a scheduled task:

```typescript
import { ScheduledHandler } from 'aws-lambda'

export const myScheduledTask: ScheduledHandler = async () => {
  const singletonServices = await coldStart()
  await runScheduledTask({
    name: 'myScheduledTask',
    singletonServices,
  })
}
```

Since this function is only triggered by AWS Lambda and does not rely on additional AWS-specific logic, no further configuration is needed.
