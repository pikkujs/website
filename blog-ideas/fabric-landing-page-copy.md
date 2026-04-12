# Pikku Fabric -- Landing Page Copy

---

## 1. Hero

**Headline:**
Push functions. Get a running backend.

**Subheadline:**
Pikku Fabric is a hosted platform. You write TypeScript functions with typed inputs, outputs, and permissions. You tell Fabric where each one should run -- as an API endpoint, a cron job, a queue worker, a CLI command, an AI tool. Then you push. Fabric gives you a live backend: hosted, authenticated, monitored, documented, and scaling.

**CTA:**
Start free -- no credit card, deploy in under 5 minutes.

**Secondary CTA:**
See how it works

---

## 2. Problem Statement

**Heading:** You know this setup.

You set up Express for your API. Bull for your queues. A cron library for scheduled jobs. A separate CLI entry point. You write OpenAPI specs by hand, or bolt on a generator that falls out of sync. Auth is different for each surface -- bearer tokens on the API, API keys for the queue dashboard, nothing on the CLI. When someone asks for observability, you add three more libraries. When the AI team wants tool access, you build another wrapper.

Every piece works on its own. But nothing is connected. Permissions don't carry over. Types don't flow through. You spend more time on plumbing than on the thing your code actually does.

This is how most backend teams operate. It doesn't have to be.

---

## 3. The Pitch

**Heading:** Write it once. Run it everywhere.

With Pikku Fabric, you write a function. You define its inputs, its outputs, and who's allowed to call it. Then you tell Fabric where it should run: as an HTTP endpoint, a scheduled job, a background queue worker, a CLI command, a WebSocket channel, an AI-callable tool, or all of the above.

One function. Same logic. Same auth. Same types. Fabric handles hosting, routing, scheduling, queue processing, authentication enforcement, OpenAPI documentation, client generation, logging, tracing, and scaling. You push code. You get a backend.

---

## 4. What You Get

**Heading:** One deploy. All of this running.

After a single `git push fabric main`, here is what's live:

- **A REST API** at `https://api.yourapp.dev/v1` -- with typed endpoints, request validation, and auto-generated OpenAPI docs
- **A WebSocket server** at `wss://ws.yourapp.dev` -- with typed messages, session management, and reconnection handling
- **Cron jobs** running on schedule -- "every Monday at 9am," "every 5 minutes," whatever you defined
- **Queue workers** processing background jobs -- with retries, dead-letter queues, and delivery guarantees
- **Durable workflows** -- multi-step processes that survive restarts, with built-in retry and sleep
- **A CLI tool** with help text, argument parsing, and autocomplete -- auto-generated from your functions
- **MCP tools** -- your functions available as tools inside Claude, Cursor, VS Code, or any MCP-compatible editor
- **AI agent tools** -- the same functions callable by LLMs, with the same auth and permissions as your API
- **Type-safe clients** for HTTP, WebSocket, and RPC -- auto-generated and updated on every deploy
- **A dashboard** at `https://fabric.pikku.dev/yourapp` -- with traces, structured logs, error tracking, and per-function metrics
- **Environments** -- dev, staging, production, and branch-based preview deploys with one command

Everything uses the same auth. Everything shares the same types. Everything is observable from the same dashboard.

---

## 5. How It Works

**Heading:** Write. Wire. Push.

### Step 1: Write a function

You write a plain TypeScript function. It receives services (database, email, whatever you configure) and typed input. You define who can call it.

```typescript
export const createInvoice = pikkuFunc({
  func: async ({ db, email }, { orderId, amount }) => {
    const invoice = await db.invoices.create({ orderId, amount })
    await email.send({ to: invoice.customer, template: 'invoice-created' })
    return invoice
  },
  permissions: { user: isAuthenticated },
})
```

This is your business logic. It doesn't know or care whether it's called from an API, a queue, a cron job, or an AI agent. It just does one thing.

### Step 2: Wire it to surfaces

You decide where this function runs. One line per surface.

```typescript
wireHTTP({ method: 'post', route: '/invoices', func: createInvoice })
wireScheduler({ schedule: '0 9 * * 1', func: createInvoice })
wireQueueWorker({ queue: 'billing', func: createInvoice })
wireCLI({ program: 'billing', commands: { invoice: createInvoice } })
wireBotTool({ func: createInvoice })
```

Same function. Five different ways to trigger it. Same auth rules apply everywhere.

### Step 3: Push to Fabric

```
$ git push fabric main

  Deploying to production...

  API live        https://api.acme.dev/v1
  Cron active     Mon 09:00
  Queue running   billing.createInvoice
  CLI published   pikku billing invoice
  AI tool live    createInvoice

  Dashboard       https://fabric.pikku.dev/acme
  Deployed in 4.2s
```

That is it. Everything is running, authenticated, monitored, and scaling. You write code, Fabric runs infrastructure.

---

## 6. You vs. Fabric

**Heading:** You write code. We run infrastructure.

### What you write:

- Business logic as typed functions
- Permission rules (who can call what)
- Which surfaces each function runs on (HTTP, cron, queue, CLI, AI, etc.)
- Service dependencies (database, email, storage -- whatever your functions need)

### What Fabric handles:

- Hosting and running your functions
- HTTP routing, WebSocket channels, queue consumers
- Cron scheduling and execution
- Auth enforcement across every surface -- same rules, everywhere
- OpenAPI spec generation -- always accurate, always current
- Type-safe client generation -- updated on every deploy
- Structured logs, distributed traces, error tracking
- Environments: dev, staging, production, branch previews
- MCP server -- your functions as tools in any AI-enabled IDE
- Scaling up when traffic spikes, scaling down when it's quiet
- Rollbacks if something goes wrong

You maintain a folder of TypeScript functions. Fabric maintains everything else.

---

## 7. CTA

**Heading:** Deploy your first function in 5 minutes.

You don't need to migrate anything. Start with one function. Wire it to one surface. Push it to Fabric and see it running. If it works for you, wire more. If it doesn't, you've lost five minutes.

```
$ npx pikku deploy
```

Free tier. No credit card. Upgrade when you're ready.

**Primary CTA:** Start free
**Secondary CTA:** Read the docs

---

## Notes on Tone and Approach

**What this copy avoids:**
- The word "revolutionary," "supercharge," "unleash," "seamless," or "game-changing"
- Abstract claims without concrete outputs
- Jargon that assumes Pikku context ("surfaces," "wirings" used only after being explained)
- Exclamation points
- Hype about AI that doesn't connect to a real workflow

**What this copy does:**
- Opens with a problem the reader already has but hasn't named
- Shows concrete outputs (real URLs, real terminal output, real code)
- Explains every step in plain language before showing code
- Makes the split between developer work and platform work explicit
- Keeps the CTA low-risk -- five minutes, free tier, no commitment
- Treats the reader as a competent developer who can evaluate the tool on its own merits
