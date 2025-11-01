import React, { useState } from 'react';
import Heading from '@theme/Heading';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { WiringIcon } from './WiringIcons';
import { Stackblitz } from './Stackblitz';

// Simple tab configuration
const FUNCTION_TABS = {
  http: {
    name: 'HTTP',
    icon: 'http',
    description: 'REST API endpoints',
    defaultDeployment: 'express',
    deployments: {
      express: { name: 'Express', repo: 'template-express-middleware', runtimeFiles: ['src/start.ts'] },
      fastify: { name: 'Fastify', repo: 'template-fastify-plugin', runtimeFiles: ['src/start.ts'] },
      nextjs: { name: 'Next.js', repo: 'template-nextjs', runtimeFiles: ['app/api/[...route]/route.ts'] },
      lambda: { name: 'AWS Lambda', repo: 'template-aws-lambda', runtimeFiles: ['src/main.ts', 'serverless.yml'] },
      cloudflare: { name: 'Cloudflare', repo: 'template-cloudflare-workers', runtimeFiles: ['src/index.ts', 'wrangler.toml'] }
    },
    files: ['src/http.functions.ts', 'src/http.wiring.ts', 'client/http-fetch.ts']
  },
  websocket: {
    name: 'WebSocket',
    icon: 'websocket', 
    description: 'Real-time communication',
    defaultDeployment: 'ws',
    deployments: {
      ws: { name: 'WS', repo: 'template-ws', runtimeFiles: ['src/start.ts'] },
      uws: { name: 'μWS', repo: 'template-uws', runtimeFiles: ['src/start.ts'] },
      lambda: { name: 'AWS Lambda', repo: 'template-aws-lambda-websocket', runtimeFiles: ['src/websockt.ts'] },
      cloudflare: { name: 'Cloudflare', repo: 'template-cloudflare-websocket', runtimeFiles: ['src/start.ts'] }
    },
    files: ['src/channel.functions.ts', 'src/channel.wiring.ts', 'client/websocket.ts']
  },
  sse: {
    name: 'Server-Sent Events',
    icon: 'sse',
    description: 'Streaming updates',
    defaultDeployment: 'express',
    deployments: {
      express: { name: 'Express', repo: 'template-express-middleware', runtimeFiles: ['src/start.ts'] },
      fastify: { name: 'Fastify', repo: 'template-fastify-plugin', runtimeFiles: ['src/start.ts'] }
    },
    files: ['src/http-sse.functions.ts', 'src/http-sse.wiring.ts', 'client/http-sse.ts']
  },
  scheduled: {
    name: 'Scheduled Tasks',
    icon: 'cron',
    description: 'Cron jobs',
    defaultDeployment: 'express',
    deployments: {
      express: { name: 'Express', repo: 'template-express-middleware', runtimeFiles: ['src/start.ts'] },
      lambda: { name: 'AWS Lambda', repo: 'template-aws-lambda', runtimeFiles: ['src/main.ts', 'serverless.yml'] },
      cloudflare: { name: 'Cloudflare', repo: 'template-cloudflare-workers', runtimeFiles: ['src/index.ts', 'wrangler.toml'] }
    },
    files: ['src/scheduled-task.functions.ts', 'src/scheduled-task.wiring.ts']
  },
  queue: {
    name: 'Queues',
    icon: 'queue',
    description: 'Background jobs',
    defaultDeployment: 'bullmq',
    deployments: {
      bullmq: { name: 'BullMQ', repo: 'template-bullmq', runtimeFiles: ['src/start.ts'] },
      pgboss: { name: 'PG Boss', repo: 'template-pg-boss', runtimeFiles: ['src/start.ts'] },
      sqs: { name: 'AWS SQS', repo: 'template-aws-lambda', runtimeFiles: ['src/main.ts', 'serverless.yml'] },
    },
    files: ['src/queue-worker.functions.ts', 'src/queue-worker.wiring.ts', 'client/queue-worker.ts']
  },
  rpc: {
    name: 'RPC',
    icon: 'rpc',
    description: 'Type-safe calls',
    defaultDeployment: 'express',
    deployments: {
      express: { name: 'Express', repo: 'template-express-middleware', runtimeFiles: ['src/start.ts'] },
      fastify: { name: 'Fastify', repo: 'template-fastify-plugin', runtimeFiles: ['src/start.ts'] },
      lambda: { name: 'AWS Lambda', repo: 'template-aws-lambda', runtimeFiles: ['src/main.ts', 'serverless.yml'] },
      cloudflare: { name: 'Cloudflare', repo: 'template-cloudflare', runtimeFiles: ['src/index.ts', 'wranger.toml'] }
    },
    files: ['src/rpc.functions.ts', 'src/rpc.wiring.ts', 'client/rpc.ts']
  },
  mcp: {
    name: 'MCP',
    icon: 'mcp',
    description: 'AI integrations',
    defaultDeployment: 'mcp',
    deployments: {
      mcp: { name: 'MCP Server', repo: 'template-mcp-server', runtimeFiles: ['src/start.ts'] }
    },
    files: ['src/mcp.functions.ts', 'src/mcp.wiring.ts', 'client/mcp.ts']
  }
};

type FunctionType = keyof typeof FUNCTION_TABS;

/** Deployment selector component for each tab */
function DeploymentSelector({
  activeDeployment,
  deployments,
  onDeploymentChange
}: {
  activeDeployment: string;
  deployments: Record<string, { name: string; repo: string }>;
  onDeploymentChange: (deployment: string) => void;
}) {
  const showDeploymentOptions = Object.keys(deployments).length > 1;
  
  if (!showDeploymentOptions) return null;

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Deploy to:</span>
      <div className="shadow-sm inline-flex bg-white dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-gray-600">
        {Object.entries(deployments).map(([key, deployment]) => (
          <div
            key={key}
            onClick={() => onDeploymentChange(key)}
            className={`px-3 py-1.5 text-sm font-medium transition-all first:rounded-l-lg last:rounded-r-lg cursor-pointer ${
              activeDeployment === key
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            {deployment.name}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Tab content component for each function type */
function TabContent({ tabKey }: { tabKey: FunctionType }) {
  const [activeDeployment, setActiveDeployment] = useState<{ type: 'code' | 'deployment'; runtime: string }>({
    type: 'code',
    runtime: FUNCTION_TABS[tabKey].defaultDeployment
  });

  const currentTab = FUNCTION_TABS[tabKey];
  const currentDeployment = currentTab.deployments[activeDeployment.runtime];

  console.log(currentDeployment, currentTab, activeDeployment.type === 'code' ? currentTab.files : currentDeployment.runtimeFiles)

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Stackblitz 
            key={`${tabKey}-${activeDeployment.runtime}`}
            repo={currentDeployment.repo}
            initialFiles={activeDeployment.type === 'code' ? currentTab.files : currentDeployment.runtimeFiles}
          />
      </div>

      <div className="flex justify-center">
        <DeploymentSelector
          activeDeployment={activeDeployment.runtime}
          deployments={currentTab.deployments}
          onDeploymentChange={runtime => setActiveDeployment({ type: 'deployment', runtime })}
        />
      </div>
    </div>
  );
}

/** Main examples section with Docusaurus tabs */
function InteractiveExamplesSection() {
  return (
    <section className="py-16">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <div className="text-center mb-12">
          <Heading as="h2" className="text-3xl font-bold mb-4">
            Code Examples
          </Heading>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore live Pikku examples. Functions stay the same - just the deployment changes.
          </p>
        </div>

        <Tabs defaultValue="http" lazy={true}>
          <TabItem 
            value="http" 
            label={
              <div className="flex items-center space-x-2">
                <WiringIcon wiringId="http" size={16} />
                <span>HTTP</span>
              </div> as any
            }
            
          >
            <TabContent tabKey="http" />
          </TabItem>

          <TabItem 
            value="websocket" 
            label={
              <div className="flex items-center space-x-2">
                <WiringIcon wiringId="websocket" size={16} />
                <span>WebSocket</span>
              </div> as any
            }
          >
            <TabContent tabKey="websocket" />
          </TabItem>

          <TabItem 
            value="sse" 
            label={
              <div className="flex items-center space-x-2">
                <WiringIcon wiringId="sse" size={16} />
                <span>SSE</span>
              </div> as any
            }
          >
            <TabContent tabKey="sse" />
          </TabItem>

          <TabItem 
            value="scheduled" 
            label={
              <div className="flex items-center space-x-2">
                <WiringIcon wiringId="cron" size={16} />
                <span>Scheduled</span>
              </div> as any
            }
          >
            <TabContent tabKey="scheduled" />
          </TabItem>

          <TabItem 
            value="queue" 
            label={
              <div className="flex items-center space-x-2">
                <WiringIcon wiringId="queue" size={16} />
                <span>Queues</span>
              </div> as any
            }
          >
            <TabContent tabKey="queue" />
          </TabItem>

          <TabItem 
            value="rpc" 
            label={
              <div className="flex items-center space-x-2">
                <WiringIcon wiringId="rpc" size={16} />
                <span>RPC</span>
              </div>  as any
            }
          >
            <TabContent tabKey="rpc" />
          </TabItem>

          <TabItem 
            value="mcp" 
            label={
              <div className="flex items-center space-x-2">
                <WiringIcon wiringId="mcp" size={16} />
                <span>MCP</span>
              </div> as any
            }
          >
            <TabContent tabKey="mcp" />
          </TabItem>
        </Tabs>
      </div>
    </section>
  );
}


/** Main Code Examples page component */
export default function LiveExamples() {
  return (
    <section id="code-examples" className="hidden md:flex py-16 border-t border-gray-200 dark:border-neutral-700">
          <div className="max-w-[1600px] w-full mx-auto px-4 text-center">
            <InteractiveExamplesSection />
          </div>
    </section>
  );
} 