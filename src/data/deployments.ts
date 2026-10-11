// Common deployment configuration used across the website

export type DeploymentTarget = {
  name: string;
  img: { light: string; dark: string };
  code: string;
  repo?: string;
  runtimeFiles?: string[];
};

export type ProtocolDeployments = {
  [key: string]: DeploymentTarget;
};

// Deployment code templates for each runtime
const deploymentCode = {
  express: `import express from 'express'
import { createPikkuExpressMiddleware } from '@pikku/express'

const app = express()
app.use(createPikkuExpressMiddleware())
app.listen(3000)`,

  fastify: `import Fastify from 'fastify'
import { pikkuFastifyPlugin } from '@pikku/fastify'

const fastify = Fastify()
await fastify.register(pikkuFastifyPlugin)
await fastify.listen({ port: 3000 })`,

  nextjs: `// app/api/[...route]/route.ts
import { createPikkuNextHandler } from '@pikku/nextjs'

const handler = createPikkuNextHandler()

export { handler as GET, handler as POST }`,

  lambda: `import { createPikkuLambdaHandler } from '@pikku/aws-lambda'

export const handler = createPikkuLambdaHandler()`,

  cloudflare: `import { createPikkuCloudflareHandler } from '@pikku/cloudflare'

export default createPikkuCloudflareHandler()`,

  ws: `import { WebSocketServer } from 'ws'
import { createPikkuWSHandler } from '@pikku/ws'

const wss = new WebSocketServer({ port: 3000 })
wss.on('connection', createPikkuWSHandler())`,

  uws: `import uWS from 'uWebSockets.js'
import { createPikkuUWSHandler } from '@pikku/uws'

uWS.App()
  .ws('/*', createPikkuUWSHandler())
  .listen(3000, () => {})`,

  bullmq: `import { Queue, Worker } from 'bullmq'
import { createPikkuBullMQWorker } from '@pikku/bullmq'

const worker = createPikkuBullMQWorker('my-queue')`,

  pgboss: `import PgBoss from 'pg-boss'
import { createPikkuPgBossWorker } from '@pikku/pg-boss'

const boss = new PgBoss(connectionString)
await boss.start()
await createPikkuPgBossWorker(boss)`,

  sqs: `import { createPikkuSQSHandler } from '@pikku/aws-sqs'

export const handler = createPikkuSQSHandler()`,

  mcp: `import { createPikkuMCPServer } from '@pikku/mcp'

const server = createPikkuMCPServer()
server.start()`
};

// Deployment targets for each protocol
export const protocolDeployments: { [protocol: string]: ProtocolDeployments } = {
  http: {
    express: {
      name: 'Express',
      img: { light: 'express-light.svg', dark: 'express-dark.svg' },
      code: deploymentCode.express,
      repo: 'template-express-middleware',
      runtimeFiles: ['src/start.ts']
    },
    fastify: {
      name: 'Fastify',
      img: { light: 'fastify-light.svg', dark: 'fastify-dark.svg' },
      code: deploymentCode.fastify,
      repo: 'template-fastify-plugin',
      runtimeFiles: ['src/start.ts']
    },
    nextjs: {
      name: 'Next.js',
      img: { light: 'nextjs-light.png', dark: 'nextjs-dark.svg' },
      code: deploymentCode.nextjs,
      repo: 'template-nextjs',
      runtimeFiles: ['app/api/[...route]/route.ts']
    },
    lambda: {
      name: 'AWS Lambda',
      img: { light: 'aws-light.svg', dark: 'aws-dark.svg' },
      code: deploymentCode.lambda,
      repo: 'template-aws-lambda',
      runtimeFiles: ['src/main.ts', 'serverless.yml']
    },
    cloudflare: {
      name: 'Cloudflare Workers',
      img: { light: 'cloudflare-light.svg', dark: 'cloudflare-dark.svg' },
      code: deploymentCode.cloudflare,
      repo: 'template-cloudflare-workers',
      runtimeFiles: ['src/index.ts', 'wrangler.toml']
    }
  },
  websocket: {
    ws: {
      name: 'WS',
      img: { light: 'websocket-light.svg', dark: 'websocket-dark.svg' },
      code: deploymentCode.ws,
      repo: 'template-ws',
      runtimeFiles: ['src/start.ts']
    },
    uws: {
      name: 'μWebSockets',
      img: { light: 'uws-light.svg', dark: 'uws-dark.svg' },
      code: deploymentCode.uws,
      repo: 'template-uws',
      runtimeFiles: ['src/start.ts']
    },
    lambda: {
      name: 'AWS Lambda',
      img: { light: 'aws-light.svg', dark: 'aws-dark.svg' },
      code: deploymentCode.lambda,
      repo: 'template-aws-lambda-websocket',
      runtimeFiles: ['src/websocket.ts']
    },
    cloudflare: {
      name: 'Cloudflare Workers',
      img: { light: 'cloudflare-light.svg', dark: 'cloudflare-dark.svg' },
      code: deploymentCode.cloudflare,
      repo: 'template-cloudflare-websocket',
      runtimeFiles: ['src/start.ts']
    }
  },
  sse: {
    express: {
      name: 'Express',
      img: { light: 'express-light.svg', dark: 'express-dark.svg' },
      code: deploymentCode.express,
      repo: 'template-express-middleware',
      runtimeFiles: ['src/start.ts']
    },
    fastify: {
      name: 'Fastify',
      img: { light: 'fastify-light.svg', dark: 'fastify-dark.svg' },
      code: deploymentCode.fastify,
      repo: 'template-fastify-plugin',
      runtimeFiles: ['src/start.ts']
    }
  },
  queue: {
    bullmq: {
      name: 'BullMQ',
      img: { light: 'bullmq-light.svg', dark: 'bullmq-dark.svg' },
      code: deploymentCode.bullmq,
      repo: 'template-bullmq',
      runtimeFiles: ['src/start.ts']
    },
    pgboss: {
      name: 'PG Boss',
      img: { light: 'pgboss-light.svg', dark: 'pgboss-dark.svg' },
      code: deploymentCode.pgboss,
      repo: 'template-pg-boss',
      runtimeFiles: ['src/start.ts']
    },
    sqs: {
      name: 'AWS SQS',
      img: { light: 'aws-light.svg', dark: 'aws-dark.svg' },
      code: deploymentCode.sqs,
      repo: 'template-aws-lambda',
      runtimeFiles: ['src/main.ts', 'serverless.yml']
    }
  },
  scheduled: {
    express: {
      name: 'Express',
      img: { light: 'express-light.svg', dark: 'express-dark.svg' },
      code: deploymentCode.express,
      repo: 'template-express-middleware',
      runtimeFiles: ['src/start.ts']
    },
    lambda: {
      name: 'AWS Lambda',
      img: { light: 'aws-light.svg', dark: 'aws-dark.svg' },
      code: deploymentCode.lambda,
      repo: 'template-aws-lambda',
      runtimeFiles: ['src/main.ts', 'serverless.yml']
    },
    cloudflare: {
      name: 'Cloudflare Workers',
      img: { light: 'cloudflare-light.svg', dark: 'cloudflare-dark.svg' },
      code: deploymentCode.cloudflare,
      repo: 'template-cloudflare-workers',
      runtimeFiles: ['src/index.ts', 'wrangler.toml']
    }
  },
  rpc: {
    express: {
      name: 'Express',
      img: { light: 'express-light.svg', dark: 'express-dark.svg' },
      code: deploymentCode.express,
      repo: 'template-express-middleware',
      runtimeFiles: ['src/start.ts']
    },
    fastify: {
      name: 'Fastify',
      img: { light: 'fastify-light.svg', dark: 'fastify-dark.svg' },
      code: deploymentCode.fastify,
      repo: 'template-fastify-plugin',
      runtimeFiles: ['src/start.ts']
    },
    lambda: {
      name: 'AWS Lambda',
      img: { light: 'aws-light.svg', dark: 'aws-dark.svg' },
      code: deploymentCode.lambda,
      repo: 'template-aws-lambda',
      runtimeFiles: ['src/main.ts', 'serverless.yml']
    },
    cloudflare: {
      name: 'Cloudflare Workers',
      img: { light: 'cloudflare-light.svg', dark: 'cloudflare-dark.svg' },
      code: deploymentCode.cloudflare,
      repo: 'template-cloudflare',
      runtimeFiles: ['src/index.ts', 'wrangler.toml']
    }
  },
  mcp: {
    mcp: {
      name: 'MCP Server',
      img: { light: 'mcp-light.svg', dark: 'mcp-dark.svg' },
      code: deploymentCode.mcp,
      repo: 'template-mcp-server',
      runtimeFiles: ['src/start.ts']
    }
  }
};

// Map protocol icons to deployment keys
export const protocolToDeploymentKey: { [icon: string]: string } = {
  'http': 'http',
  'websocket': 'websocket',
  'sse': 'sse',
  'queue': 'queue',
  'cron': 'scheduled',
  'rpc': 'rpc',
  'mcp': 'mcp',
  'cli': 'cli' // CLI doesn't have deployments in the traditional sense
};
