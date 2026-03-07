# Pikku — Product Marketing Context

## What It Is
Pikku is an open-source TypeScript function framework. You write backend logic once as a plain function, then "wire" that function to any protocol — HTTP, WebSocket, SSE, queues, cron, CLI, RPC, MCP, AI agents, workflows, and triggers. Same auth, same validation, same middleware, zero rewrites.

## One-Liner
Write your TypeScript backend once. Wire it to every protocol.

## Core Value Proposition
Eliminate the copy-paste-drift cycle. Instead of writing separate handlers for each protocol (that slowly diverge), write one function and declaratively wire it to anything.

## Target Audience
- **Primary**: Backend TypeScript developers building multi-protocol services (startups, scale-ups)
- **Secondary**: Full-stack developers tired of rewriting the same logic for HTTP, WebSocket, queues, etc.
- **Tertiary**: Teams evaluating tRPC, Hono, or NestJS who want more flexibility

## Key Pain Points
1. Same business logic copied across HTTP, WebSocket, queue, CLI handlers — they drift apart
2. Adding a new protocol (AI agent, MCP, workflow) means a new framework, new auth layer, new glue code
3. Switching infrastructure (Express → Lambda, Cloudflare → container) requires rewriting every handler

## Key Differentiators
1. **Protocol-agnostic functions**: One function works across all 11 protocols
2. **Auth carries everywhere**: Permissions, sessions, middleware apply uniformly
3. **Deploy anywhere**: Same code on Express, Fastify, Lambda, Cloudflare, Next.js, uWS
4. **AI agents & workflows built-in**: Your existing functions become agent tools and workflow steps — no adapters
5. **Addons**: Install backend features (Stripe, SendGrid) with one `wireAddon()` call
6. **Type-safe end-to-end**: Auto-generated clients with full IntelliSense
7. **Zero lock-in**: Standard TypeScript, tiny runtime, MIT licensed

## How It Works (Conceptual)
1. **Write** a function with `pikkuFunc()` — define logic, permissions, types
2. **Wire** it to any protocol with `wireHTTP()`, `wireChannel()`, `wireCLI()`, etc.
3. **Deploy** to any runtime — Express, Lambda, Cloudflare, etc. — same function, different host

## Proof Points
- Used in production by AgreeWe, HeyGermany, marta, BambooRose, Calligraphy Cut
- 2 developer testimonials (CTOs/co-founders)
- Open source, MIT licensed

## Competitive Positioning
- **vs tRPC**: Pikku adds protocol flexibility beyond just HTTP RPC
- **vs Hono**: Pikku is protocol-agnostic, not just a fast HTTP router
- **vs NestJS**: Pikku uses plain functions, not decorators/DI magic

## Voice & Tone
- Professional but friendly
- Technical but accessible — show, don't lecture
- Confident, not hype-y
- Developer-to-developer — respect the reader's intelligence

## Primary CTA
`npm create pikku@latest` → Getting Started guide

## Internal Links
- Feature/capability pages use `/features` not `/docs` (e.g. `/features`, `/wires/http`)
- Documentation lives under `/docs`
- Homepage CTAs should point to `/getting-started` and `/features`, not `/docs`

## Brand
- Mascot: Chameleon (adapts to any protocol, like functions adapt)
- Primary color: Electric purple (#a863ee)
- Dark theme site
