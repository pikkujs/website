import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import Image from '@theme/ThemedImage';
import { protocolDeployments } from '@site/data/deployments';
import type { WireProduct } from '@site/data/wire-products';
import { WiringIcon } from './WiringIcons';

interface WireProductPageProps {
  product: WireProduct;
}

export default function WireProductPage({ product }: WireProductPageProps) {
  const deployments = product.deploymentKey
    ? protocolDeployments[product.deploymentKey]
    : undefined;
  const primaryCapabilities = product.capabilities.slice(0, 4);
  const glanceItems = [
    `${product.name} wiring`,
    'Shared auth + permissions',
    'Inspector-visible metadata',
  ];

  return (
    <Layout
      title={`${product.name} | Pikku Next`}
      description={`${product.name} wiring in Pikku Next: ${product.subheadline}`}
    >
      <main className="wire-page">
        <section className="wire-hero py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <Link to="/" className="text-sm text-primary hover:underline wire-back-link">
              ← Back to Homepage
            </Link>
            <div className="mt-5 grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <div className="wire-tag">
                  <WiringIcon wiringId={product.icon} size={16} />
                  {product.label}
                </div>
                <Heading as="h1" className="wire-title">
                  {product.headline}
                </Heading>
                <p className="wire-subtitle">
                  {product.subheadline}
                </p>
                <div className="wire-glance">
                  {glanceItems.map((item) => (
                    <span key={item} className="wire-glance-chip">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="wire-description">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to={product.docsPath} className="button button--primary button--lg">
                    Read {product.name} Docs
                  </Link>
                  <Link to="/docs" className="button button--secondary button--lg">
                    Get Started
                  </Link>
                </div>
              </div>
              <div className="wire-panel">
                <p className="wire-panel-eyebrow">
                  What this surface unlocks
                </p>
                <ul className="space-y-3">
                  {product.outcomes.map((outcome) => (
                    <li key={outcome} className="wire-list-item">
                      <span className="wire-list-dot" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="wire-section py-14">
          <div className="max-w-screen-xl mx-auto px-4">
            <Heading as="h2" className="wire-section-title">
              How it works
            </Heading>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="wire-code-card">
                <Heading as="h3" className="text-xl font-semibold mb-3 wire-step-title">
                  1. Define
                </Heading>
                <CodeBlock language="typescript">{product.defineCode}</CodeBlock>
              </div>
              <div className="wire-code-card">
                <Heading as="h3" className="text-xl font-semibold mb-3 wire-step-title">
                  2. Wire
                </Heading>
                <CodeBlock language="typescript">{product.wireCode}</CodeBlock>
              </div>
            </div>
          </div>
        </section>

        <section className="wire-section wire-section-muted py-14">
          <div className="max-w-screen-xl mx-auto px-4">
            <Heading as="h2" className="wire-section-title">
              Core capabilities
            </Heading>
            <div className="grid md:grid-cols-2 gap-4">
              {primaryCapabilities.map((capability, index) => (
                <div
                  key={capability}
                  className="wire-capability-card"
                >
                  <span className="wire-capability-index">
                    0{index + 1}
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{capability}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {deployments && (
          <section className="wire-section py-14">
            <div className="max-w-screen-xl mx-auto px-4">
              <Heading as="h2" className="wire-section-title">
                Deploy {product.name} Anywhere
              </Heading>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {Object.values(deployments).map((deployment) => (
                  <div
                    key={deployment.name}
                    className="wire-runtime-card"
                  >
                    <Image
                      sources={{
                        light: `img/logos/${deployment.img.light}`,
                        dark: `img/logos/${deployment.img.dark}`,
                      }}
                      width={42}
                      height={42}
                    />
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 text-center">
                      {deployment.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="wire-section py-16">
          <div className="max-w-screen-lg mx-auto px-4 text-center">
            <div className="wire-cta">
              <Heading as="h2" className="text-3xl font-bold mb-3">
                Build {product.name} on the same function foundation
              </Heading>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Keep one backend model and expand to every surface when you need it.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to={product.docsPath} className="button button--primary button--lg">
                  Go to {product.name} Docs
                </Link>
                <Link to="/" className="button button--secondary button--lg">
                  Explore All Surfaces
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
