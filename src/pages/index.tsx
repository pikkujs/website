import React from 'react';
import ReactDOM from 'react-dom';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Image from '@theme/ThemedImage';
import CodeBlock from '@theme/CodeBlock';
import { runtimes } from '@site/data/homepage';
import { WiringIcon } from '../components/WiringIcons';
import { testimonials } from '@site/data/testimonials';
import Card from '../components/Card';
import {
  Zap, ShieldCheck, Plug, RefreshCw, Timer, Database,
  Search, Bot, Key, LayoutDashboard, Link2, Settings,
  Layers, CheckCircle2, Feather, Workflow, Code2,
  Terminal, Package, Blocks, KeyRound, Eye,
} from 'lucide-react';

const DevModeContext = React.createContext<{ devMode: boolean; toggle: () => void }>({ devMode: false, toggle: () => {} });
function useDevMode() { return React.useContext(DevModeContext); }

/** Reusable component for Pikku logo surrounded by icons */
function PikkuCircularLayout({
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

/** Dev mode toggle pill */
function DevModeToggle() {
  const { devMode, toggle } = useDevMode();
  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border"
      style={{
        background: devMode ? 'rgba(168, 99, 238, 0.15)' : 'rgba(255,255,255,0.05)',
        borderColor: devMode ? 'rgba(168, 99, 238, 0.4)' : 'rgba(255,255,255,0.12)',
        color: devMode ? '#a863ee' : 'rgba(255,255,255,0.5)',
      }}
    >
      {devMode ? <Code2 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
      {devMode ? 'Dev Mode' : 'Overview'}
    </button>
  );
}

/** Renders the DevModeToggle into the Docusaurus navbar via portal */
function NavbarDevModeToggle() {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const navRight = document.querySelector('.navbar__items--right');
    if (!navRight) return;

    const el = document.createElement('div');
    el.className = 'navbar__item navbar-dev-toggle';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    navRight.insertBefore(el, navRight.firstChild);
    setContainer(el);

    return () => { el.remove(); };
  }, []);

  if (!container) return null;
  return ReactDOM.createPortal(<DevModeToggle />, container);
}

/* ═══════════════════════════════════════════════════════════════
   SHARED SECTIONS — always visible regardless of mode
   ═══════════════════════════════════════════════════════════════ */

/** Hero Section */
function Hero() {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const protocols = [
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

  const hovered = hoveredIndex !== null ? protocols[hoveredIndex] : null;

  return (
    <div className="hero-section w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-primary/15 blur-[90px]" />
        <div className="absolute right-[12%] top-[40%] w-52 h-52 rounded-full bg-cyan-400/10 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-10 pb-8 lg:pt-12 lg:pb-8 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary border border-primary/40 bg-primary/10 px-3 py-1 rounded">
              TypeScript Function Framework
            </span>
          </div>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">One function.</span><br />
            <span className="text-primary">Every wiring.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-4 text-neutral-300">
            Write your backend logic once. Pikku wires it to HTTP, WebSocket, queues, cron, CLI, AI agents, and more — same auth, same validation, zero rewrites.
          </p>
          <p className="text-sm text-neutral-500 mb-6">
            Like tRPC's type safety, Hono's speed, and NestJS's structure — without choosing between them.
          </p>
          <ul className="text-sm mb-8 space-y-2 text-neutral-300">
            <li className="flex items-start">
              <span className="text-green-400 mr-2 mt-0.5">&#10003;</span>
              <span>One function across HTTP, WebSocket, queues, cron, CLI, and AI agents</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2 mt-0.5">&#10003;</span>
              <span>Deploy to Express, Lambda, Cloudflare — same code, no changes</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2 mt-0.5">&#10003;</span>
              <span>Full TypeScript type safety end-to-end</span>
            </li>
          </ul>
          <div className="flex flex-row gap-4">
            <Link
              to="/getting-started"
              className="button button--primary button--lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
            >
              Build Your First API in 5 Minutes
            </Link>
            <Link
              to="#how-it-works"
              className="button button--secondary button--lg hover:scale-105 transition-transform"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-4 text-sm text-neutral-400 font-mono">
            $ npm create pikku@latest &nbsp;·&nbsp; <span className="text-primary/70">MIT Licensed</span> &nbsp;·&nbsp; <span className="text-primary/70">5-Minute Setup</span>
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
function DeployAnywhereSection() {
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
function ProductionFeaturesSection() {
  const features = [
    { title: 'Type-Safe Clients', desc: 'Auto-generated HTTP, WebSocket, and RPC clients with full IntelliSense.', icon: <Link2 className="w-6 h-6 text-primary" /> },
    { title: 'Auth & Permissions', desc: 'Cookie, bearer, API key auth with fine-grained permissions — built in.', icon: <ShieldCheck className="w-6 h-6 text-primary" /> },
    { title: 'Services', desc: 'Singleton and per-request dependency injection, type-safe and testable.', icon: <Settings className="w-6 h-6 text-primary" /> },
    { title: 'Middleware', desc: 'Before/after hooks for logging, metrics, tracing — work across all protocols.', icon: <Layers className="w-6 h-6 text-primary" /> },
    { title: 'Schema Validation', desc: 'Runtime validation against TypeScript input schemas. Supports Zod.', icon: <CheckCircle2 className="w-6 h-6 text-primary" /> },
    { title: 'Zero Lock-In', desc: 'Standard TypeScript, tiny runtime, MIT licensed. Bring your own everything.', icon: <Feather className="w-6 h-6 text-primary" /> },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-lg mx-auto px-4 text-left md:text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">Built For Production</p>
        <Heading as="h2" className="text-4xl font-bold mb-6">
          Production-grade out of the box
        </Heading>
        <p className="text-lg text-neutral-400 mb-12 md:max-w-2xl md:mx-auto">
          Auth, validation, type-safe clients, middleware — all built in. No bolting on third-party packages for every new protocol.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-start p-6 bg-[#0d0d0d] rounded-xl border border-neutral-800">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Console Section */
function ConsoleSection() {
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
              src="/img/console-screenshot.png"
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
function TestimonialsSection() {
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
function CallToActionSection() {
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

/* ═══════════════════════════════════════════════════════════════
   OVERVIEW-ONLY SECTIONS — clean, visual, benefit-focused
   ═══════════════════════════════════════════════════════════════ */

/** How It Works — 3-step visual, no code */
function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Write your function',
      desc: 'Business logic, permissions, and input types — all in one function. Fix a bug once, it\'s fixed across every protocol.',
      icon: <Terminal className="w-7 h-7" />,
      color: 'text-green-400',
      borderColor: 'border-green-500/20',
      bgGlow: 'bg-green-500/5',
    },
    {
      number: '02',
      title: 'Wire it to any protocol',
      desc: 'Connect it to HTTP, WebSocket, queues, cron, CLI, AI agents, or MCP with a one-liner. Same function, same auth, every transport.',
      icon: <Plug className="w-7 h-7" />,
      color: 'text-primary',
      borderColor: 'border-primary/20',
      bgGlow: 'bg-primary/5',
    },
    {
      number: '03',
      title: 'Deploy anywhere',
      desc: 'Run it on Express, Fastify, Lambda, Cloudflare Workers, or Next.js. Switch runtimes without touching your functions.',
      icon: <Zap className="w-7 h-7" />,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
      bgGlow: 'bg-cyan-500/5',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24">
      <div className="max-w-screen-lg mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-jakarta font-bold text-white leading-tight mb-5">
            Three steps. Zero duplication.
          </h2>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Stop copying business logic across protocols. Write it once and let Pikku handle the rest.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className={`relative ${step.bgGlow} ${step.borderColor} border rounded-2xl p-8`}>
              <div className={`${step.color} mb-6 flex items-center gap-3`}>
                {step.icon}
                <span className="text-xs font-bold tracking-widest uppercase opacity-60">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The Aha — compact code showing the concept */
function AhaSection() {
  const compactCode = `// Write it once
const getCard = pikkuFunc({
  func: async ({ db }, { cardId }) => db.getCard(cardId),
  permissions: { user: isAuthenticated }
})

// Wire it to everything
wireHTTP({ method: 'get', route: '/cards/:cardId', func: getCard })
wireChannel({ name: 'cards', onMessage: { getCard } })
wireQueueWorker({ queue: 'fetch-card', func: getCard })
wireCLI({ program: 'cards', commands: { get: getCard } })`;

  return (
    <section className="py-8 lg:py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">The Concept</p>
          <h2 className="text-3xl md:text-4xl font-jakarta font-bold text-white leading-tight mb-4">
            One function. Four protocols. <span className="text-primary">Zero copy-paste.</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Same auth, same validation, same business logic — just different wirings.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl border border-neutral-700/80 overflow-hidden">
            <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-sm">
              <CodeBlock language="typescript">{compactCode}</CodeBlock>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {['+ SSE', '+ RPC', '+ MCP', '+ AI Agent', '+ Workflow', '+ Trigger'].map((label) => (
              <span key={label} className="px-3 py-1.5 bg-primary/8 border border-primary/20 rounded-full text-xs font-medium text-primary/70">
                {label}
              </span>
            ))}
          </div>
          <p className="text-center text-sm text-neutral-500 mt-4">
            And 7 more protocols — all with the same pattern.{' '}
            <Link to="/features" className="text-primary hover:underline">
              See the full list
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

/** Capabilities — visual grid of what you can wire */
function CapabilitiesSection() {
  const capabilities = [
    { icon: 'http', title: 'HTTP & SSE', desc: 'REST APIs and server-sent events with auto-generated OpenAPI docs.', link: '/wires/http' },
    { icon: 'websocket', title: 'WebSocket', desc: 'Real-time bidirectional communication with typed channels.', link: '/wires/websocket' },
    { icon: 'queue', title: 'Queues', desc: 'Background jobs via BullMQ, PG Boss, or AWS SQS.', link: '/wires/queue' },
    { icon: 'cron', title: 'Scheduled Tasks', desc: 'Cron-like scheduling that works on any runtime.', link: '/wires/cron' },
    { icon: 'rpc', title: 'RPC', desc: 'Call server functions like local functions with full type safety.', link: '/wires/rpc' },
    { icon: 'cli', title: 'CLI', desc: 'Turn functions into command-line tools with argument parsing.', link: '/wires/cli' },
    { icon: 'mcp', title: 'MCP Server', desc: 'Expose functions as Model Context Protocol tools for AI.', link: '/wires/mcp' },
    { icon: 'bot', title: 'AI Agents', desc: 'Your existing functions become agent tools — same auth, no adapters.', link: '/wires/bot', badge: 'Alpha' },
    { icon: 'workflow', title: 'Workflows', desc: 'Multi-step processes with persistence, retries, and sleep.', link: '/wires/workflow' },
    { icon: 'trigger', title: 'Triggers', desc: 'React to external events like webhooks and database changes.', link: '/wires/trigger' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-lg mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">Capabilities</p>
          <h2 className="text-4xl md:text-5xl font-jakarta font-bold text-white leading-tight mb-5">
            11 protocols.<br className="hidden md:block" />
            <span className="text-primary">Same function signature.</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Add a new transport in one line. Auth, validation, and middleware carry over automatically.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap, i) => (
            <Link
              key={i}
              to={cap.link}
              className="group flex items-start gap-4 p-5 bg-[#0d0d0d] border border-neutral-800 rounded-xl hover:border-neutral-600 transition-colors no-underline"
            >
              <div className="flex-shrink-0 mt-0.5">
                <WiringIcon wiringId={cap.icon} size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{cap.title}</h3>
                  {cap.badge && (
                    <span className="inline-block bg-primary/10 border border-primary/30 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                      {cap.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">{cap.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Differentiators — benefit cards for Agents, Workflows, Addons */
function DifferentiatorsSection() {
  const features = [
    {
      icon: <Bot className="w-6 h-6 text-violet-400" />,
      tag: 'AI Agents',
      tagColor: 'text-violet-400',
      badge: 'Alpha',
      title: 'Your functions are already agent tools',
      desc: 'Pass any function as an agent tool. It inherits types, permissions, and middleware automatically. No adapters, no schema re-definitions.',
      benefits: [
        'Zero glue code between functions and agents',
        'Auth and permissions follow the agent automatically',
        'Any LLM provider — just swap the model name',
      ],
      link: '/wires/bot',
      linkText: 'Learn about AI Agents',
    },
    {
      icon: <Workflow className="w-6 h-6 text-emerald-400" />,
      tag: 'Workflows',
      tagColor: 'text-emerald-400',
      title: 'Multi-step processes that survive anything',
      desc: 'Write sequential steps like normal code. Pikku persists each step, retries on failure, and resumes exactly where it left off — even after server restarts.',
      benefits: [
        'Deterministic replay — resume from where it failed',
        'Sleep for hours or weeks without server connections',
        'State persists across server restarts and deploys',
      ],
      link: '/wires/workflow',
      linkText: 'Learn about Workflows',
    },
    {
      icon: <Package className="w-6 h-6 text-orange-400" />,
      tag: 'Addons',
      tagColor: 'text-orange-400',
      title: 'Install a backend feature in one line',
      desc: 'Stripe billing, SendGrid emails — one wireAddon() call each. Fully typed, namespaced RPC calls, sharing your existing database and services.',
      benefits: [
        'Drop-in packages, not bolt-on frameworks',
        'Fully typed across package boundaries',
        'Secrets you control via secretOverrides',
      ],
      link: '/features#addons',
      linkText: 'Learn about Addons',
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-lg mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">Beyond Protocols</p>
          <h2 className="text-4xl md:text-5xl font-jakarta font-bold text-white leading-tight mb-5">
            Agents, workflows, and addons —<br className="hidden md:block" />
            <span className="text-primary">not extra work.</span>
          </h2>
        </div>

        <div className="space-y-6">
          {features.map((feat, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-2xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-4">
                {feat.icon}
                <span className={`text-xs font-bold tracking-widest uppercase ${feat.tagColor}`}>{feat.tag}</span>
                {feat.badge && (
                  <span className="inline-block bg-primary/10 border border-primary/30 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                    {feat.badge}
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">{feat.title}</h3>
              <p className="text-neutral-400 leading-relaxed mb-6 max-w-2xl">{feat.desc}</p>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {feat.benefits.map((benefit, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold mt-0.5">&#10003;</span>
                    <span className="text-sm text-neutral-400">{benefit}</span>
                  </div>
                ))}
              </div>
              <Link to={feat.link} className="text-primary hover:underline font-medium text-sm">
                {feat.linkText} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEV-MODE-ONLY SECTIONS — code-forward, interactive
   ═══════════════════════════════════════════════════════════════ */

/** Before/After — visual contrast showing the problem vs. the Pikku solution */
function BeforeAfterSection() {
  const beforeCode = `// Same logic, copied per protocol
app.get('/cards/:id', auth, validate, async (req, res) => {
  const card = await db.getCard(req.params.id)
  res.json(card)
})
ws.on('getCard', auth, validate, async (msg, socket) => {
  const card = await db.getCard(msg.cardId) // <- again
  socket.send(JSON.stringify(card))
})
// + queue, cron, CLI, RPC, SSE... each drifts.

// --- Workflow? Add Inngest / Temporal ----
inngest.createFunction({ id: 'onboarding' }, ...,
  async ({ step }) => {
    await step.run('create-profile', () => createProfile(id))
    await step.sleep('wait', '5m')
    await step.run('send-welcome', () => sendWelcome(id))
  })
// New SDK, new schema, new deploy pipeline.

// --- AI agent? Add Vercel AI / LangChain -
const tools = { getCard: tool({
  parameters: z.object({ cardId: z.string() }),
  execute: async ({ cardId }) => db.getCard(cardId),
})} // Auth? Permissions? You're on your own.
// Three frameworks. Three auth layers. One backend.`;

  const afterCode = `// With Pikku — write it once
const getCard = pikkuFunc({
  func: async ({ db, audit }, { cardId }) => {
    const card = await db.getCard(cardId)
    await audit.log('getCard', { cardId })
    return card
  },
  permissions: { user: isAuthenticated }
})

// Wire it to anything — same auth, same logic
wireHTTP({ method: 'get', route: '/cards/:cardId', func: getCard })
wireChannel({ name: 'cards', onMessage: { getCard } })
wireQueueWorker({ queue: 'fetch-card', func: getCard })
wireCLI({ program: 'cards', commands: { get: getCard } })

// Workflows just reference your functions
const onboarding = pikkuWorkflowFunc(
  async ({}, { userId }, { workflow }) => {
    await workflow.do('Create profile', 'createProfile', { userId })
    await workflow.sleep('Wait 5 min', '5m')
    await workflow.do('Send welcome', 'sendWelcome', { userId })
  }
)

// AI agents too — same functions, same auth
const support = pikkuAgent({
  tools: [getCard, getOrders, createTicket],
  model: 'claude-sonnet-4-5'
})
// Auth, permissions, and validation carry over. Done.`;

  return (
    <section id="how-it-works" className="py-8 lg:py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">The Difference</p>
          <h2 className="text-3xl md:text-4xl font-jakarta font-bold text-white leading-tight mb-4">
            Four handlers that drift apart — or <span className="text-primary">one function that doesn't.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-semibold text-red-400">Without Pikku</span>
              <span className="ml-auto text-xs text-neutral-600 font-mono">repeated + fragile</span>
            </div>
            <div className="rounded-xl border border-red-500/20 overflow-hidden opacity-70">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-sm">
                <CodeBlock language="typescript">{beforeCode}</CodeBlock>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-400">With Pikku</span>
              <span className="ml-auto text-xs text-neutral-600 font-mono">1 function + wirings</span>
            </div>
            <div className="rounded-xl border border-green-500/20 overflow-hidden">
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0 text-sm">
                <CodeBlock language="typescript">{afterCode}</CodeBlock>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The "Aha!" Moment — interactive circle selector showing each wiring */
function AhaMomentSection() {
  const [activeProtocol, setActiveProtocol] = React.useState<number | null>(0);

  const functionCode = `const getCard = pikkuFunc({
  title: 'Get Card',
  description: 'Retrieve a card by ID',
  func: async ({ db, audit }, { cardId }) => {
    const card = await db.getCard(cardId)
    await audit.log('getCard', { cardId })
    return card
  },
  permissions: { user: isAuthenticated }
})`;

  const wiringExamples = [
    { title: 'HTTP API', icon: 'http', code: `wireHTTP({\n  method: 'get',\n  route: '/cards/:cardId',\n  func: getCard\n})` },
    { title: 'WebSocket', icon: 'websocket', code: `wireChannel({\n  name: 'cards',\n  onConnect: onCardConnect,\n  onDisconnect: onCardDisconnect,\n  onMessageWiring: {\n    action: { getCard }\n  }\n})` },
    { title: 'Server-Sent Events', icon: 'sse', code: `wireHTTP({\n  method: 'get',\n  route: '/cards/:cardId',\n  func: getCard,\n  sse: true\n})` },
    { title: 'Queue Worker', icon: 'queue', code: `// Basic queue\nwireQueueWorker({\n  queue: 'fetch-card',\n  func: getCard\n})\n\n// With options\nwireQueueWorker({\n  queue: 'fetch-card',\n  func: getCard,\n  concurrency: 5,\n  rateLimiter: {\n    max: 10,\n    duration: 1000\n  }\n})` },
    { title: 'Scheduled Task', icon: 'cron', code: `wireScheduler({\n  cron: '0 * * * *',\n  func: getCard\n})` },
    { title: 'RPC Call', icon: 'rpc', code: `// From another function:\nconst card = await rpc.invoke(\n  'getCard',\n  { cardId: '123' }\n)` },
    { title: 'MCP (AI Tools)', icon: 'mcp', code: `wireMCPResource({\n  uri: 'card/{cardId}',\n  func: getCard,\n  tags: ['cards', 'data']\n})` },
    { title: 'CLI', icon: 'cli', code: `wireCLI({\n  program: 'cards',\n  commands: {\n    get: pikkuCLICommand({\n      parameters: '<cardId>',\n      func: getCard\n    }),\n    manage: {\n      subcommands: {\n        get: pikkuCLICommand({\n          parameters: '<cardId>',\n          func: getCard\n        })\n      }\n    }\n  }\n})` },
    { title: 'AI Agent', icon: 'bot', code: `addAIAgent('cardAgent', {\n  name: 'Card Assistant',\n  description: 'Helps users look up cards',\n  instructions: \`You help users manage\ntheir cards. Use the tools\nprovided to look up card info.\`,\n  model: 'claude-3-5-sonnet-20241022',\n  tools: [getCard],\n  maxSteps: 5,\n})` },
    { title: 'Workflow', icon: 'workflow', code: `// Steps never re-execute on replay\nexport const processCardWorkflow = pikkuWorkflowFunc<\n  { cardId: string },\n  { card: Card }\n>(async ({}, { cardId }, { workflow }) => {\n  const card = await workflow.do(\n    'Fetch card',\n    'getCard',\n    { cardId }\n  )\n  await workflow.sleep('Wait', '5s')\n  await workflow.do(\n    'Notify owner',\n    'sendNotification',\n    { cardId: card.id }\n  )\n  return { card }\n})` },
    { title: 'Trigger', icon: 'trigger', code: `wireTrigger({\n  name: 'cardChanged',\n  func: getCard,\n})\n\n// Register the trigger source\nwireTriggerSource({\n  name: 'cardChanged',\n  func: webhookTrigger,\n  input: { secret: process.env.WEBHOOK_SECRET }\n})` },
  ];

  return (
    <section id="code-examples" className="py-8 lg:py-12 overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-6 lg:mb-14">
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Same function. <span className="text-primary">Any transport.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            The function on the left works with every protocol on the right. Same auth, same validation, zero rewrites.
          </p>
        </div>

        <div className="grid md:grid-cols-[5fr_3fr_5fr] gap-8 items-start max-w-6xl mx-auto">
          <div className="w-full min-w-0 lg:max-w-[400px]">
            <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">Write once</p>
            <div className="rounded-xl border border-neutral-700/80 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#0d0d0d] border-b border-neutral-800">
                <span className="text-sm font-semibold text-neutral-200">getCard.ts</span>
                <span className="ml-auto text-xs text-neutral-600 font-mono">func.ts</span>
              </div>
              <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0">
                <CodeBlock language="typescript">{functionCode}</CodeBlock>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[
                'Same auth & permissions across all protocols',
                'One place to fix bugs and add features',
                'Type-safe inputs and outputs everywhere',
              ].map((line, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-neutral-400">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">&#10003;</span>
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center w-full min-w-0 lg:max-w-[400px]">
            <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-1 self-start">Pick a protocol</p>
            <PikkuCircularLayout
              items={wiringExamples}
              renderItem={(example, idx) => {
                const isActive = activeProtocol === idx;
                return (
                  <button
                    onClick={() => setActiveProtocol(idx)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-2 ${
                      isActive
                        ? 'border-primary bg-primary/15 scale-125 shadow-lg shadow-primary/20'
                        : 'border-neutral-800 bg-[#0d0d0d] hover:border-neutral-600 hover:scale-110'
                    }`}
                    title={example.title}
                  >
                    <WiringIcon wiringId={example.icon} size={18} />
                  </button>
                );
              }}
              logoSize={90}
              radius={110}
              minHeight={280}
              centerOverlay={
                activeProtocol !== null ? (
                  <span className="text-xs font-semibold text-neutral-400 tracking-wide">
                    {wiringExamples[activeProtocol].title}
                  </span>
                ) : (
                  <span className="text-xs text-neutral-600">click one</span>
                )
              }
            />
          </div>

          <div className="w-full min-w-0 lg:max-w-[400px]">
            <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">Wiring code</p>
            {activeProtocol !== null && (
              <div className="rounded-xl border border-neutral-700/80 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 bg-[#0d0d0d] border-b border-neutral-800">
                  <WiringIcon wiringId={wiringExamples[activeProtocol].icon} size={15} />
                  <span className="text-sm font-semibold text-neutral-200">{wiringExamples[activeProtocol].title}</span>
                  <span className="ml-auto text-xs text-neutral-600 font-mono">wiring.ts</span>
                </div>
                <div className="[&>div]:!rounded-none [&>div]:!border-0 [&>div]:!m-0">
                  <CodeBlock language="typescript">{wiringExamples[activeProtocol].code}</CodeBlock>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/docs" className="text-primary hover:underline font-medium text-sm">
            Read the full docs →
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Agents Section — full code example with differentiators */
function AgentsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary/80">AI Agents</span>
            <span className="inline-block bg-primary/10 border border-primary/30 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">Alpha</span>
          </div>
          <Heading as="h2" className="text-4xl md:text-5xl font-bold mb-4">
            Your functions are already agent tools
          </Heading>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            No adapters. No schema writing. No separate auth layer. Pass your existing Pikku functions directly — the agent gets your full backend.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <div className="overflow-x-auto">
            <CodeBlock language="typescript" title="src/agents/support.agent.ts">
{`// These already exist in your backend — no changes needed
import { getCustomer, getOrders, createTicket } from './functions'

export const supportAgent = pikkuAgent({
  name: 'support',
  instructions: \`You are a helpful support agent.
Look up the customer's account and recent orders.\`,
  tools: [getCustomer, getOrders, createTicket],
  model: 'claude-sonnet-4-5'
})

// Wire it just like any HTTP endpoint
wireHTTP({
  method: 'post',
  route: '/api/chat',
  func: supportAgent
})`}
            </CodeBlock>
          </div>

          <div className="space-y-6">
            {[
              { icon: <Zap className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Zero glue code', desc: 'Pass any Pikku function as a tool — the agent inherits its type signature, description, and input schema automatically. No adapters, no wrappers, no manual schema definitions.' },
              { icon: <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Auth follows the agent', desc: 'Agents inherit the caller\'s session, permissions, and middleware. The same rules that protect your HTTP endpoints automatically protect every tool the agent can call.' },
              { icon: <Plug className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Any LLM, same interface', desc: 'Bring OpenAI, Anthropic, or any provider. Pikku handles tool calling, streaming, and context — you just swap the model name.' },
            ].map((d, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  {d.icon}
                  <div>
                    <h3 className="text-lg font-bold mb-2">{d.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Link to="/docs/wiring/ai-agents" className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm">
                Read the AI Agents docs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Workflows Section — full code example with differentiators */
function WorkflowsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary/80 block mb-4">Workflows</span>
          <Heading as="h2" className="text-4xl md:text-5xl font-bold mb-4">
            Multi-step processes that<br />survive anything
          </Heading>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Write sequential logic like normal code. Pikku handles persistence, retries, and resumption — even across server restarts.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <div className="space-y-6">
            {[
              { icon: <RefreshCw className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Deterministic replay', desc: 'Completed steps are cached and never re-executed. A workflow that fails on step 4 resumes from step 4 — not from the beginning.' },
              { icon: <Timer className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Sleep for hours, days, or weeks', desc: 'workflow.sleep(\'5min\') suspends execution without holding a server connection. Perfect for trial expirations, reminders, and follow-ups.' },
              { icon: <Database className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Survives restarts', desc: 'State is persisted to PostgreSQL or Redis between steps. Deploy a new version mid-workflow and execution continues from where it left off.' },
            ].map((d, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  {d.icon}
                  <div>
                    <h3 className="text-lg font-bold mb-2">{d.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Link to="/docs/wiring/workflows" className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm">
                Read the Workflows docs →
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <CodeBlock language="typescript" title="src/workflows/onboarding.workflow.ts">
{`export const onboardingWorkflow = pikkuWorkflowFunc(
  async ({ workflow }, { email, userId }) => {
    // Each step is persisted — safe to retry
    const user = await workflow.do(
      'Create user profile',
      'createUserProfile',
      { email, userId }
    )

    await workflow.do(
      'Add to CRM',
      async () => crm.createUser(user)
    )

    // Suspend for 5 minutes — no server held
    await workflow.sleep('Wait before welcome email', '5min')

    await workflow.do(
      'Send welcome email',
      'sendEmail',
      { to: email, template: 'welcome' }
    )

    return { success: true }
  }
)`}
            </CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Addons Section — full code example with differentiators */
function AddonsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary/80 block mb-4">Addons</span>
          <Heading as="h2" className="text-4xl md:text-5xl font-bold mb-4">
            Install a backend feature<br />in one line
          </Heading>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Stripe billing. SendGrid emails. One <code className="text-primary text-lg">wireAddon()</code> call each. Install, configure secrets, call via namespaced RPC — fully typed.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <div className="space-y-4 min-w-0 overflow-hidden">
            <CodeBlock language="typescript" title="src/wiring.ts">
{`// One line per addon
wireAddon({
  name: 'stripe',
  package: '@pikku/addon-stripe'
})
wireAddon({
  name: 'email',
  package: '@pikku/addon-sendgrid',
  secretOverrides: {
    SENDGRID_API_KEY: 'MY_EMAIL_KEY'
  }
})`}
            </CodeBlock>
            <CodeBlock language="typescript" title="src/functions/checkout.func.ts">
{`// Call addon functions via namespaced RPC
const checkout = pikkuFunc({
  func: async ({}, { plan }, { rpc }) => {
    const session = await rpc.invoke(
      'stripe:checkoutCreate',
      { plan, currency: 'usd' }
    )
    await rpc.invoke(
      'email:mailSend',
      { to: session.email, template: 'receipt' }
    )
    return { url: session.url }
  }
})`}
            </CodeBlock>
          </div>

          <div className="space-y-6">
            {[
              { icon: <Package className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Drop-in, not bolt-on', desc: 'Install a package, add one wireAddon() call, and its functions appear as namespaced RPC calls. No glue code, no adapters, no boilerplate.' },
              { icon: <Blocks className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Fully typed across boundaries', desc: 'The CLI generates TypeScript definitions for every addon function. rpc.invoke(\'stripe:checkoutCreate\', ...) is autocompleted with the exact input and output types.' },
              { icon: <KeyRound className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Secrets you control', desc: 'Addons declare what secrets they need. You map them to your own infrastructure with secretOverrides — no env vars leaking across packages.' },
              { icon: <Plug className="w-5 h-5 text-primary mt-0.5 shrink-0" />, title: 'Shared infrastructure', desc: 'Addons reuse your existing logger, database, and services — no duplicate connections. Each addon gets its own namespace, so nothing collides.' },
            ].map((d, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  {d.icon}
                  <div>
                    <h3 className="text-lg font-bold mb-2">{d.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Link to="/docs/addon" className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm">
                Read the Addons docs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE LAYOUT — switches between overview and dev mode
   ═══════════════════════════════════════════════════════════════ */

export default function Home() {
  const [devMode, setDevMode] = React.useState(false);

  return (
    <DevModeContext.Provider value={{ devMode, toggle: () => setDevMode(v => !v) }}>
      <Layout
        title="Pikku - One Function, Every Wiring"
        description="Write backend logic once and wire it to HTTP, WebSockets, queues, cron jobs, AI agents, and more. Deploy anywhere — Express, Lambda, Cloudflare Workers, and beyond."
      >
        <NavbarDevModeToggle />
        <Hero />
        <main>
          {!devMode ? (
            <>
              {/* Overview: visual, benefit-focused, minimal code */}
              <HowItWorksSection />
              <AhaSection />
              <TestimonialsSection />
              <CapabilitiesSection />
              <DifferentiatorsSection />
            </>
          ) : (
            <>
              {/* Dev mode: code-forward, interactive, full examples */}
              <BeforeAfterSection />
              <AhaMomentSection />
              <AgentsSection />
              <WorkflowsSection />
              <AddonsSection />
            </>
          )}
          <DeployAnywhereSection />
          <ProductionFeaturesSection />
          <ConsoleSection />
          {devMode && <TestimonialsSection />}
          <CallToActionSection />
        </main>
      </Layout>
    </DevModeContext.Provider>
  );
}
