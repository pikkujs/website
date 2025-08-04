import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Image from '@theme/ThemedImage';
import { runtimes } from '@site/data/homepage';

/** Reusable component for Pikku logo surrounded by icons */
function PikkuCircularLayout({ 
  items, 
  renderItem, 
  logoSize = 180, 
  radius = 180 
}: {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  logoSize?: number;
  radius?: number;
}) {
  return (
    <div className="relative flex items-center justify-center min-h-[400px]">
      <div className="relative z-10">
        <Image 
          sources={{ light: 'img/pikku.png', dark: 'img/pikku.png' }} 
          width={logoSize}
          height={logoSize}
          className="mx-auto"
        />
      </div>
      
      {/* Items arranged in a circle around Pikku */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: '100%', height: '100%' }}>
          {items.map((item, index) => {
            const total = items.length;
            const angle = (index * 360) / total;
            const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
            const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
            
            return (
              <div
                key={index}
                className="absolute"
                style={{
                  left: `calc(50% + ${x}px - 32px)`,
                  top: `calc(50% + ${y}px - 32px)`,
                }}
              >
                {renderItem(item, index)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Hero Section: Identity & Hook */
function Hero() {
  return (
    <header className="flex w-full max-w-screen-lg pt-16 pb-12 px-4 self-center">
      <div className="md:w-1/2">
        <Heading as="h1" className="text-5xl font-bold mb-4 text-primary">
          Pikku. The Typescript Backend That Adapts.
        </Heading>
        <Heading as="h2" className="text-3xl font-bold mb-6 text-gray-600 dark:text-gray-300">
          Define once. Run anywhere.
        </Heading>
        <p className="text-xl font-medium leading-relaxed mb-8 text-gray-700 dark:text-gray-300">
          Like a chameleon adapts to its environment, Pikku adapts your backend logic 
          to any protocol, runtime, or deployment target.
        </p>
        <div className="flex flex-row gap-4 mt-6">
          <Link to="#how-it-works" className="button button--primary">
            How It Works
          </Link>
          <Link to="/docs" className="button button--secondary">
            Try Pikku
          </Link>
        </div>
      </div>
      <div className="hidden md:block w-1/2">
        <Image sources={{ light: 'img/pikku.png', dark: 'img/pikku.png' }} />
      </div>
    </header>
  );
}

/** The Problem: Fragmented Backends */
function ProblemSection() {
  return (
    <section className="py-16">
      <div className="max-w-screen-lg mx-auto px-4">
        <Heading as="h2" className="text-4xl font-bold mb-6 text-center">
          Typed Backends Break
        </Heading>
        
        <div className="grid md:grid-cols-2 md:gap-16 md:items-center mt-12">
          <div className="text-left">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              In Node, type safety usually stops at the HTTP boundary. Add WebSockets, queues, cron jobs, or AI agents and there's no shared contract—validation and shapes get re-implemented and drift.
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              And "deploy anywhere" mostly ends at routes: moving the rest of the backend to serverless, edge, Bun/Deno, or containers means more adapters, more glue, more risk.
            </p>
            
            <div className="space-y-4">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Each new protocol fragments your code.</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Types diverge. Logic drifts.</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Confidence erodes.</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <Image 
              sources={{ light: 'img/pikku.png', dark: 'img/pikku.png' }} 
              width={350}
              height={350}
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** The Chameleon Approach */
function ChameleonSection() {
  const protocols = [
    { icon: '🔁', name: 'HTTP Routes', desc: 'with OpenAPI' },
    { icon: '📡', name: 'WebSocket channels', desc: 'real-time communication' },
    { icon: '🧠', name: 'AI agents', desc: 'intelligent automation' },
    { icon: '⚡', name: 'Queue & cron jobs', desc: 'background processing' },
    { icon: '🧬', name: 'RPC and type-safe SDKs', desc: 'seamless integration' }
  ];

  return (
    <section id="how-it-works" className="py-16">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          One Format. Many Protocols.
        </Heading>

        <div className="grid md:grid-cols-2 md:gap-12 md:items-center">
          {/* Left side - Chameleon description */}
          <div className="text-left">
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Pikku lets you define backend logic once and wire it to most protocols.
            </p>
            
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                Like a chameleon adapts to its environment while keeping its core intact,
                Pikku adapts your logic to every protocol while preserving type safety and business rules.
              </p>
          </div>
          
          {/* Right side - Pikku logo surrounded by protocol icons */}
          <PikkuCircularLayout
            items={protocols}
            renderItem={(protocol) => (
              <div className="flex flex-col items-center hover:scale-110 transition-all duration-200">
                <div className="text-5xl mb-3">{protocol.icon}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center font-medium">
                  {protocol.name.replace(' Routes', '').replace(' channels', '').replace(' agents', '').replace(' & cron jobs', '').replace(' and type-safe SDKs', '')}
                </div>
              </div>
            )}
            logoSize={160}
            radius={120}
          />
        </div>
      </div>
    </section>
  );
}

/** Deploy Anywhere */
function DeployAnywhereSection() {
  return (
    <section className="py-16">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Deploy Anywhere. Blend In Everywhere.
        </Heading>
        
        <div className="grid md:grid-cols-2 md:gap-12 md:items-center">
          {/* Left side - Description */}
          <div className="text-left">
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Pikku works with Node, Bun, Deno, serverless, edge runtimes, and containers.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No lock-in. No framework rules. Just JavaScript.
            </p>
          </div>
          
          {/* Right side - Circular logo layout */}
          <PikkuCircularLayout
            items={[...runtimes.cloud, ...runtimes.middleware, runtimes.custom]}
            renderItem={(deployment) => (
              <Link
                className="transition-all duration-200 hover:scale-110"
                href={deployment.docs}
                title={`Deploy to ${deployment.name}`}
              >
                <Image
                  width={64}
                  height={64}
                  className='mx-auto'
                  sources={{
                    light: `img/logos/${deployment.img.light}`,
                    dark: `img/logos/${deployment.img.dark}`
                  }}
                />
              </Link>
            )}
            logoSize={160}
            radius={140}
          />
        </div>
      </div>
    </section>
  );
}

/** Try it now */
function TryItNowSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Try it now
        </Heading>
        <div className="bg-black dark:bg-gray-800 text-green-400 p-6 rounded-lg font-mono text-lg max-w-md mx-auto">
          npm create pikku@latest
        </div>
      </div>
    </section>
  );
}

/** Tiny but Powerful */
function TinyButPowerfulSection() {
  const features = [
    { title: 'Auth', desc: 'Built-in authentication filters', icon: '🔐' },
    { title: 'Permissions', desc: 'Fine-grained access control', icon: '🛡️' },
    { title: 'Services', desc: 'Singleton and per-request services', icon: '⚙️' },
    { title: 'Function Filtering', desc: 'Filter by tags or filters to optimize deployment sizes', icon: '📦' },
    { title: 'Type-safe client sdks', desc: 'Auto-generated from your function definitions', icon: '🔗' },
    { title: 'Schema Validation', desc: 'Optional runtime validation with TypeScript or Zod', icon: '✅' },
    { title: 'Tiny runtime', desc: 'Minimal overhead, maximum performance', icon: '🪶' }
  ];

  return (
    <section className="py-16">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Tiny. But Not Basic.
        </Heading>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Pikku includes everything you need for production backends:
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <span className="text-2xl mr-4 mt-1">{feature.icon}</span>
              <div className="text-left">
                <div className="text-lg font-semibold mb-2">{feature.title}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Call to Action */
function CallToActionSection() {
  return (
    <section className="py-16 bg-gray-900 dark:bg-gray-800">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <div className="text-white">
          <Heading as="h2" className="text-4xl font-bold mb-6 text-white">
            Ready to Adapt?
          </Heading>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Start using Pikku's chameleon approach to get full power over your types and deployments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/docs" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
              Try Pikku
            </Link>
            <Link to="/docs" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
              See Architecture
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


/** The main Home component that ties everything together. */
export default function Home() {
  return (
    <Layout
      title="Pikku - The Backend That Adapts"
      description="Define once. Run anywhere. Like a chameleon adapts to its environment, Pikku adapts your backend logic to any protocol, runtime, or deployment target."
    >
      <Hero />
      <main>
        <ProblemSection />
        <ChameleonSection />
        <DeployAnywhereSection />
        <TryItNowSection />
        <TinyButPowerfulSection />
        <CallToActionSection />
      </main>
    </Layout>
  );
}
