import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { BotIcon, WorkflowIcon } from '../components/WiringIcons';
import {
  RefreshCw, Zap, Shield, DollarSign, Clock, Play,
  Sparkles, Brain, Lock, AlertTriangle, TrendingDown,
  Copy, Check, ArrowRight, Eye,
  CreditCard, FileText, Mail, ShieldCheck, UserCheck,
  Gauge, KeyRound, MessageSquare, Activity,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Reusable helpers
   ───────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">{children}</p>
  );
}

/* ─────────────────────────────────────────────
   1. HERO — The hook
   ───────────────────────────────────────────── */

function Hero() {
  return (
    <div className="wire-hero-dynamic-workflows w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute right-[18%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-amber-500/12 blur-[100px]" />
        <div className="absolute right-[28%] top-[35%] w-44 h-44 rounded-full bg-yellow-400/8 blur-[60px]" />
      </div>

      <header className="flex max-w-screen-xl mx-auto w-full pt-12 pb-10 lg:pt-16 lg:pb-14 px-6 gap-12 items-center">
        <div className="md:w-1/2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 border border-amber-400/40 bg-amber-400/10 px-3 py-1 rounded mb-6">
            Dynamic Workflows
          </span>
          <Heading as="h1" className="font-jakarta text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Every AI agent framework</span><br />
            <span className="text-amber-400">has the same problem.</span>
          </Heading>
          <p className="text-xl font-medium leading-relaxed mb-8 text-neutral-300 max-w-lg">
            They put the AI in the execution loop — every run, every step, every time. Burning tokens, adding latency, and opening security holes. What if you didn't have to?
          </p>
          <div className="flex flex-row gap-4">
            <a href="#the-loop" className="bg-amber-500 text-black hover:bg-amber-400 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-amber-500/20 no-underline">See the Problem</a>
            <a href="#the-approach" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline">Skip to the Solution</a>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/15 rounded-full blur-[50px]" />
            <div className="relative flex items-center gap-4">
              <div className="bg-[#0d0d0d] border-2 border-violet-500/40 rounded-2xl p-5">
                <BotIcon size={64} />
              </div>
              <ArrowRight className="w-8 h-8 text-amber-400" />
              <div className="bg-[#0d0d0d] border-2 border-amber-500/40 rounded-2xl p-5">
                <WorkflowIcon size={64} />
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. THE LOOP — The industry problem
   ───────────────────────────────────────────── */

function TheLoopSection() {
  const pains = [
    {
      icon: <DollarSign className="w-6 h-6 text-amber-400" />,
      title: 'Token cost compounds',
      desc: '10 runs of the same 8-step task = 80 LLM calls. 1,000 runs = 8,000 calls. The bill never flattens — it grows linearly with usage.',
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-400" />,
      title: 'Latency is unavoidable',
      desc: 'Every step waits for an LLM round-trip. A 5-step task takes 8-15 seconds of pure LLM latency. Your users feel every one of those seconds.',
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
      title: 'Security surface grows',
      desc: 'Every LLM call is a chance for prompt injection, hallucinated tool calls, or leaked context. The more the AI runs, the more surface you expose.',
    },
  ];

  return (
    <section id="the-loop" className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>The Status Quo</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            The AI agent loop that <span className="text-amber-400">never stops</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            This is how LangChain, Vercel AI SDK, Mastra, CrewAI, and every other agent framework works. Every single time.
          </p>
        </div>

        {/* Loop visualization — circular diagram */}
        <div className="max-w-lg mx-auto mb-14">
          <div className="relative aspect-square max-w-[400px] mx-auto">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(245,158,11,0.12)" strokeWidth="1.5" strokeDasharray="6 4" />
              <path d="M 200 50 A 150 150 0 1 1 199.9 50" fill="none" stroke="rgba(245,158,11,0.25)" strokeWidth="2" strokeDasharray="8 6">
                <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="20s" repeatCount="indefinite" />
              </path>
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <RefreshCw className="w-8 h-8 text-red-400/50 mx-auto mb-2 animate-spin" style={{ animationDuration: '8s' }} />
              <p className="text-xs font-bold tracking-widest uppercase text-red-400/60">Infinite loop</p>
              <p className="text-[11px] text-neutral-600 mt-1">Every run. Every time.</p>
            </div>

            {[
              { label: 'User request', angle: -90, icon: '1' },
              { label: 'LLM reads context', angle: -18, icon: '2' },
              { label: 'LLM picks tool', angle: 54, icon: '3' },
              { label: 'Tool executes', angle: 126, icon: '4' },
              { label: 'Result → LLM', angle: 198, icon: '5' },
            ].map((step, i) => {
              const rad = (step.angle * Math.PI) / 180;
              const r = 150;
              const x = 200 + r * Math.cos(rad);
              const y = 200 + r * Math.sin(rad);
              const isLoop = i === 4;
              return (
                <div
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(x / 400) * 100}%`, top: `${(y / 400) * 100}%` }}
                >
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    isLoop
                      ? 'bg-red-500/8 border-red-500/25'
                      : 'bg-[#0d0d0d] border-neutral-700/80'
                  }`}>
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isLoop ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {step.icon}
                    </span>
                    <span className={`text-xs font-medium whitespace-nowrap ${isLoop ? 'text-red-400' : 'text-neutral-300'}`}>
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pains.map((pain, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 ">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5">
                {pain.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-jakarta">{pain.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{pain.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-neutral-500 mt-10 max-w-xl mx-auto">
          Even "durable" agent frameworks like Temporal and Inngest just make the loop crash-safe. The AI is still in the loop. The tokens still burn.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. THE QUESTION — The narrative pivot
   ───────────────────────────────────────────── */

function TheQuestionSection() {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-amber-500/6 blur-[100px]" />
      </div>

      <div className="max-w-screen-lg mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          What if the AI only<br />
          had to think <span className="text-amber-400">once</span>?
        </Heading>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          What if, instead of deciding at every step, the AI designed the entire workflow up front — then stepped out of the way?
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. THE APPROACH — Author. Preview. Execute.
   ───────────────────────────────────────────── */

function TheApproachSection() {
  const phases = [
    {
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      step: '1',
      title: 'AI designs the workflow',
      desc: 'You describe what you need in plain English. The agent analyses your request and assembles a workflow from your existing functions — choosing the right steps, the right order, and the right data flow.',
      detail: 'The AI is doing what it\'s best at: reasoning and planning.',
    },
    {
      icon: <Eye className="w-6 h-6 text-amber-400" />,
      step: '2',
      title: 'You preview and approve',
      desc: 'Before anything runs, you see a visual graph of the proposed workflow. Every step, every connection, every function it will call — laid out clearly. You approve, modify, or reject. Nothing executes without your say-so.',
      detail: 'Full transparency. No black-box execution.',
    },
    {
      icon: <Play className="w-6 h-6 text-amber-400" />,
      step: '3',
      title: 'Runs natively — zero AI',
      desc: 'Once approved, the workflow executes as a real durable workflow. No LLM in the loop. Full retry, sleep, and replay guarantees. The workflow is saved — the next time this task comes up, it runs instantly. Zero tokens.',
      detail: 'Same durability as Temporal. No LLM tax.',
    },
  ];

  return (
    <section id="the-approach" className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>The Pikku Approach</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-amber-400">Design.</span>{' '}
            <span className="text-amber-400">Preview.</span>{' '}
            <span className="text-amber-400">Execute.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            The AI designs the workflow. You see exactly what it will do. Then it runs natively — no AI involved.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {phases.map((phase, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-7 relative ">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  {phase.icon}
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-amber-400/60">Step {phase.step}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3 font-jakarta">{phase.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">{phase.desc}</p>
              <p className="text-xs text-amber-400/70 font-medium">{phase.detail}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-12 bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 text-center">
          <p className="text-neutral-300 text-base leading-relaxed">
            <span className="text-amber-400 font-semibold">The AI's job is to think, not to execute.</span> After the first run, the workflow is saved. Every subsequent run costs zero tokens, has zero AI latency, and has zero security surface from LLM decisions.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. THE MATH — Real dollar savings
   ───────────────────────────────────────────── */

function TheMathSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>The Math</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            The loop costs compound.<br />
            <span className="text-amber-400">Pikku's don't.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Real numbers for an 8-step customer onboarding workflow running 50 times per day.
          </p>
        </div>

        {/* Scenario breakdown */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-neutral-800">
              <p className="text-sm text-neutral-400">
                <span className="text-white font-semibold">Scenario:</span> An 8-step onboarding workflow — create account, verify email, setup defaults, add to CRM, send welcome email, schedule follow-up, notify sales, log analytics. Runs 50 times per day using Claude Sonnet.
              </p>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="py-4 px-6 text-xs font-bold tracking-widest uppercase text-neutral-600"></th>
                  <th className="py-4 px-6 text-sm font-semibold text-red-400/80">Traditional (Loop)</th>
                  <th className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-sm font-bold text-amber-400 font-jakarta">Pikku</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'LLM calls per run', traditional: '8 calls (one per step)', pikku: '1 call (design only, first run)' },
                  { label: 'LLM calls per day', traditional: '400 calls', pikku: '0 calls (reuses saved workflow)' },
                  { label: 'LLM calls per month', traditional: '12,000 calls', pikku: '~1 call' },
                  { label: 'Estimated monthly cost', traditional: '~$1,200/mo in tokens', pikku: '~$0.10 (one-time design)' },
                  { label: 'Annual cost', traditional: '~$14,400/yr', pikku: '~$1.20/yr' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-neutral-800/50 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="py-3.5 px-6 text-xs font-bold tracking-wider uppercase text-neutral-500">{row.label}</td>
                    <td className="py-3.5 px-6 text-sm text-red-400/60">{row.traditional}</td>
                    <td className="py-3.5 px-6 text-sm text-amber-300 font-medium">{row.pikku}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-neutral-600 mt-4 text-center">
            Based on Claude Sonnet pricing (~$3/1M input tokens, ~$15/1M output tokens) with average 1,500 tokens per agent step. Actual costs vary by model, prompt size, and provider.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
          {[
            { icon: <TrendingDown className="w-6 h-6 text-amber-400" />, value: '$14,399', label: 'saved per year', desc: 'On a single workflow' },
            { icon: <Zap className="w-6 h-6 text-amber-400" />, value: '~0ms', label: 'AI latency after first run', desc: 'Native execution speed' },
            { icon: <DollarSign className="w-6 h-6 text-amber-400" />, value: '99.99%', label: 'fewer tokens', desc: 'At any scale' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 text-center">
              <div className="flex justify-center mb-3">{item.icon}</div>
              <p className="text-2xl font-bold text-amber-400 font-jakarta">{item.value}</p>
              <p className="text-sm font-semibold text-white mt-1">{item.label}</p>
              <p className="text-xs text-neutral-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-neutral-400 text-sm mt-10 max-w-2xl mx-auto">
          Now multiply that by every workflow your agents run. Onboarding, order processing, support escalation, content pipelines, infrastructure ops — each one running dozens or hundreds of times per day.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6. PERMISSIONS — Your auth carries over
   ───────────────────────────────────────────── */

function PermissionsSection() {
  const points = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      title: 'Your permissions, enforced automatically',
      desc: 'Every function in a dynamic workflow runs with the same role-based permissions you\'ve already defined. If a user can\'t access billing data via your API, the workflow can\'t either. No separate security model to maintain.',
    },
    {
      icon: <UserCheck className="w-6 h-6 text-amber-400" />,
      title: 'Session context flows through',
      desc: 'The user who triggered the workflow carries their session, roles, and context into every step. Your existing middleware — auth checks, rate limits, audit logging — all runs exactly as it would on a normal API call.',
    },
    {
      icon: <KeyRound className="w-6 h-6 text-amber-400" />,
      title: 'No elevated privileges',
      desc: 'In other frameworks, agent tools run with the agent\'s permissions — effectively root access. In Pikku, every workflow step respects the calling user\'s permissions. The AI can\'t escalate what the user can\'t do.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Permissions</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Your existing auth.<br />
            <span className="text-amber-400">Every step. Every workflow.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Most agent frameworks treat security as an afterthought — tools run with full access, and you're left bolting on checks per-tool. Pikku workflows inherit your permissions automatically.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {points.map((point, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 ">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5">
                {point.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-jakarta">{point.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-10 bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
          <p className="text-neutral-300 text-sm leading-relaxed text-center">
            <span className="text-amber-400 font-semibold">This is why "no LLM in the loop" matters for security.</span> When a workflow runs natively, there's no AI making decisions about which tools to call or what data to access. It follows the exact approved graph — with the exact permissions of the user who triggered it.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   7. SECURITY — No LLM in the loop
   ───────────────────────────────────────────── */

function SecuritySection() {
  const points = [
    {
      icon: <Shield className="w-6 h-6 text-amber-400" />,
      title: 'No prompt injection',
      desc: 'The workflow graph is a data structure, not a prompt. Once approved, no user input is sent to an LLM during execution. There\'s nothing to inject into.',
    },
    {
      icon: <Lock className="w-6 h-6 text-amber-400" />,
      title: 'No hallucinated tool calls',
      desc: 'Every step is a real function with real validation. The workflow engine calls exactly what was approved — it can\'t invent new steps, skip steps, or call tools that weren\'t in the graph.',
    },
    {
      icon: <Brain className="w-6 h-6 text-amber-400" />,
      title: 'Deterministic behavior',
      desc: 'Same input, same output, every time. No model temperature. No variance. No "sometimes it works differently." The workflow replays deterministically from its persisted state.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Security</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            No LLM in the loop means<br />
            <span className="text-amber-400">no attack surface.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            In traditional agent frameworks, every execution is a new conversation with an LLM. Every execution is a new opportunity for the model to deviate, hallucinate, or be manipulated.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {points.map((point, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 ">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5">
                {point.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-jakarta">{point.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   8. ADDONS — Supercharge with your stack
   ───────────────────────────────────────────── */

function AddonsSection() {
  const addons = [
    {
      icon: <CreditCard className="w-5 h-5 text-amber-400" />,
      name: 'Stripe',
      desc: 'Charge customers, create subscriptions, issue refunds — all as workflow steps with real billing logic.',
    },
    {
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      name: 'CMS',
      desc: 'Create pages, publish content, manage assets — your content pipeline becomes a workflow the agent can build.',
    },
    {
      icon: <Mail className="w-5 h-5 text-amber-400" />,
      name: 'Email (SendGrid, etc.)',
      desc: 'Send transactional emails, trigger drip sequences, check delivery status — natively inside a workflow.',
    },
    {
      icon: <Gauge className="w-5 h-5 text-amber-400" />,
      name: 'Monitoring',
      desc: 'Check metrics, trigger alerts, scale services — ops workflows that run without human intervention.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Addons</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Your entire stack becomes<br />
            <span className="text-amber-400">workflow steps.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Pikku addons turn third-party services into functions. When an agent builds a dynamic workflow, it can use any addon you've installed — Stripe, your CMS, email providers, monitoring tools. The agent doesn't just call APIs. It orchestrates your entire business.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {addons.map((addon, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 ">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  {addon.icon}
                </div>
                <h3 className="text-base font-bold text-white font-jakarta">{addon.name}</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{addon.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-10 text-center">
          <p className="text-neutral-400 text-sm leading-relaxed">
            Imagine telling your agent: <span className="text-amber-400 font-medium">"When a user signs up, create their Stripe customer, send a welcome email, add them to the CRM, and schedule a follow-up in 3 days."</span> The agent builds that workflow from your existing addons and functions. You approve the graph. It runs natively — forever.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   9. CONSOLE — See everything
   ───────────────────────────────────────────── */

function ConsoleSection() {
  const features = [
    {
      icon: <MessageSquare className="w-5 h-5 text-amber-400" />,
      title: 'Every agent conversation',
      desc: 'See the full chat history for every agent session. What the user asked, what the agent proposed, what was approved or rejected.',
    },
    {
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      title: 'Every workflow run',
      desc: 'Track each workflow execution in real time. Which steps completed, which are pending, which failed and why. Full replay history.',
    },
    {
      icon: <Eye className="w-5 h-5 text-amber-400" />,
      title: 'Visual workflow graphs',
      desc: 'See the exact graph the agent proposed — every step, every connection, every data flow. The same view the user sees when approving.',
    },
    {
      icon: <Shield className="w-5 h-5 text-amber-400" />,
      title: 'Approval audit trail',
      desc: 'Who approved which workflow, when, and what it looked like at the time. Complete audit trail for compliance and debugging.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Pikku Console</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            See every conversation.<br />
            <span className="text-amber-400">Every workflow. Every approval.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            The Pikku Console gives you full visibility into your agents and their workflows. No black boxes. No guesswork. See exactly what's happening, what happened, and what's coming next.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {features.map((feat, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 ">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-white font-jakarta">{feat.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   10. PROMOTE — From runtime to codebase
   ───────────────────────────────────────────── */

function PromoteSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Promote to Code</SectionLabel>
          <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
            Runtime workflows become<br />
            <span className="text-amber-400">version-controlled TypeScript.</span>
          </Heading>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Dynamic workflows don't have to live in the database forever. When a workflow proves itself in production, promote it to your codebase in one command.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* The promotion path */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 mb-12">
            {[
              { label: 'Runtime Graph', desc: 'Agent-created, stored in DB', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
              { label: 'Pikku Graph', desc: 'Pulled into your codebase', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
              { label: 'Pikku DSL', desc: 'Full imperative TypeScript', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
            ].map((stage, i) => (
              <React.Fragment key={i}>
                <div className={`${stage.bg} border rounded-xl px-6 py-4 text-center min-w-[180px]`}>
                  <p className={`text-sm font-bold ${stage.color} font-jakarta`}>{stage.label}</p>
                  <p className="text-xs text-neutral-500 mt-1">{stage.desc}</p>
                </div>
                {i < 2 && <ArrowRight className="w-5 h-5 text-neutral-600 shrink-0 mx-3 hidden md:block" />}
              </React.Fragment>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { title: 'Version control and code review', desc: 'Workflows become pull requests. Review them, comment on them, merge them — like any other code change.' },
              { title: 'CI/CD and automated testing', desc: 'Write tests for promoted workflows. Run them in CI. Catch regressions before they hit production.' },
              { title: 'Full IDE support', desc: 'Type checking, autocomplete, refactoring — all the tooling you expect from TypeScript code.' },
              { title: 'No runtime dependency', desc: 'Once promoted, the workflow runs from your codebase. No dependency on the workflow store or agent that created it.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-[11px] font-bold mt-0.5">&#10003;</span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   11. CTA
   ───────────────────────────────────────────── */

function CTASection() {
  const [copied, setCopied] = React.useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText('npm create pikku@latest');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-amber-500/8 blur-[80px]" />
      </div>
      <div className="max-w-screen-md mx-auto px-6 text-center relative">
        <Heading as="h2" className="font-jakarta text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Stop burning tokens<br />on repeat tasks.
        </Heading>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          Let your AI agents design workflows once. Run them natively forever. Save thousands in token costs, eliminate AI latency, and close the security surface — all while keeping your existing permissions, addons, and infrastructure.
        </p>
        <div className="bg-white/5 border border-white/10 text-white p-4 rounded-xl font-mono text-base max-w-sm mx-auto relative group cursor-pointer hover:bg-white/8 hover:border-amber-500/40 transition-all mb-10" onClick={copyToClipboard}>
          <span className="text-amber-400/70 select-none">$ </span>npm create pikku@latest
          <button className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/10 hover:bg-white/20 rounded p-1.5" onClick={(e) => { e.stopPropagation(); copyToClipboard(); }} title="Copy to clipboard">
            {copied ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5 text-white/70" />}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/docs/wiring/ai-agents" className="bg-amber-500 text-black hover:bg-amber-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/20">Read the Docs</Link>
          <Link to="https://github.com/pikkujs/pikku" className="border border-white/20 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105">View on GitHub</Link>
        </div>
        <p className="text-neutral-500 text-sm mt-8">MIT Licensed &middot; Works with OpenAI, Anthropic &amp; more</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function DynamicWorkflowsPage() {
  return (
    <Layout
      title="Dynamic Workflows — Pikku"
      description="AI agents that design workflows, not just call tools. Pikku agents create durable workflow graphs from your existing functions — then run them natively with zero AI in the loop. No token cost. No latency. No attack surface. Full permissions. Full visibility."
    >
      <Hero />
      <main>
        <TheLoopSection />
        <TheQuestionSection />
        <TheApproachSection />
        <TheMathSection />
        <PermissionsSection />
        <SecuritySection />
        <AddonsSection />
        <ConsoleSection />
        <PromoteSection />
        <CTASection />
      </main>
    </Layout>
  );
}
