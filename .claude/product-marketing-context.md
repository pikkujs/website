# Pikku — Product Marketing Context

*Last updated: 2026-03-07*

## Product Overview
**One-liner:** Write your TypeScript backend once. Wire it to every protocol.
**What it does:** Pikku is an open-source TypeScript function framework. You write backend logic once as a plain function, then "wire" that function to any protocol — HTTP, WebSocket, SSE, queues, cron, CLI, RPC, MCP, AI agents, workflows, and triggers. Same auth, same validation, same middleware, zero rewrites.
**Product category:** TypeScript backend framework
**Product type:** Open-source framework (MIT licensed)
**Business model:** Open-source with potential commercial offerings (Console)

## Core Value Proposition
Eliminate the copy-paste-drift cycle. Instead of writing separate handlers for each protocol (that slowly diverge), write one function and declaratively wire it to anything. This isn't just a router — it's agents, workflows, and installable backend features, all using the same functions.

## Target Audience
**Primary:** Backend TypeScript developers building multi-protocol services (startups, scale-ups)
**Secondary:** Full-stack developers tired of rewriting the same logic for HTTP, WebSocket, queues, etc.
**Tertiary:** Teams evaluating tRPC, Hono, or NestJS who want more flexibility

**Jobs to be done:**
- Ship a backend that serves multiple protocols without maintaining separate handlers
- Add AI agents or workflows without adopting a separate framework
- Switch infrastructure (Express to Lambda, Cloudflare to container) without rewriting business logic

## Problems & Pain Points
**Core problem:** Same business logic lives in 5+ handlers that slowly drift apart. Fix a bug in one, forget the others.

**Three root causes:**
1. **Copy-paste drift** — HTTP, WebSocket, queue, CLI, SSE handlers start as copies but diverge. Auth gets fixed in one place, not the others. Bugs multiply in silence.
2. **New protocol = new framework** — Want AI agents? That's Vercel AI SDK. Workflows? Inngest or Temporal. MCP? Another adapter. Each brings its own auth layer, schema format, and deploy pipeline.
3. **Infrastructure lock-in** — Going from Express to Lambda, or Cloudflare to a container, touches every handler. Business logic is tangled with framework APIs.

**What it costs them:** Duplicated effort, divergent behavior across protocols, slower feature velocity, more bugs
**Emotional tension:** "I know this code is duplicated but I don't have time to fix it properly"

## Competitive Landscape
**Direct:**
- **tRPC** — HTTP RPC only, no protocol flexibility beyond that
- **Hono** — Fast HTTP router, but protocol-agnostic it is not
- **NestJS** — Heavy decorator/DI magic, opinionated structure, steep learning curve

**Secondary (different solution, same problem):**
- **Vercel AI SDK** — For AI agents only, separate from your backend
- **Inngest / Temporal** — For workflows only, new SDK + new deploy pipeline
- **LangChain** — AI tooling that doesn't share your existing backend auth/functions

**Indirect:**
- Manual copy-paste across handlers (the status quo)
- Microservices with shared libraries (complex, brittle)

## Key Differentiators
1. **Protocol-agnostic functions**: One function works across all 12 protocols — not just HTTP
2. **Auth carries everywhere**: Permissions, sessions, middleware apply uniformly across all wirings
3. **AI agents built-in**: Your existing functions become agent tools — no adapters, no schema re-writing, auth carries over
4. **Durable workflows built-in**: Multi-step processes with persistence, retries, sleep — no separate engine
5. **Addons**: Install backend features (Stripe, SendGrid) with one `wireAddon()` call — fully typed
6. **Deploy anywhere**: Same code on Express, Fastify, Lambda, Cloudflare, Next.js, uWS
7. **Type-safe end-to-end**: Auto-generated clients with full IntelliSense
8. **Zero lock-in**: Standard TypeScript, tiny runtime, MIT licensed

**Why customers choose Pikku:** They've hit the wall with duplicated handlers and don't want to adopt 3 different frameworks for agents, workflows, and protocols. Pikku lets them keep writing plain functions.

## Messaging Hierarchy
**Level 1 (5 seconds):** One function. Every wiring.
**Level 2 (30 seconds):** Write your backend once. Pikku wires it to HTTP, WebSocket, queues, cron, AI agents, workflows, and more — same auth, same validation, zero rewrites.
**Level 3 (2 minutes):** Pain framing (copy-paste-drift) → Before/after code → Agents/workflows/addons aren't extra work → Deploy anywhere

**Key emphasis for overview/marketing pages:** Agents, workflows, and addons should be prominently featured — these are the "more than a router" differentiators that separate Pikku from tRPC/Hono/Express.

## Switching Dynamics (Four Forces)
**Push (away from current):** Duplicated code, drifting handlers, bug in one protocol but not others, new protocol requires new framework
**Pull (toward Pikku):** Write once/wire everywhere, agents and workflows built-in, deploy anywhere, type safety
**Habit (keeps them stuck):** Existing codebase in Express/NestJS, team familiarity, "it works well enough"
**Anxiety (about switching):** "Is this too magic?", "Will it scale?", "Is it production-ready?", "What if the project dies?"

## Objections
| Objection | Response |
|-----------|----------|
| "Is this production-ready?" | Used in production by 5 companies (AgreeWe, marta, BambooRose, etc.) |
| "Isn't pikkuFunc() still framework code?" | It's a thin wrapper — your logic is a plain TypeScript function. No decorators, no magic. |
| "What if I only need HTTP?" | Start with HTTP. Add protocols later without touching your functions. Zero upfront cost. |
| "How is this different from NestJS?" | Plain functions, not classes with decorators. No DI container. No magic — just functions and wirings. |

**Anti-persona:** Teams that only need a simple HTTP API and will never add other protocols. Teams deeply invested in NestJS decorators pattern.

## Customer Language
**How they describe the problem:**
- "So many places in my code base have like three entry points: CLI, public HTTP API and internally from within the API"
- "With Nest it's a pain because you basically have to start the whole API up just to run a CLI command"
- "Would be so nice having everything just an invoke away"

**How they describe Pikku:**
- "You write your business logic once and then wire it to whatever transport you need"
- "Like tRPC but for everything, not just HTTP"

**Words to use:** wire, function, protocol, transport, deploy, type-safe, built-in
**Words to avoid:** framework boilerplate (dishonest — pikkuFunc is framework code), revolutionary, game-changing, seamless

## Voice & Tone
**Tone:** Professional but friendly
**Style:** Technical but accessible — show, don't lecture. Developer-to-developer.
**Personality:** Confident, honest, concise, practical
**Rules:** Never fabricate statistics. Don't claim "no framework boilerplate." Respect the reader's intelligence.

## Proof Points
**Production users:** AgreeWe, HeyGermany, marta, BambooRose, Calligraphy Cut
**Testimonials:**
> "So many places in my code base have like three entry points: CLI, public HTTP API and internally from within the API. Would be so nice having everything just an invoke away. With Nest it's a pain because you basically have to start the whole API up just to run CLI command." — Alex Harley, CTO @ Bamboo Rose
**Open source:** MIT licensed, GitHub at pikkujs/pikku

## Primary CTA
`npm create pikku@latest` → Getting Started guide

## Website Structure
- **Overview homepage** (`/`): Marketing-focused, pain→solution→differentiators flow
- **Developer homepage** (`/developers`): Code-forward, interactive examples, full API showcase
- **Toggle in navbar** links between the two pages
- Feature/capability pages: `/features`, `/wires/http`, `/wires/bot`, etc.
- Documentation: `/docs`
- Homepage CTAs should point to `/getting-started` and `/features`, not `/docs`

## Brand
- Mascot: Chameleon (adapts to any protocol, like functions adapt)
- Primary color: Electric purple (#a863ee)
- Dark theme site
