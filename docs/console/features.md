---
sidebar_position: 2
title: Features
description: Complete guide to Console features
ai: true
---

# Console Features

The Console sidebar groups your application into a handful of sections — **Run**, **Data**, **Config**, **Users**, and **Changes** — plus an overview dashboard. Everything is derived from the registry the Pikku CLI generates, so it always matches your code.

## Overview

The landing page shows stat cards summarizing your application at a glance: total functions, workflows, agents, HTTP routes, channels, CLI commands, MCP tools, scheduled jobs, queues, and triggers. Each card links to its section.

## Run

### Functions

Browse all registered functions in a tree-based explorer. Select any function to see its detail panel:

- Input and output types
- Authentication and permission requirements
- Tags and metadata
- Which wirings reference the function (HTTP routes, channels, queue workers, etc.)

### Workflows

- **Visual graph rendering** — See your workflow steps as an interactive diagram with color-coded step states (pending, running, completed, failed)
- **Run workflows** — Start a workflow run directly from the Console with custom JSON input — no need to trigger from code or curl
- **Stream progress** — Watch workflow execution in real time as steps complete, wait, or fail
- **Run history** — View past workflow runs with their status, input, output, and step details

Both [DSL workflows](/docs/wiring/workflows) and [graph workflows](/docs/wiring/workflows/graph-workflows) are rendered visually. Graph workflows show the full node graph with branching, parallel, and fanout paths.

### Agents

- **Browse agents** — View all registered agents with their descriptions, tool configurations, model settings, and memory options
- **Interactive playground** — Chat with any agent directly in the Console, useful for testing prompts and tool integrations without building a frontend
- **Tool approval testing** — When an agent requests tool approval (`ToolApprovalRequired`), the Console shows the pending tool call and lets you approve or deny it interactively
- **Conversation history** — Browse past agent threads, their runs, and messages, and resume sessions

### Scenarios

End-to-end [scenario](/docs/core-features/scenarios) tests and the personas that run them:

- Browse your `pikkuScenario` flows with their **cast of personas** (declared in code with `definePersonas`, surfaced via `#pikku/scopes/pikku-personas.gen.js`), or flip to a personas view to see which flows each persona appears in
- **Run a scenario** straight from the Console — each actor signs in via the actor auth plugin and drives its steps over real HTTP as that persona (needs `SCENARIO_ACTOR_SECRET` configured; without it the run falls back to actor-less with a warning)
- Follow the **persona-driven step timeline** and last-run status for each flow

## Data

### Database

An interactive schema diagram of your development database — tables rendered as nodes with their columns, linked by their foreign-key relationships. Use it to sanity-check what `pikku db migrate` actually produced.

### APIs

Explore all the ways your functions are exposed, in one tabbed view:

- **HTTP** — All registered HTTP endpoints with methods, paths, and associated functions
- **Channels** — WebSocket channel definitions and their message handlers
- **MCP** — Model Context Protocol tools, resources, and prompts registered for AI agent access
- **CLI** — Command-line interface definitions
- **Gateways** — Messaging-platform gateways (e.g. Slack) and their command wirings

### Jobs

View background work:

- **Queues** — Queue worker definitions and their configurations
- **Triggers** — Event-driven subscriptions and their handlers
- **Schedulers** — Cron-based scheduled tasks with their schedules and target functions

### Runtime

Inspect the runtime configuration:

- **Services** — All registered singleton services available to your functions
- **Middleware** — Middleware stack for HTTP and channel wirings
- **Permissions** — Permission guards defined in your application

### Emails

Preview your [typed email templates](/docs/pikku-cli#pikku-emails) without sending anything: pick a template and locale, fill in its input data through a form generated from the template's schema, and see the rendered HTML live.

## Config

### Secrets

View and manage secrets with schema validation and status indicators (set / missing / expired). For secrets backed by [OAuth2 credentials](/docs/wiring/credentials), the Console provides a complete flow: connect, check status, refresh tokens, and disconnect — all from the UI.

### Environment Variables

View and manage non-sensitive configuration variables per environment with validation status.

See [Secrets](/docs/core-features/secrets) and [Variables](/docs/core-features/variables) for defining these in code.

### Security

Run the data-classification security audit from the UI — the same lint as `pikku --security`. It scans function return types for `Private`, `Pii`, and `Secret` data leaking out through wirings and lists every finding.

### Addons

Browse the [addons](/docs/addon) wired into your project and their functions, services, secrets, and credentials — plus a **community gallery** of registry addons you can bring in with `pikku fabric addon add`.

## Users

### Users

List the users in your application's auth database. Select a user to **impersonate** them — the Console then makes every request as that user, which is the fastest way to test permissions and per-user credentials.

### OAuth

Configure [Better Auth](/docs/middleware/better-auth) social sign-in and SSO providers. The page reads the enabled providers and plugins from the generated auth metadata and walks you through the callback URLs and secrets each provider needs.

### Credentials

See per-user [credential](/docs/wiring/credentials) status across your integrations: which users have connected which services, and whether their tokens are healthy.

## Rollout

### Feature Flags

A launch board rather than a list: every feature flag your code declares sits in the lane its rollout has actually reached.

- **Dark** — switched off for everyone. An override still lets a named subject in.
- **Rolling out** — on, but held to a percentage of buckets. A subject stays in or out across requests.
- **Live** — on for everyone the flag's capabilities admit.
- **Needs attention** — the flag is not resolving in a way anybody chose. Either the declaration is gone from the code and the stored row is waiting for `pikku flags prune`, or the flag is declared with no stored row at all — which **fails open**, so it is live for everyone right now. That second case reads as `enabled` with no rollout limit, i.e. exactly like a deliberate full launch, which is why the board calls it out instead of drawing it as one.

Selecting a flag opens its controls beside the board: the switch, the rollout percentage, and the list of subjects pinned on or off past that rollout, with the user who pinned each one. They share a surface because they are read together — "off for everyone except these three" is a switch and an override row, and an operator who has to leave one screen to see the other is the operator who turns a flag on for everybody by mistake.

Turning a flag on while it carries no rollout limit asks first, because that single press admits everyone the flag's capabilities allow — there is no bucket left to hold anybody back.

Two board-level actions sit in the header: **Create missing rows** (`pikku flags sync`) writes a stored row for every declaration that has none, which is how a fail-open flag is closed; **Prune undeclared** (`pikku flags prune`) drops the rows whose declaration is gone.

The board is read-only when your project's flags come from a `FeatureFlagSource` — a provider Pikku reads but does not own — and says so rather than offering controls that would fail.

### Analytics Events

The catalog of every analytics event your code declares, with the props each one carries and the schema each prop was declared with.

Events are grouped by the file that declares them, so the catalog reads in the same order the code does.

This is the **declared surface** — what a client is allowed to emit — read from build-time metadata, not a volume report of what has been emitted. Use it to check what a new event will be called and what shape the ingest will accept before you write the call.

## Changes

Diff your current function and wiring registry against a base state — for example your `main` branch. The summary bar shows how many functions, routes, channels, and other wirings were added, removed, or changed, and each category expands into a detailed diff. Useful for spotting accidental contract changes before they ship; pairs with [`pikku versions`](/docs/pikku-cli#pikku-versions).

## Everywhere

- **Spotlight search** — Press `Cmd+K` (or `Ctrl+K`) to jump to any function, route, workflow, or configuration item
- **Metadata refresh** — Manually refresh the Console's view of your application registry from the sidebar
- **Light/dark mode** — Toggle from the sidebar
- **Impersonation banner** — When impersonating a user, a persistent indicator shows who you're acting as

## Tips

- **Run the Console via `npx pikku dev`** — it's served at `/console` on your dev server and picks up changes to functions, wirings, and config automatically
- **Test agents in the playground** before building a frontend — the Console provides a full chat interface with streaming and tool approval
- **Impersonate a user** before testing credential- or permission-dependent functions
