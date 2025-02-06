import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';
import { Code } from '../components/Code';

// Import the code snippets from the external file
import {
  codeTypes,
  codeImplementations,
  codePikkuConfig,
  codeExpress,
  codeUWS,
  codeCloudflareIndex,
  codeCloudflareWrangler,
  codeServerless,
  codeScheduled,
} from '../getting-started-code-snippets'; 

/** Example: Deployment configs referencing the external code snippets. */
const deployments = {
  express: {
    package: '@pikku/express-middleware',
    code: codeExpress,
    text: 'This app starts an Express server on port 3000. The pikku middleware processes routes.'
  },
  uws: {
    package: '@pikku/uws-handler',
    code: codeUWS,
    text: 'This starts a uWebSockets.js server on port 9001 for both HTTP and WebSocket routes.'
  },
  cloudflare: {
    package: '@pikku/cloudflare',
    code: codeCloudflareIndex,
    text: 'A Cloudflare Worker that handles both fetch requests and scheduled events.',
    config: codeCloudflareWrangler
  },
  serverless: {
    package: '@pikku/lambda',
    code: codeServerless,
    text: 'Exposes separate AWS Lambda handlers for scheduled tasks, CORS, and non-CORS requests.'
  },
  scheduled: {
    package: '@pikku/schedule',
    code: codeScheduled,
    text: 'Starts scheduled tasks for a server-based deployment scenario.'
  }
};

/** Introduction section */
const Intro: React.FC = () => (
  <div className="px-6 max-w-screen-lg w-full mx-auto">
    <Heading as="h1" className="text-4xl font-bold ex-text-gray-800 mb-4">
      Getting Started
    </Heading>
    <p className="text-lg mb-6">
      <strong>Pikku</strong> is a minimal TypeScript framework for building function-based APIs 
      that run on serverless platforms or traditional servers with ease.
    </p>

    <Admonition type="info" title="Installation & Requirements">
      Requires <strong>Node 18+</strong>.<br />
      Install via <code>npm install @pikku/core</code> or <code>yarn add @pikku/core</code>.
    </Admonition>

    <p className="text-lg mt-6">
      This guide walks you through the setup steps. For more complete examples, see our repos on GitHub.
    </p>
  </div>
);

/** Step One: Explanation of the fundamental Pikku types. */
const Types: React.FC = () => (
  <div className="px-6 max-w-screen-lg w-full mx-auto">
    <Heading as="h2" className="text-lg">Step One</Heading>
    <Heading as="h3" className="text-4xl font-bold ex-text-gray-800 mb-4">Types</Heading>
    <p className="text-lg mb-6">
      Define four key types to get started: <em>Config</em>, <em>UserSession</em>, 
      <em>SingletonServices</em>, and <em>SessionServices</em>.
    </p>
    <Code language="ts">{codeTypes}</Code>
  </div>
);

/** Step Two: Type implementations */
const Implementations: React.FC = () => (
  <div className="px-6 max-w-screen-lg w-full mx-auto">
    <Heading as="h2" className="text-lg">Step Two</Heading>
    <Heading as="h3" className="text-4xl font-bold ex-text-gray-800 mb-4">
      Type Implementations
    </Heading>
    <p className="text-lg mb-6">
      Next, create the implementations of these types that the Pikku CLI uses.
    </p>
    <Code language="ts">{codeImplementations}</Code>
  </div>
);

/** Step Three: Show logic functions (example usage, possibly reusing CodeExamples). */
const Functions: React.FC = () => (
  <div className="px-6 max-w-screen-lg w-full mx-auto">
    <Heading as="h2" className="text-lg">Step Three</Heading>
    <Heading as="h3" className="text-4xl font-bold ex-text-gray-800 mb-4">Logic Functions</Heading>
    <p className="text-lg mb-6">
      With dependencies in place, define your logic functions. For instance:
    </p>
  </div>
);

/** Step Four: Pikku CLI config file usage. */
const PikkuConfig: React.FC = () => (
  <div className="px-6 max-w-screen-lg w-full mx-auto">
    <Heading as="h2" className="text-lg">Step Four</Heading>
    <Heading as="h3" className="text-4xl font-bold ex-text-gray-800 mb-4">Pikku CLI</Heading>
    <p className="text-lg mb-6">
      <em>pikku.config.json</em> instructs the CLI where to find routes and 
      generate additional types:
    </p>
    <Code language="json">{codePikkuConfig}</Code>

    <Admonition type="info" title="Generate Necessary Files">
      Then run <code>npx @pikku/cli</code> to generate all the necessary files.
    </Admonition>
  </div>
);

/** Step Five: Integration & Deployment using multiple frameworks or serverless environments. */
const Integrations: React.FC = () => (
  <div className="px-6 max-w-screen-lg w-full mx-auto">
    <Heading as="h2" className="text-lg">Step Five</Heading>
    <Heading as="h3" className="text-4xl font-bold ex-text-gray-800 mb-4">
      Integration and Deployment
    </Heading>
    <p className="text-lg mb-6">Pikku can integrate with various platforms:</p>

    <Admonition type="info" title="WebSocket Examples">
      Examples with WebSockets are not yet included in this section.
    </Admonition>
    
    <Tabs>
      <TabItem value="express" label="Express" default>
        <p>Required: <em className="font-bold">{deployments.express.package}</em></p>
        <Code language="ts">{deployments.express.code}</Code>
        <Admonition type="info" title="Express Deployment">
          {deployments.express.text}
        </Admonition>
      </TabItem>

      <TabItem value="uws" label="uWebSockets.js">
        <p>Required: <em className="font-bold">{deployments.uws.package}</em></p>
        <Code language="ts">{deployments.uws.code}</Code>
        <Admonition type="info" title="uWebSockets Deployment">
          {deployments.uws.text}
        </Admonition>
      </TabItem>

      <TabItem value="aws" label="AWS">
        <p>Required: <em className="font-bold">{deployments.serverless.package}</em></p>
        <Code language="ts">{deployments.serverless.code}</Code>
        <Admonition type="info" title="AWS Serverless Deployment">
          {deployments.serverless.text}
        </Admonition>
      </TabItem>

      <TabItem value="cloudflare" label="Cloudflare">
        <p>Required: <em className="font-bold">{deployments.cloudflare.package}</em></p>
        <Code language="ts">{deployments.cloudflare.code}</Code>
        <Admonition type="info" title="Cloudflare Deployment">
          {deployments.cloudflare.text}
        </Admonition>

        <Heading as="h4" className="text-lg mt-4 mb-2">Wrangler Config</Heading>
        <Code language="toml">{deployments.cloudflare.config}</Code>
      </TabItem>

      <TabItem value="scheduled" label="Scheduled Tasks">
        <p>Required: <em className="font-bold">{deployments.scheduled.package}</em></p>
        <Code language="ts">{deployments.scheduled.code}</Code>
        <Admonition type="info" title="Scheduled Tasks">
          {deployments.scheduled.text}
        </Admonition>
      </TabItem>
    </Tabs>
  </div>
);

/** Final "What's Next" or "Next Steps" section. */
const NextSteps: React.FC = () => (
  <div className="px-6 max-w-screen-lg w-full mx-auto mb-8">
    <Heading as="h2" className="text-lg">Next Steps</Heading>
    <Heading as="h3" className="text-3xl font-bold ex-text-gray-800 mb-4">
      Where to Go from Here
    </Heading>
    <p className="text-lg mb-6">
      You now have a working understanding of Pikku. Explore advanced topics like authentication, 
      real-time messaging, or connect with the community on GitHub!
    </p>
    <Admonition type="tip" title="Happy Coding!">
      We look forward to your feedback and contributions.
    </Admonition>
  </div>
);

/** The main page component tying all steps together. */
export default function GettingStarted() {
  return (
    <Layout title="Getting Started" description="How to get started with Pikku">
      <main className="py-8 flex flex-col space-y-4">
        <Intro />
        <Types />
        <Implementations />
        <Functions />
        <PikkuConfig />
        <Integrations />
        <NextSteps />
      </main>
    </Layout>
  );
}
