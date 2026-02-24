---
sidebar_position: 2
title: Features
description: Complete guide to Console features
---

# Console Features

The Console organizes your application into sections, each providing visibility and control over a different aspect of your Pikku project.

## Overview Dashboard

The landing page shows stat cards summarizing your application at a glance:

- Total functions, workflows, agents
- HTTP routes, channels, CLI commands
- MCP tools, resources, and prompts
- Scheduled jobs, queues, and triggers

## Functions

Browse all registered functions in a **tree-based explorer**. Select any function to see its detail panel, which includes:

- Input and output types
- Authentication and permission requirements
- Tags and metadata
- Which wirings reference the function (HTTP routes, channels, queue workers, etc.)

## Workflows

The Workflows section provides:

- **Visual graph rendering** — See your workflow steps as an interactive diagram with color-coded step states (pending, running, completed, failed)
- **Run workflows** — Start a workflow run directly from the Console with custom JSON input — no need to trigger from code or curl
- **Stream progress** — Watch workflow execution in real time as steps complete, wait, or fail
- **Run history** — View past workflow runs with their status, input, output, and step details

Both [DSL workflows](/docs/wiring/workflows) and [graph workflows](/docs/wiring/workflows/graph-workflows) are rendered visually. Graph workflows show the full node graph with branching, parallel, and fanout paths.

## Agents

- **Browse agents** — View all registered agents with their descriptions, tool configurations, model settings, and memory options
- **Interactive playground** — Chat with any agent directly in the Console, useful for testing prompts and tool integrations without building a frontend
- **Tool approval testing** — When an agent requests tool approval (`ToolApprovalRequired`), the Console shows the pending tool call and lets you approve or deny it interactively
- **Conversation history** — View past agent conversations and resume sessions

## APIs

Explore all the ways your functions are exposed:

- **HTTP Routes** — All registered HTTP endpoints with methods, paths, and associated functions
- **Channels** — WebSocket channel definitions and their message handlers
- **MCP** — Model Context Protocol tools, resources, and prompts registered for AI agent access
- **CLI Commands** — Command-line interface definitions

## Jobs

View and manage background work:

- **Schedulers** — Cron-based scheduled tasks with their schedules and target functions
- **Queues** — Queue worker definitions and their configurations
- **Triggers** — Event-driven subscriptions and their handlers

## Runtime

Inspect the runtime configuration:

- **Services** — All registered singleton services available to your functions
- **Middleware** — Middleware stack for HTTP and channel wirings
- **Permissions** — Permission guards defined in your application

## Configuration

Manage environment-specific configuration:

- **Secrets** — View and manage secrets with schema validation and status indicators (set / missing / expired)
- **OAuth2 credentials** — For secrets backed by [OAuth2 credentials](/docs/advanced/oauth2), the Console provides a complete flow: connect, check status, refresh tokens, and disconnect — all from the UI
- **Variables** — View and manage non-sensitive configuration variables per environment with validation status

See [Secrets](/docs/core-features/secrets) and [Variables](/docs/core-features/variables) for more on defining these in code.

## Settings

- **Appearance** — Light/dark mode and display preferences
- **Metadata refresh** — Manually refresh the Console's view of your application registry
- **Spotlight search** — Press `Cmd+K` (or `Ctrl+K`) to quickly find any function, route, workflow, or configuration item

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` / `Ctrl+K` | Open spotlight search |

## Tips

- **Run Console alongside `pikku watch`** for live reloading — changes to functions, wirings, and config are picked up automatically
- **Use spotlight search** to quickly jump to any function, route, or workflow by name
- **Test agents in the playground** before building a frontend — the Console provides a full chat interface with streaming and tool approval
