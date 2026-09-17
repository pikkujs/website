---
title: Scaffolding with create-pikku
description: Generate a new Pikku project from the official templates
---

# create-pikku

`create-pikku` scaffolds a new project from the templates in the
[pikku repository](https://github.com/pikkujs/pikku/tree/main/templates) and
runs Pikku setup for you.

```bash
npm create pikku@latest
```

By default this creates `./my-app` from the opinionated **starter-template**,
keeps its default frontend, installs dependencies and runs Pikku setup. Use
`--name` to choose a different directory.

## Choosing a template

Run without arguments for the interactive picker, or with `--variations` to open
the full template and options menu:

```bash
npm create pikku@latest -- --variations
```

Every option can also be passed up front to skip the prompts entirely:

```bash
npm create pikku@latest -- --template express --name my-app --install --package-manager npm
```

| Option | Short | Description |
| --- | --- | --- |
| `--template <template>` | `-t` | Template to use |
| `--name <name>` | `-n` | Project name |
| `--install` | `-i` | Install dependencies automatically |
| `--package-manager <manager>` | `-p` | Package manager: `npm`, `yarn` or `bun` |
| `--version <version>` | `-v` | Template version/branch |
| `--yarn-link <path>` | | Link to a local Pikku checkout for development |
| `--stackblitz` | | Add StackBlitz configuration |
| `--variations` | | Show all template variations |
| `--frontend <frontend>` | | Frontend to keep for the starter template |

## Templates

### Servers

| Template | Description | Features |
| --- | --- | --- |
| `express` | Express server | HTTP, scheduled tasks, SSE |
| `express-middleware` | Express middleware | HTTP, scheduled tasks, SSE |
| `fastify` | Fastify server | HTTP, SSE |
| `fastify-plugin` | Fastify plugin | HTTP, SSE |
| `bun` | Bun (`Bun.serve`) server | HTTP, channels, scheduled tasks |
| `uws` | uWebSockets.js server | HTTP, channels, scheduled tasks |
| `ws` | `ws` server | HTTP, channels, scheduled tasks |
| `cli` | CLI application | CLI |

### Serverless

| Template | Description | Features |
| --- | --- | --- |
| `aws-lambda` | AWS Lambda | HTTP, scheduled tasks |
| `aws-lambda-websocket` | Serverless WebSocket | Channels |
| `cloudflare-workers` | Cloudflare Workers | HTTP, scheduled tasks |
| `cloudflare-websocket` | Cloudflare Workers WebSocket | Channels, HTTP |

### Queues and workflows

| Template | Description | Features |
| --- | --- | --- |
| `bullmq` | BullMQ (Redis) queue | Queue processing |
| `pg-boss` | pg-boss (PostgreSQL) queue | Queue processing |
| `workflows-pg-boss` | pg-boss-backed workflows | HTTP, workflows |
| `workflows-bullmq` | BullMQ-backed workflows | HTTP, workflows |
| `remote-rpc-pg` / `remote-rpc-redis` | Remote RPC mesh over PostgreSQL / Redis | RPC |

### Full-stack and AI

| Template | Description | Features |
| --- | --- | --- |
| `nextjs` | Next.js hello world | HTTP, full-stack |
| `nextjs-full` | Next.js book application | HTTP, full-stack |
| `tanstack` | TanStack Start frontend served from one origin | HTTP, full-stack |
| `starter-template` | Opinionated starter | HTTP, full-stack |
| `ai-postgres` | AI agent with PostgreSQL storage | HTTP, SSE |
| `gateway-whatsapp` | WhatsApp gateway listener | Gateway |

### Specialized

| Template | Description | Features |
| --- | --- | --- |
| `mcp-server` | Model Context Protocol server | MCP |

## What the generator does

Templates carry files for several feature sets; the generator filters each
template down to the features it supports, merges directories, rewrites the
`package.json` scripts, and can prepare a `--yarn-link` checkout for local Pikku
development. Only files relevant to the selected template are included.

## Next Steps

- **[Getting Started](/getting-started)** — from an empty folder to a running app
- **[Pikku CLI](./index.mdx)** — every command the generated project has
- **[Runtimes](../runtimes/express-middleware.md)** — deploy to any platform
