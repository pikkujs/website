import React from 'react';
import ReactDOM from 'react-dom';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import Image from '@theme/ThemedImage';
import { runtimes } from '@site/data/homepage';
import { WiringIcon } from './WiringIcons';
import { testimonials } from '@site/data/testimonials';
import {
  Zap, ShieldCheck, Plug, Bot, Key, LayoutDashboard, Link2, Settings,
  Layers, CheckCircle2, Feather, Search, Code2, Eye,
} from 'lucide-react';

/** Reusable component for Pikku logo surrounded by icons */
export function PikkuCircularLayout({
  items,
  renderItem,
  logoSize = 180,
  radius = 180,
  animate = false,
  orbitRotate = false,
  className = '',
  minHeight = 400,
  centerOverlay,
  centerNode,
  showTrack = false,
}: {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  logoSize?: number;
  radius?: number;
  animate?: boolean;
  orbitRotate?: boolean;
  className?: string;
  minHeight?: number;
  centerOverlay?: React.ReactNode;
  centerNode?: React.ReactNode;
  showTrack?: boolean;
}) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ minHeight }}>
      {showTrack && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="rounded-full border border-neutral-700/30"
            style={{ width: radius * 2 + 64, height: radius * 2 + 64 }}
          />
        </div>
      )}

      <div className={`relative z-10 flex flex-col items-center ${animate ? 'animate-chameleon-enter' : ''}`}>
        {centerNode ?? (
          <Image
            sources={{ light: 'img/pikku.png', dark: 'img/pikku.png' }}
            width={logoSize}
            height={logoSize}
            className="mx-auto"
            style={{ objectFit: 'contain' }}
          />
        )}
        {centerOverlay && (
          <div className="mt-2 text-center">{centerOverlay}</div>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`relative ${orbitRotate ? 'animate-orbit-rotate' : ''}`} style={{ width: '100%', height: '100%' }}>
          {items.map((item, index) => {
            const total = items.length;
            const angle = (index * 360) / total;
            const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
            const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

            return (
              <div
                key={index}
                className={`absolute ${animate ? 'animate-icon-fan-out' : ''}`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  ...(animate ? { animationDelay: `${index * 0.08 + 0.3}s` } : {}),
                }}
              >
                <div className={orbitRotate ? 'animate-orbit-counter-rotate' : ''}>
                  {renderItem(item, index)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Navbar toggle pill that links between overview and developer pages */
export function NavbarPageToggle({ isDeveloperPage }: { isDeveloperPage: boolean }) {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const el = document.createElement('div');
    el.className = 'navbar__item navbar-dev-toggle';
    el.style.display = 'flex';
    el.style.alignItems = 'center';

    if (window.innerWidth < 997) {
      // Mobile: insert after logo in left navbar items
      const navLeft = document.querySelector('.navbar__items:not(.navbar__items--right)');
      if (!navLeft) return;
      navLeft.appendChild(el);
    } else {
      // Desktop: insert at start of right navbar items
      const navRight = document.querySelector('.navbar__items--right');
      if (!navRight) return;
      navRight.insertBefore(el, navRight.firstChild);
    }
    setContainer(el);

    return () => { el.remove(); };
  }, []);

  if (!container) return null;
  return ReactDOM.createPortal(
    <Link
      to={isDeveloperPage ? '/' : '/developers'}
      className="no-underline cursor-pointer select-none"
      title={isDeveloperPage ? 'Switch to Overview' : 'Switch to Dev Mode'}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      {/* Track */}
      <div
        style={{
          position: 'relative',
          width: 62,
          height: 38,
          borderRadius: 10,
          background: isDeveloperPage ? 'rgba(168, 99, 238, 0.2)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${isDeveloperPage ? 'rgba(168, 99, 238, 0.3)' : 'rgba(255,255,255,0.1)'}`,
          transition: 'all 0.2s',
        }}
      >
        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: isDeveloperPage ? 30 : 4,
            width: 28,
            height: 28,
            borderRadius: 7,
            background: isDeveloperPage ? '#a863ee' : 'rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          <Code2 style={{ width: 13, height: 13, color: isDeveloperPage ? '#fff' : 'rgba(255,255,255,0.4)' }} />
        </div>
      </div>
    </Link>,
    container
  );
}

export const protocols = [
  { icon: 'http',      label: 'HTTP',       color: '#22c55e', hueRotate: 80,  link: '/wires/http' },
  { icon: 'websocket', label: 'WebSocket',  color: '#a855f7', hueRotate: 240, link: '/wires/websocket' },
  { icon: 'sse',       label: 'SSE',        color: '#f97316', hueRotate: -10, link: null },
  { icon: 'queue',     label: 'Queue',      color: '#ef4444', hueRotate: -40, link: '/wires/queue' },
  { icon: 'cron',      label: 'Cron',       color: '#eab308', hueRotate: 20,  link: '/wires/cron' },
  { icon: 'rpc',       label: 'RPC',        color: '#3b82f6', hueRotate: 180, link: '/wires/rpc' },
  { icon: 'mcp',       label: 'MCP',        color: '#ec4899', hueRotate: 290, link: '/wires/mcp' },
  { icon: 'cli',       label: 'CLI',        color: '#06b6d4', hueRotate: 145, link: '/wires/cli' },
  { icon: 'bot',       label: 'AI Agent',   color: '#8b5cf6', hueRotate: 220, link: '/wires/bot' },
  { icon: 'workflow',  label: 'Workflow',   color: '#10b981', hueRotate: 115, link: '/wires/workflow' },
  { icon: 'trigger',   label: 'Trigger',    color: '#f59e0b', hueRotate: 0,   link: '/wires/trigger' },
];

/** Hero Section — shared between both pages */
export function Hero() {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const hovered = hoveredIndex !== null ? protocols[hoveredIndex] : null;

  return (
    <div className="hero-section w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-primary/15 blur-[90px]" />
        <div className="absolute right-[12%] top-[40%] w-52 h-52 rounded-full bg-cyan-400/10 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-10 pb-8 lg:pt-12 lg:pb-8 px-6 gap-12 items-center">
        <div className="w-full md:w-1/2">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary border border-primary/40 bg-primary/10 px-3 py-1 rounded">
              TypeScript Function Framework
            </span>
          </div>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-6 leading-tight">
            <span className="text-white">One function.</span><br />
            <span className="text-primary">Every wiring.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300">
            Write your backend once. Pikku wires it to HTTP, WebSocket, queues, cron, AI agents, workflows, and more — same auth, same validation, zero rewrites.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/getting-started"
              className="button button--primary button--lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
            >
              Get Started in 5 Minutes
            </Link>
            <Link
              to="#how-it-works"
              className="button button--secondary button--lg hover:scale-105 transition-transform"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-4 text-sm text-neutral-500 font-mono">
            $ npm create pikku@latest &nbsp;·&nbsp; <span className="text-primary/70">MIT Licensed</span> &nbsp;·&nbsp; <span className="text-primary/70">Open Source</span>
          </p>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center flex-col">
          <PikkuCircularLayout
            items={protocols}
            renderItem={(item, index) => {
              const content = (
                <div
                  className="flex flex-col items-center gap-1.5 transition-transform duration-200 hover:scale-110"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <WiringIcon wiringId={item.icon} size={40} />
                  <span className="text-white/50 text-[11px] font-medium tracking-wide">{item.label}</span>
                </div>
              );
              return item.link ? (
                <Link to={item.link} className="no-underline cursor-pointer">{content}</Link>
              ) : (
                <div className="cursor-default">{content}</div>
              );
            }}
            centerNode={
              <div style={{ width: 210, height: 210, position: 'relative' }}>
                <img
                  src="/img/pikku.png"
                  width={210}
                  height={210}
                  alt="Pikku"
                  style={{
                    objectFit: 'contain',
                    position: 'absolute', top: 0, left: 0,
                    opacity: hovered ? 0 : 1,
                    transition: 'opacity 0.35s ease',
                  }}
                />
                <img
                  src="/img/pikku-outline.svg"
                  width={210}
                  height={210}
                  alt=""
                  style={{
                    objectFit: 'contain',
                    position: 'absolute', top: 0, left: 0,
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.35s ease, filter 0.35s ease',
                    filter: hovered
                      ? `brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(${hovered.hueRotate}deg) drop-shadow(0 0 18px ${hovered.color})`
                      : 'none',
                  }}
                />
              </div>
            }
            logoSize={210}
            radius={175}
            animate
            orbitRotate
          />
          <p className="text-white/30 text-xs font-medium tracking-widest uppercase text-center mt-6">
            Like a chameleon adapts — your functions adapt
          </p>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto w-full px-6 pb-8 pt-6">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-white/20 mb-0">
          Built with Pikku
        </p>
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-6">
          {[
            { name: 'AgreeWe',          logo: 'agreewe-dark.png',         url: 'https://www.agreewe.com' },
            { name: 'HeyGermany',       logo: 'heygermany-dark.svg',      url: 'https://hey-germany.com' },
            { name: 'marta',            logo: 'marta-light.svg',          url: 'https://marta.de' },
            { name: 'BambooRose',       logo: 'bamboorose-dark.png',      url: 'https://bamboorose.com' },
            { name: 'Calligraphy Cut',  logo: 'calligraphycut-dark.svg',  url: 'https://calligraphy-cut.com' },
          ].map((company) => (
            <Link
              key={company.name}
              href={company.url}
              className="flex items-center justify-center px-4 py-3 rounded-lg opacity-55 hover:opacity-80 transition-opacity"
              title={company.name}
            >
              <img
                src={`img/logos/${company.logo}`}
                alt={company.name}
                width={120}
                height={40}
                loading="lazy"
                className="object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Deploy Anywhere */
export function DeployAnywhereSection() {
  const allRuntimes = [...runtimes.cloud, ...runtimes.middleware, runtimes.custom];
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <span className="text-xs font-semibold tracking-widest uppercase text-primary/80 block mb-4">Deploy Anywhere</span>
        <Heading as="h2" className="text-4xl md:text-5xl font-bold mb-4">
          Change your runtime.<br />Keep your functions.
        </Heading>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-12">
          Same code runs on Express, Fastify, AWS Lambda, Cloudflare Workers, Next.js, and more. Switching runtimes never requires touching your functions.
        </p>

        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {allRuntimes.map((runtime, idx) => (
            <Link
              key={idx}
              to={runtime.docs}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-[#0d0d0d] border border-neutral-800 rounded-lg hover:border-neutral-600 transition-colors duration-200 no-underline"
              title={`Deploy to ${runtime.name}`}
            >
              <Image
                width={20}
                height={20}
                className="flex-shrink-0"
                sources={{
                  light: `img/logos/${runtime.img.light}`,
                  dark: `img/logos/${runtime.img.dark}`
                }}
              />
              <span className="text-sm font-medium text-neutral-300">{runtime.name}</span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-sm text-neutral-500">
          Plus any custom runtime via the adapter interface.{' '}
          <Link to="/docs/custom-runtimes/custom-http-runtime" className="text-primary hover:underline">
            Build your own →
          </Link>
        </p>
      </div>
    </section>
  );
}

/** Production Features */
export function ProductionFeaturesSection() {
  const features = [
    { title: 'Type-Safe Clients', desc: 'Auto-generated HTTP, WebSocket, and RPC clients with full IntelliSense.', icon: <Link2 className="w-5 h-5" />, accent: 'from-blue-500/20 to-transparent', iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { title: 'Auth & Permissions', desc: 'Cookie, bearer, API key auth with fine-grained permissions — built in.', icon: <ShieldCheck className="w-5 h-5" />, accent: 'from-emerald-500/20 to-transparent', iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { title: 'Services', desc: 'Singleton and per-request dependency injection, type-safe and testable.', icon: <Settings className="w-5 h-5" />, accent: 'from-violet-500/20 to-transparent', iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
    { title: 'Middleware', desc: 'Before/after hooks for logging, metrics, tracing — work across all protocols.', icon: <Layers className="w-5 h-5" />, accent: 'from-amber-500/20 to-transparent', iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { title: 'Schema Validation', desc: 'Runtime validation against TypeScript input schemas. Supports Zod.', icon: <CheckCircle2 className="w-5 h-5" />, accent: 'from-cyan-500/20 to-transparent', iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    { title: 'Zero Lock-In', desc: 'Standard TypeScript, tiny runtime, MIT licensed. Bring your own everything.', icon: <Feather className="w-5 h-5" />, accent: 'from-rose-500/20 to-transparent', iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-lg mx-auto px-4 text-left md:text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">Built For Production</p>
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Production-grade out of the box
        </Heading>
        <p className="text-lg text-neutral-400 mb-6 md:max-w-2xl md:mx-auto">
          Auth, validation, type-safe clients, middleware — all built in. No bolting on third-party packages for every new protocol.
        </p>
        <p className="text-sm text-neutral-500 mb-12 md:max-w-2xl md:mx-auto">
          MIT licensed. Standard TypeScript. No VC-backed lock-in.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feature, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-[#0d0d0d] p-6 text-left transition-colors hover:border-neutral-700">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border ${feature.iconBg} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Console Section */
export function ConsoleSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary/80">Visual Control Plane</span>
            <span className="inline-block bg-primary/10 border border-primary/30 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">Alpha</span>
          </div>
          <Heading as="h2" className="text-4xl md:text-5xl font-bold mb-4">
            Every function, every wire,<br />every secret — one screen
          </Heading>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Browse functions, run agents, manage secrets, and trigger workflows — without writing tooling code.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto mb-10">
          <div className="rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
            <img
              src="/img/console-screenshot.webp" loading="lazy"
              alt="Pikku Console — browse and inspect all functions, wirings, and services"
              className="w-full block"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent rounded-b-xl pointer-events-none" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {[
            { icon: <Search className="w-3.5 h-3.5" />, label: 'Browse all functions & wirings' },
            { icon: <Bot className="w-3.5 h-3.5" />, label: 'Agent playground' },
            { icon: <Zap className="w-3.5 h-3.5" />, label: 'Run & visualize workflows' },
            { icon: <Key className="w-3.5 h-3.5" />, label: 'Manage secrets & variables' },
            { icon: <LayoutDashboard className="w-3.5 h-3.5" />, label: 'Per-environment control' },
          ].map((pill, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d0d0d] border border-neutral-800 rounded-full text-sm text-neutral-300">
              {pill.icon}
              {pill.label}
            </span>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link to="/features#console" className="text-primary hover:underline font-medium text-sm">
            Learn about the Console →
          </Link>
        </div>
      </div>
    </section>
  );
}

/** What Developers Say */
export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="text-center mb-12">
          <Heading as="h2" className="text-3xl font-bold mb-3">
            Built for the problems developers actually have
          </Heading>
          <p className="text-neutral-500 text-base">From the teams who switched</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6">
              <p className="text-neutral-300 mb-4 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="text-sm">
                <p className="font-semibold text-neutral-100">{testimonial.author}</p>
                <p className="text-neutral-500">
                  {testimonial.role}{testimonial.company ? ` @ ${testimonial.company}` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Call to Action */
export function CallToActionSection() {
  const copyToClipboard = () => {
    navigator.clipboard.writeText('npm create pikku@latest');
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-[80px]" />
      </div>
      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Stop copying functions across protocols.
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          Write it once. Pikku wires it everywhere.
        </p>

        <div
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-primary/40 transition-all mb-10"
          onClick={copyToClipboard}
        >
          <span className="text-primary/70 select-none">$ </span>npm create pikku@latest
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5"
            onClick={copyToClipboard}
            title="Copy to clipboard"
          >
            <svg className="w-3.5 h-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/getting-started"
            className="bg-primary text-white hover:bg-primary-dark px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-primary/20"
          >
            Build Your First API in 5 Minutes
          </Link>
          <Link
            to="https://github.com/pikkujs/pikku"
            className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            View on GitHub
          </Link>
        </div>
        <p className="text-neutral-500 text-sm mt-6 font-medium">5-minute setup &nbsp;·&nbsp; MIT Licensed &nbsp;·&nbsp; Open Source</p>
      </div>
    </section>
  );
}
