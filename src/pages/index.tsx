import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Image from '@theme/ThemedImage';
import CodeBlock from '@theme/CodeBlock';
import { runtimes } from '@site/data/homepage';
import { t, tArray, tObject } from '../i18n';
import { TransportIcon } from '../components/TransportIcons';
import { TabComponent } from '../components/TabComponent';

/** Renders a heading, tagline, and CTA buttons at the top of the homepage. */
function Hero() {
  const features = tArray('hero.features') as string[];

  return (
    <header className="flex w-full max-w-screen-lg pt-16 pb-12 px-4 self-center">
      <div className="md:w-1/2">
        <Heading as="h1" className="text-5xl font-bold mb-4 text-primary">
          {t('hero.title')}
        </Heading>
        <Heading as="h2" className="text-5xl font-bold mb-4">
          {t('hero.subtitle')}
        </Heading>
        <p className="text-2xl font-medium leading-snug mb-4">
          {t('hero.description')}
        </p>
        <div className="text-lg mb-6 space-y-2">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              {feature}
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-4 mt-6">
          <Link to="/docs" className="button button--primary">
            {t('hero.primaryCta')}
          </Link>
          <Link className="button button--secondary" to="https://github.com/pikkujs/pikku">
            {t('hero.secondaryCta')}
          </Link>
        </div>
      </div>
      <div className="hidden md:block w-1/2">
        <Image sources={{ light: 'img/pikku.png', dark: 'img/pikku.png' }} />
      </div>
    </header>
  );
}

/** Transport section with code snippet and supported runtimes */
function TransportSection({
  title,
  description,
  functions,
  wiring,
  client,
  specialFeatures,
  supportedRuntimes,
  bgColor = "bg-white dark:bg-gray-800",
  id,
  docsLink,
  readMoreText
}: {
  title: string;
  description: string;
  codeSnippet?: string;
  functions?: string;
  wiring?: string;
  client?: string;
  serverCode?: string;
  clientCode?: string;
  specialFeatures?: string[];
  supportedRuntimes: string[];
  bgColor?: string;
  id: string;
  docsLink?: string;
  readMoreText?: string;
}) {
  const getRuntimeInfo = (name: string) => {
    const allRuntimes = [...runtimes.cloud, ...runtimes.middleware, runtimes.custom] as Array<any>;
    return allRuntimes.find(r => r.name.toLowerCase() === name.toLowerCase());
  };


  return (
    <section id={id} className={`py-16 ${bgColor}`}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <Heading as="h2" className="text-4xl font-bold mb-6">
              {title}
            </Heading>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {description}
            </p>

            {/* Supported Runtimes */}
            <div className="mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h4 className="text-lg font-semibold my-auto">{t('common.runsOn')}</h4>
                {supportedRuntimes.map(runtime => {
                  const runtimeInfo = getRuntimeInfo(runtime);
                  return runtimeInfo ? (
                    <Image
                      key={runtime}
                      width={24}
                      height={24}
                      sources={{
                        light: `img/logos/${runtimeInfo.img.light}`,
                        dark: `img/logos/${runtimeInfo.img.dark}`
                      }}
                      title={runtimeInfo.name}
                    />
                  ) : (
                    <div
                      key={runtime}
                      className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center"
                      title={runtime}
                    >
                      <span className="text-xs text-gray-600 dark:text-gray-300">?</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Special Features */}
            {specialFeatures && specialFeatures.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-3">{t('common.specialFeatures')}</h4>
                <ul className="space-y-2">
                  {specialFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Read More Link */}
            {docsLink && readMoreText && (
              <div>
                <Link
                  to={docsLink}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {readMoreText} →
                </Link>
              </div>
            )}
          </div>

          <div className='hidden md:flex'>
              <TabComponent
                tabs={[
                  {
                    id: 'functions',
                    label: 'Functions',
                    content: (
                      <CodeBlock language="typescript" title="functions.ts" className='max-w-full'>
                        {functions}
                      </CodeBlock>
                    )
                  },
                  ...(wiring ? [{
                    id: 'wiring',
                    label: 'Wiring',
                    content: (
                      <CodeBlock language="typescript" title="routes.ts" className='max-w-full'>
                        {wiring}
                      </CodeBlock>
                    )
                  }] : []),
                  ...(client ? [{
                    id: 'client',
                    label: 'Client',
                    content: (
                      <CodeBlock language="typescript" title="client.ts" className='max-w-full'>
                        {client}
                      </CodeBlock>
                    )
                  }] : [])
                ]}
                defaultTab="functions"
              />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Shows all transport types available in Pikku */
function PlatformToolsSection() {
  const platformTools = tObject('platformTools') as {
    title: string;
    description: string;
    transports: Array<{
      id: string;
      name: string;
      description: string;
      supportedRuntimes: string[];
    }>;
  };


  const scrollToSection = (transportId: string) => {
    const element = document.getElementById(transportId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          {platformTools.title}
        </Heading>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          {platformTools.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformTools.transports.map((transport) => (
            <button
              key={transport.id}
              onClick={() => scrollToSection(transport.id)}
              className="border-0 group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-105 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-200">
                  <TransportIcon transportId={transport.id} size={32} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {transport.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {transport.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Core features section */
function CoreFeaturesSection() {
  const features = tArray('coreFeatures.features') as Array<{ icon: string, title: string, description: string }>;

  return (
    <section className="py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          {t('coreFeatures.title')}
        </Heading>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          {t('coreFeatures.description')}
        </p>

        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Final section emphasizing universal deployment */
function RunAnywhereSection() {
  const deploymentTypes = tArray('runAnywhere.deploymentTypes') as Array<{ icon: string, title: string, description: string, features: string[] }>;
  const finalMessage = tObject('runAnywhere.finalMessage') as { icon: string, title: string, description: string };

  return (
    <section className="py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <Heading as="h2" className="text-4xl font-bold mb-6">
          {t('runAnywhere.title')}
        </Heading>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          {t('runAnywhere.description')}
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {deploymentTypes.map((deployment, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">{deployment.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{deployment.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {deployment.description}
              </p>
              <div className="text-sm text-gray-500">
                {deployment.features.map((feature, featureIdx) => (
                  <div key={featureIdx}>✓ {feature}<br /></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-3 md:grid-cols-8 gap-4 items-center justify-items-center mb-8'>
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

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 rounded-xl inline-block">
          <div className="flex items-center justify-center mb-2">
            <span className="mr-2">{finalMessage.icon}</span>
            <strong>{finalMessage.title}</strong>
          </div>
          <p className="text-blue-100">
            {finalMessage.description}
          </p>
        </div>
      </div>
    </section>
  );
}


/** The main Home component that ties everything together. */
export default function Home() {
  const transportSections = [
    { key: 'http', bgColor: 'bg-blue-50 dark:bg-blue-900/30' },
    { key: 'websocket', bgColor: 'bg-green-50 dark:bg-green-900/30' },
    { key: 'sse', bgColor: 'bg-purple-50 dark:bg-purple-900/30' },
    { key: 'queues', bgColor: 'bg-red-50 dark:bg-red-900/30' },
    { key: 'cron', bgColor: 'bg-orange-50 dark:bg-orange-900/30' },
    { key: 'rpc', bgColor: 'bg-indigo-50 dark:bg-indigo-900/30' },
    { key: 'mcp', bgColor: 'bg-pink-50 dark:bg-pink-900/30' },
    // { key: 'cli', bgColor: 'bg-gray-50 dark:bg-gray-900/10' }
  ];

  return (
    <Layout
      title={`${t('hero.title')} - ${t('hero.subtitle')}`}
      description={t('hero.description')}
    >
      <Hero />
      <main>
        {/* <TypeSafetyDemo /> */}
        <PlatformToolsSection />

        <CoreFeaturesSection />

        {/* Transport Sections */}
        {transportSections.map(({ key, bgColor }) => {
          const transport = tObject(`transports.${key}`) as {
            title: string;
            description: string;
            codeSnippet?: string;
            functions?: string;
            wiring?: string;
            client?: string;
            serverCode?: string;
            clientCode?: string;
            supportedRuntimes: string[];
            specialFeatures: string[];
            docsLink: string;
            readMoreText: string;
          };

          return (
            <TransportSection
              key={key}
              id={key}
              title={transport.title}
              description={transport.description}
              codeSnippet={transport.codeSnippet}
              functions={transport.functions}
              wiring={transport.wiring}
              client={transport.client}
              serverCode={transport.serverCode}
              clientCode={transport.clientCode}
              supportedRuntimes={transport.supportedRuntimes}
              specialFeatures={transport.specialFeatures}
              bgColor={bgColor}
              docsLink={transport.docsLink}
              readMoreText={transport.readMoreText}
            />
          );
        })}


        <RunAnywhereSection />
      </main>
    </Layout>
  );
}
