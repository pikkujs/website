import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Image from '@theme/ThemedImage';
import CodeBlock from '@theme/CodeBlock';
import { features, developerFeatures, runtimes } from '@site/data/homepage';

/** Renders a heading, tagline, and CTA buttons at the top of the homepage. */
function Hero() {
  return (
    <header className="flex w-full max-w-screen-lg pt-16 pb-12 px-4 self-center">
      <div className="md:w-1/2">
        <Heading as="h1" className="text-5xl font-bold mb-4 text-primary">
          Pikku
        </Heading>
        <Heading as="h2" className="text-5xl font-bold mb-4">
          Write Once, Deploy Anywhere
        </Heading>
        <p className="text-2xl font-medium leading-snug mb-4">
          Type-safe APIs that run on Express, Fastify, AWS Lambda, Cloudflare Workers, and Next.js
        </p>
        <div className="text-lg mb-6 space-y-2">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Automatic TypeScript client generation
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Runtime agnostic - switch servers without code changes  
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Built-in WebSockets, auth, and validation
          </div>
        </div>
        <div className="flex flex-row gap-4 mt-6">
          <Link to="/docs" className="button button--primary">
            Get Started in 60 Seconds
          </Link>
          <Link className="button button--secondary" to="https://github.com/pikkujs/pikku">
            View on GitHub
          </Link>
        </div>
      </div>
      <div className="hidden md:block w-1/2">
        <Image sources={{ light: 'img/pikku.png', dark: 'img/pikku.png' }} />
      </div>
    </header>
  );
}

/** Card for a single pitch item. */
function PitchCard({ title, content, icon }: { title: string; content: string, icon: string }) {
  return (
    <li className="shadow p-4 rounded-lg shadow-lg">
      <div className='px-2 py-4 text-4xl'>{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p>{content}</p>
    </li>
  );
}

/** Shows TypeScript magic between server and client */
function TypeSafetyDemo() {
  return (
    <section className="py-12 px-4 md:px-0 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-lg mx-auto">
        <div className="text-center mb-8">
          <Heading as="h2" className="text-3xl font-bold mb-4">
            Full Type Safety from Server to Client
          </Heading>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Write once, get TypeScript autocomplete everywhere
          </p>
        </div>
        
        {/* Placeholder for GIF - Replace with actual recording */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-12 mb-6">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              🎬 <strong>Coming Soon:</strong> Interactive demo showing:
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold mb-2">📝 Server Side</h4>
                <ul className="text-sm space-y-1">
                  <li>• Write pikkuFunc with types</li>
                  <li>• Export function</li>
                  <li>• Run CLI command</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">✨ Client Side</h4>
                <ul className="text-sm space-y-1">
                  <li>• Full TypeScript autocomplete</li>
                  <li>• Automatic type checking</li>
                  <li>• Runtime validation</li>
                </ul>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Demo GIF will show live TypeScript intellisense flowing from server function definitions to client usage
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold">Instant Feedback</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">See type errors as you type</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <div className="text-2xl mb-2">🔄</div>
            <h4 className="font-semibold">Always in Sync</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Client types update automatically</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <div className="text-2xl mb-2">🛡️</div>
            <h4 className="font-semibold">Runtime Safe</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Validation matches your types</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="py-12 px-4 md:px-0">
      <div className="max-w-screen-lg mx-auto text-center">
        <ul className="pl-0 list-none grid gap-4 md:grid-cols-4 text-left text-lg font-medium">
          {features.map((pitch) => (
            <PitchCard key={pitch.title} {...pitch} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function DeveloperSection() {
  return (
    <section className="py-12 px-4 md:px-0">
      <Heading as='h2' className='text-3xl text-center'>Developer Experience First</Heading>
      <p className='text-center max-w-screen-md mx-auto text-xl'>Everything you need for production APIs, generated automatically from your TypeScript functions.</p>
      <div className="max-w-screen-lg mx-auto text-center">
        <ul className="pl-0 list-none grid gap-4 md:grid-cols-4 text-left text-lg font-medium">
          {developerFeatures.map((pitch) => (
            <PitchCard key={pitch.title} {...pitch} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Displays supported deployment options compactly */
function RuntimeOptionsSection() {
  return (
    <section className="max-w-screen-lg mx-auto text-center mb-12 px-4 md:px-0">
        <Heading as="h2" className="text-3xl font-semibold mb-2">
          One Codebase, Any Runtime
        </Heading>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Deploy to AWS Lambda, Cloudflare, Express, Next.js, and more
        </p>
        
        <div className='grid grid-cols-3 md:grid-cols-8 gap-4 items-center justify-items-center mb-6'>
          {[...runtimes.cloud, ...runtimes.middleware, runtimes.custom].map(deployment => (
            <Link 
              key={deployment.name}
              className="p-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-110" 
              href={deployment.docs} 
              title={`Deploy to ${deployment.name}`}
            >
              <Image 
                width={60} 
                height={60}
                className='mx-auto' 
                sources={{ 
                  light: `img/logos/${deployment.img.light}`, 
                  dark: `img/logos/${deployment.img.dark}` 
                }} 
              />
            </Link>
          ))}
        </div>

        <div className="max-w-md mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-blue-600 dark:text-blue-400 mr-2">🔌</span>
            <strong className="text-gray-800 dark:text-gray-100">Easy integration</strong>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Add Pikku as middleware to existing projects
          </p>
          <Link 
            to="/docs/guides" 
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Integration Guide →
          </Link>
        </div>
    </section>
  );
}


/** The main Home component that ties everything together. */
export default function Home() {
  return (
    <Layout
      title="Pikku - A Function-First Framework for Node.js"
      description="A lightweight framework for building scalable, function-driven services with TypeScript"
    >
      <Hero />
      <main>
        <TypeSafetyDemo />
        <FeatureSection />
        <DeveloperSection />
        <RuntimeOptionsSection />
      </main>
    </Layout>
  );
}
