import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Image from '@theme/ThemedImage';
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
          Function API Framework
        </Heading>
        <p className="text-2xl font-medium leading-snug">
          TypeScript functions with minimal boilerplate. Support multiple transports and deploy to any javascript runtime.
        </p>
        <div className="flex flex-row gap-4 mt-6">
          <Link to="/docs" className="button button--primary">
            Get Started
          </Link>
          <Link className="button button--secondary" to="https://github.com/pikku/pikku">
            View on GitHub
          </Link>
        </div>
      </div>
      <div className="hidden md:block w-1/2">
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
      <p className="text-sm">{content}</p>
    </li>
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
      <Heading as='h2' className='text-3xl text-center'>Functions, Supercharged.</Heading>
      <p className='text-center max-w-screen-md mx-auto text-xl'>Write simple functions—Pikku provides services, validated data, and user sessions automatically. Modify state via services, return data, or throw an error.</p>
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

/** Displays a table of supported deployment options. */
function RuntimeOptionsSection() {
  return (
    <section className="max-w-screen-lg mx-auto text-center space-y-12 mb-12 px-4 md:px-0">
        <Heading as="h2" className="text-4xl font-semibold mb-6">
          Deploy Anywhere, Integrate Seamlessly.
        </Heading>
        <p className="text-center max-w-screen-md mx-auto text-xl">
          Use Pikku as middleware in existing projects or deploy standalone. Adapters for major runtimes are provided, and writing your own is simple.
        </p>
        <ul className='pl-0 list-none grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[...runtimes.cloud, ...runtimes.middleware, runtimes.custom].map(deployment => <li>
            <Link className="py-2 gap-y-4 transform hover:scale-110" href={deployment.docs} title={deployment.name}>
              <Image width={120} className='m-auto' sources={{ light: `img/logos/${deployment.img.light}`, dark:  `img/logos/${deployment.img.dark}` }} />
            </Link>
          </li>)}
        </ul>
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
        <FeatureSection />
        <DeveloperSection />
        <RuntimeOptionsSection />
      </main>
    </Layout>
  );
}
