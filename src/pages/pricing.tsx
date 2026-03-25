import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { ArrowRight, Check } from 'lucide-react';

const tiers = [
  {
    name: 'Open Source',
    price: 'Free',
    period: 'forever',
    desc: 'The full Pikku framework. Self-host on your own infrastructure.',
    features: [
      'All 12 execution surfaces',
      'Any runtime (Express, Fastify, Lambda, Cloudflare, etc.)',
      'Type-safe clients + OpenAPI generation',
      'Auth, permissions, middleware',
      'MIT licensed',
      'Community support via GitHub + Discord',
    ],
    cta: { label: 'Get started', to: '/getting-started' },
    accent: false,
  },
  {
    name: 'Fabric',
    price: '$20/mo',
    period: '1 machine included, +$10/mo per extra',
    desc: 'Managed hosting. We deploy and run your functions.',
    features: [
      'Everything in Open Source',
      'Managed hosting + zero-config deploys',
      'Cron, queues, and durable workflows on our infra',
      'Environments, branch previews, rollbacks',
      'Observability: traces, logs, error tracking',
      'MCP server included',
      'Priority support',
    ],
    cta: { label: 'Join the waitlist', to: '/#waitlist' },
    accent: true,
    badge: 'Coming soon',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'annual contract',
    desc: 'Dedicated infrastructure, SLAs, and hands-on support.',
    features: [
      'Everything in Fabric',
      'Dedicated infrastructure',
      'SSO / SAML',
      'SLA guarantees',
      'Custom integrations + onboarding',
      'Dedicated support engineer',
    ],
    cta: { label: 'Contact us', to: 'mailto:hello@pikku.dev' },
    accent: false,
  },
];

const faqs = [
  {
    q: 'Can I use Pikku without Fabric?',
    a: 'Yes. Pikku is a fully open-source MIT-licensed framework. You can self-host on Express, Fastify, Lambda, Cloudflare Workers, or any custom runtime. Fabric is the optional managed platform on top.',
  },
  {
    q: 'What does "pay per machine" mean?',
    a: 'You pay for the compute your functions use. Pricing is based on the machines running your functions — not per request or per function. Details will be available at launch.',
  },
  {
    q: 'When does Fabric launch?',
    a: 'Fabric is currently in development. Join the waitlist to get early access and be notified when it\'s ready.',
  },
  {
    q: 'Can I migrate from self-hosted to Fabric?',
    a: 'Yes. Your functions and wirings are the same code. Moving to Fabric means pushing to our platform instead of deploying to your own infra. No rewrites.',
  },
  {
    q: 'What happens if I outgrow the free tier?',
    a: 'The open-source framework has no limits — it runs on your infra. Fabric\'s free tier (when available) will have usage limits. Upgrade to a paid plan when you need more capacity.',
  },
];

export default function PricingPage() {
  return (
    <Layout
      title="Pricing — Pikku"
      description="Pikku is free and open source. Pikku Fabric is a managed platform with pay-per-machine pricing. Enterprise plans available."
    >
      {/* Hero */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Pricing
          </h1>
          <p className="mt-4 text-lg text-white/45 max-w-xl mx-auto">
            Start with the open-source framework for free. Upgrade to Fabric
            when you want managed infrastructure.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((tier, i) => (
              <div
                key={i}
                className={`rounded-xl p-6 flex flex-col ${
                  tier.accent
                    ? 'border-2 border-primary/40 bg-primary/[0.04]'
                    : 'border border-white/[0.06] bg-white/[0.025]'
                }`}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{tier.name}</h2>
                    {tier.badge && (
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                        {tier.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">{tier.price}</p>
                  <p className="text-xs text-white/30 mt-0.5">{tier.period}</p>
                  <p className="text-sm text-white/40 mt-3">{tier.desc}</p>
                </div>

                <div className="space-y-2.5 flex-1">
                  {tier.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2.5 text-sm text-white/55">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Link
                    to={tier.cta.to}
                    className={`block text-center rounded-lg px-5 py-2.5 text-sm font-semibold transition no-underline ${
                      tier.accent
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'border border-white/15 bg-white/5 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {tier.cta.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            Frequently asked questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/[0.06] pb-6">
                <h3 className="text-sm font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
