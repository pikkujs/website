import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Image from '@theme/ThemedImage';
import { runtimes } from '@site/data/homepage';
import { WiringIcon } from '../components/WiringIcons';
import LiveExamples from '../components/LiveExamples';

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
          <Link to="#code-examples" className="button button--primary">
            Code Examples
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
              Most type-safe solutions in Node focus on HTTP. But real backends span multiple protocols—WebSockets, queues, schedulers, AI agents—each with their own contracts, validation, and data shapes. Without a shared source of truth, types drift and logic fragments.
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              And while some frameworks promise “deploy anywhere,” most either lock you into their platform or limit portability to HTTP routes. The rest of your backend still needs custom adapters, glue code, and compromises.
            </p>
            
            <div className="space-y-4">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Each new protocol fragments your code.</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Types diverge. Logic drifts.</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Code locks you into specific runtimes.</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <Image 
              sources={{ light: 'img/broken-state.png', dark: 'img/broken-state.png' }} 
              width={400}
              height={400}
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Our Solution */
function SolutionSection() {
  return (
    <section className="relative py-12">
      {/* Arrow-shaped background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
          <path 
            d="M0,0 L100,0 L100,10 L50,20 L0,10 Z" 
            fill="rgb(249 250 251)" 
            className="dark:fill-gray-900"
          />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-screen-lg mx-auto px-6 text-center h-full flex items-center justify-center pt-8 pb-12">
        <div className="flex flex-col items-center space-y-4">
          <Image 
            sources={{ light: 'img/pikku-superhero.png', dark: 'img/pikku-superhero.png' }} 
            width={120}
            height={120}
            className="mx-auto"
          />
          <div>
            <Heading as="h2" className="text-4xl font-bold mb-2 text-primary">
              Meet Pikku
            </Heading>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The chameleon that loves glueing Systems and Types together
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The Chameleon Approach */
function ChameleonSection() {
  const protocols = [
    { wiringId: 'http', name: 'HTTP', desc: 'with OpenAPI' },
    { wiringId: 'websocket', name: 'Channels', desc: 'real-time communication' },
    { wiringId: 'mcp', name: 'MCP', desc: 'intelligent automation' },
    { wiringId: 'queue', name: 'Queues', desc: 'background processing' },
    { wiringId: 'rpc', name: 'RPC', desc: 'seamless integration' },
    { wiringId: 'cron', name: 'Cron Jobs', desc: 'scheduled tasks' }
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
              <>
                <div>
                  <WiringIcon wiringId={protocol.wiringId} size={64} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center font-medium">
                  {protocol.name}
                </div>
              </>
            )}
            logoSize={160}
            radius={140}
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
              No lock-in. No framework rules. Just Typescript.
            </p>
          </div>
          
          {/* Right side - Circular logo layout */}
          <PikkuCircularLayout
            items={[...runtimes.cloud, ...runtimes.middleware, runtimes.custom]}
            renderItem={(deployment) => (
              <div className="flex flex-col items-center hover:scale-110 transition-all duration-200">
                <Link
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
              </div>
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
  const copyToClipboard = () => {
    navigator.clipboard.writeText('npm create pikku@latest');
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Try it now
        </Heading>
        <div className="bg-primary text-white p-6 rounded-lg font-mono text-lg max-w-md mx-auto relative group cursor-pointer hover:bg-primary-dark transition-colors" onClick={copyToClipboard}>
          npm create pikku@latest
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/20 hover:bg-white/30 rounded-md p-2 backdrop-blur-sm"
            onClick={copyToClipboard}
            title="Copy to clipboard"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
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
    { title: 'Middleware', desc: 'Invoked before and after function calls', icon: '🪆' },
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
          Pikku includes everything you need for production backends
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
            <Link to="/docs/concepts/architecture" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
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
        <SolutionSection />
        <ChameleonSection />
        <DeployAnywhereSection />
        <TryItNowSection />
        <TinyButPowerfulSection />
        <LiveExamples />
        <CallToActionSection />
      </main>
    </Layout>
  );
}
