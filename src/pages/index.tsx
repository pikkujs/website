import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { Code } from '../components/Code';

//
// 1. Code Samples moved to a dedicated constant at the top
//
const codeSamples = {
  http: {
    function: `// The Function
import { APIFunction } from './vramework/types' 
const getTodo: APIFunction<{ todoId: string }, Todo> = async (
  services,
  data,
  userSession
) => {
  // This method doesn't exist to make it easier to read
  return await getTodo(services.database, data.todoId)
}`,
    wiring: `// The Wiring
import { addRoute } from '@vramework/core'
addRoute({
  method: 'get',
  route: '/todo/:todoId',
  func: getTodo,
  permissions: {
    isTodoCreator: [isTodoCreator, withinAPILimits],
    isAdmin
  },
  auth: true,
  docs: {
    errors: [NotFoundError],
    description: 'Updates a todo',
    tags: ['todos']
  }
})`,
  },
  scheduledTask: {
    function: `// Scheduled Task Function
const expireTodos: APIFunctionSessionless<void, void> = async (services) => {
  services.logger.info('Expiring all todos')
}`,
    wiring: `// Scheduled Task Wiring
import { addScheduledTask } from '@vramework/core'

addScheduledTask({
  name: 'expireTodos',
  schedule: '*/1 * * * *',
  func: expireTodos,
  docs: {
    tags: ['todos'],
  },
})`,
  },
  websocket: {
    function: `// The Functions
const onConnect: ChannelConnection<'hello!'> = async (
  services,
  channel
) => {
  services.logger.info('A channel has been established')
  channel.send('hello!')
}

const onDisconnect: ChannelDisconnection = async (services, channel) => {
  services.logger.info('A channel has been ended')
}
  
export const authenticate: ChannelMessage<
  { token: string; userId: string },
  { authResult: boolean; action: 'auth' }
> = async (services, channel, data) => {
  const authResult = data.token === 'valid'
  if (authResult) {
    await channel.setUserSession({ userId: data.userId })
  }
  return { authResult, action: 'auth' }
}

const onMessage: ChannelMessage<'hello', 'hey'> = async (
  services,
  channel
) => {
  services.logger.info('Got a generic hello message on callback')
  channel.send('hey')
}`,
    wiring: `// The Wiring 
addChannel({
  name: 'events',
  route: '/',
  onConnect,
  onDisconnect,
  auth: true,
  onMessage,
  onMessageRoute: {
    action: {
      auth: {
        func: authenticate,
        auth: false,
      },
    },
  },
})
`,
  },
};

//
// 2. Data and content arrays consolidated for clarity
//
const deploymentData = [
  { type: 'Serverless', service: 'AWS', http: '✅', websocket: '✅', cron: '✅' },
  { type: 'Serverless', service: 'Cloudflare', http: '✅', websocket: '⚠️', cron: '✅' },
  { type: 'Server', service: 'uWS', http: '✅', websocket: '✅', cron: '✅' },
  { type: 'Server', service: 'WS', http: '❌', websocket: '✅', cron: '✅' },
  { type: 'Server', service: 'Express', http: '✅', websocket: '❌', cron: '✅' },
  { type: 'Server', service: 'Fastify', http: '✅', websocket: '❌', cron: '✅' },
];

const faqs = [
  {
    question: 'How production ready is this?',
    answer:
      'At this very moment we would suggest using this for all server deployments and for http serverless. Help with testing the serverless solutions would be much appreciated!',
  },
  {
    question: 'How can I provide feedback?',
    answer:
      "Right now GitHub discussions would be best! We'll be setting up Discord early 2025.",
  },
  {
    question: 'How can I contribute?',
    answer:
      "Everywhere! We are looking for example demos, testing out the current start workspaces, adding more deployment options, more testing. It's pretty endless! Feel free to reach out via yasser.fadl@vlandor.com if you want some pointers.",
  },
  {
    question: 'How much CPU overhead does this add on top?',
    answer:
      "A performance testing framework isn't in place yet. However, performance is a top priority. The main issue is that serverless tends to be async by nature, so in some cases we provide local and serverless adaptors to minimize that penalty when possible.",
  },
  {
    question: 'How big are the deployed bundle sizes?',
    answer:
      "The serverless bundle size of the workspace-starter is around 350kb, including database and schema libraries. Lazy loading and tree-shaking only the required services is on the roadmap.",
  },
  {
    question: 'What about micro service deployment?',
    answer:
      "This is currently unofficially supported but requires manual work to avoid bundling everything. The CLI will be enhanced to only import desired functions in the future.",
  },
];

const pitches = [
  {
    title: 'Explore New Environments',
    content:
      'Stop wondering if the grass is just greener on the other side. Deploy your services to AWS Lambda, Cloudflare Workers, and other serverless platforms.',
  },
  {
    title: 'Improve Reliability',
    content:
      'Deploy the same logic in multiple environments to ensure your services are always available.',
  },
  {
    title: 'Enterprise and Cloud Co-existence',
    content:
      'Why limit yourself between serverless and server-based deployments? Vramework lets you have the best of both worlds.',
  },
  {
    title: 'Reduce Costs and Your Carbon Footprint',
    content:
      'Easily switch between serverless and server-based deployments to optimize costs and performance, potentially helping make the world a bit greener.',
  },
];

//
// 3. Reusable sub-components
//

/** Renders a heading, tagline, and CTA buttons at the top of the homepage. */
function HomepageHeader() {
  return (
    <header className="flex flex-col items-center py-24 px-4">
      <div className="max-w-screen-lg mx-auto w-full text-center">
        <img
          className="max-w-[150px] w-full mb-6"
          src={useBaseUrl('/img/vramework.png')}
          alt="Vramework logo"
        />
        <Heading as="h1" className="text-5xl font-bold ex-text-gray-800 leading-snug mb-4">
          Vendor-Free Flexibility for Modern APIs
        </Heading>
        <p className="text-2xl font-medium max-w-2xl mx-auto">
          A minimal TypeScript framework for building web APIs as functions, deployable serverless
          or locally with ease
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link to="/getting-started" className="button button--primary button--lg">
            Get Started
          </Link>
          <Link to="/docs/intro" className="button button--secondary button--lg">
            Documentation
          </Link>
          <Link className="button button--outline button--lg" to="https://github.com/vramework/vramework">
            View on GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Card for a single pitch item. */
function PitchCard({ title, content }: { title: string; content: string }) {
  return (
    <li className="ex-bg-white shadow p-6 rounded-lg">
      <h3 className="text-xl font-semibold ex-text-gray-800 mb-2">{title}</h3>
      <p className="ex-text-gray-600">{content}</p>
    </li>
  );
}

function PitchSection() {
  return (
    <section className="py-12 container">
      <div className="max-w-screen-lg mx-auto text-center">
        <ul className="list-none px-8 grid gap-4 md:grid-cols-2 text-left text-lg font-medium">
          {pitches.map((pitch) => (
            <PitchCard key={pitch.title} title={pitch.title} content={pitch.content} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/** A small functional component to render side-by-side code examples for each approach. */
function CodeExample({ wiring, func }: { wiring: string; func: string }) {
  return (
    <Code className="ex-bg-gray-100 p-4 rounded-lg">{`${func}\n\n${wiring}`}</Code>
  );
}

/** Tabs displaying three example types: HTTP, Cron, Websockets. */
export function CodeExamples() {
  return (
    <Tabs>
      <TabItem value="http" label="HTTP" default>
        <CodeExample wiring={codeSamples.http.wiring} func={codeSamples.http.function} />
      </TabItem>
      <TabItem value="cron" label="Scheduled">
        <CodeExample wiring={codeSamples.scheduledTask.wiring} func={codeSamples.scheduledTask.function} />
      </TabItem>
      <TabItem value="websocket" label="WebSockets">
        <CodeExample wiring={codeSamples.websocket.wiring} func={codeSamples.websocket.function} />
      </TabItem>
    </Tabs>
  );
}

/** Example usage section, typically after "the pitch". */
function CodeExamplesSection() {
  return (
    <section className="py-16">
      <div className="px-6 max-w-screen-lg mx-auto">
        <Heading as="h2" className="text-4xl font-semibold ex-text-gray-800 mb-6 text-center">
          Code Examples
        </Heading>
        <CodeExamples />
      </div>
    </section>
  );
}

/** Displays a table of supported deployment options. */
function DeploymentOptionsSection() {
  return (
    <section className="container">
      <div className="max-w-screen-lg mx-auto text-center">
        <Heading as="h2" className="text-4xl font-semibold ex-text-gray-800 mb-6">
          Supported Deployment Options
        </Heading>
        <p className="text-lg font-medium mb-8">
          The following are the deployment options currently supported by Vramework
        </p>
        <div className="inline-flex overflow-x-auto">
          <table className="table-auto w-full border-collapse border">
            <thead>
              <tr>
                <th className="hidden md:block border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Service</th>
                <th className="border px-4 py-2">HTTP</th>
                <th className="border px-4 py-2">WebSocket</th>
                <th className="hidden md:block border px-4 py-2">Cron</th>
              </tr>
            </thead>
            <tbody>
              {deploymentData.map((row) => (
                <tr key={`${row.type}-${row.service}`}>
                  <td className="hidden md:block border px-4 py-2 font-medium">{row.type}</td>
                  <td className="border px-4 py-2">{row.service}</td>
                  <td className="border px-4 py-2">{row.http}</td>
                  <td className="border px-4 py-2">{row.websocket}</td>
                  <td className="hidden md:block border px-4 py-2">{row.cron}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm mt-4">
          <strong>Legend:</strong> ✅ Supported | ⚠️ Beta Support | ❌ Not Supported
        </p>
      </div>
    </section>
  );
}

/** Closing CTA: encouraging users to get started, see docs, read blog, or contribute. */
function CallToActionSection() {
  return (
    <section className="py-16 container">
      <div className="max-w-screen-lg mx-auto text-center">
        <Heading as="h2" className="text-4xl font-semibold ex-text-gray-800 mb-6">
          Get Involved with Vramework
        </Heading>
        <p className="text-lg font-medium mb-8">
          Start building with Vramework, explore our insights, or join the community to help shape
          the future of function-driven frameworks.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/getting-started" className="button button--primary button--lg">
            Get Started
          </Link>
          <Link to="/docs/intro" className="button button--primary button--lg">
            Docs
          </Link>
          <Link to="/blog" className="button button--secondary button--lg">
            Read Our Blog
          </Link>
          <Link to="https://github.com/vramework/vramework" className="button button--secondary button--lg">
            Contribute on GitHub
          </Link>
          <Link to="/get-in-touch" className="button button--outline button--lg">
            Get In Touch
          </Link>
        </div>
      </div>
    </section>
  );
}

/** The main Home component that ties everything together. */
export default function Home() {
  return (
    <Layout
      title="Vramework - A Function-First Framework for Node.js"
      description="A lightweight framework for building scalable, function-driven services with TypeScript"
    >
      <HomepageHeader />
      <main>
        <PitchSection />
        <CodeExamplesSection />
        <DeploymentOptionsSection />
        <CallToActionSection />
      </main>
    </Layout>
  );
}
