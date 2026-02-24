---
sidebar_position: 0
title: Overview
description: Persistent storage backends for Pikku services
---

# Storage Backends

Pikku provides official storage backend packages that implement the service interfaces required by features like [AI Agents](/docs/wiring/ai-agents/), [Workflows](/docs/wiring/workflows/), and [Channels](/docs/wiring/channels/). Choose the backend that fits your infrastructure.

## Available Backends

| Package | Database | Best For |
|---------|----------|----------|
| [`@pikku/pg`](./postgresql) | PostgreSQL | Production workloads with full SQL, transactions, and reliability |
| [`@pikku/kysely`](./kysely) | PostgreSQL (via Kysely) | Type-safe query building and multi-dialect support |
| [`@pikku/redis`](./redis) | Redis | High-throughput state management and caching |

## Service Interfaces

Each backend implements one or more of these core interfaces:

| Interface | Purpose | Backends |
|-----------|---------|----------|
| `AIStorageService` | Thread, message, and working memory persistence for AI Agents | `@pikku/pg`, `@pikku/kysely` |
| `AIRunStateService` | Agent run tracking and tool approval state | `@pikku/pg`, `@pikku/kysely` |
| `AgentRunService` | Read-only agent run queries (used by the Console) | `@pikku/pg`, `@pikku/redis`, `@pikku/kysely` |
| `WorkflowService` | Workflow run orchestration and step state | `@pikku/pg`, `@pikku/redis`, `@pikku/kysely` |
| `WorkflowRunService` | Read-only workflow run queries (used by the Console) | `@pikku/pg`, `@pikku/redis`, `@pikku/kysely` |
| `ChannelStore` | WebSocket channel and subscription persistence | `@pikku/pg`, `@pikku/redis`, `@pikku/kysely` |
| `EventHubStore` | Channel topic subscription tracking | `@pikku/pg`, `@pikku/redis`, `@pikku/kysely` |
| `DeploymentService` | Multi-instance deployment tracking | `@pikku/pg`, `@pikku/redis`, `@pikku/kysely` |

## Quick Comparison

| Feature | PostgreSQL | Redis | Kysely |
|---------|-----------|-------|--------|
| **AI Storage** | PgAIStorageService | — | KyselyAIStorageService |
| **Workflows** | PgWorkflowService | RedisWorkflowService | KyselyWorkflowService |
| **Channels** | PgChannelStore | RedisChannelStore | KyselyChannelStore |
| **Transactions** | Native SQL transactions | Lua scripts | Kysely transactions |
| **Schema init** | Auto-creates tables via `init()` | No schema needed | Auto-creates tables via `init()` |
| **Connection** | `postgres` (postgres.js) | `ioredis` | Kysely with `postgres` |

## Choosing a Backend

**Use PostgreSQL (`@pikku/pg`)** when you need:
- Full AI Agent support (storage + run state)
- SQL transactions and complex queries
- A single database for everything

**Use Redis (`@pikku/redis`)** when you need:
- High-throughput workflow orchestration
- Low-latency channel state management
- You already have Redis in your stack

**Use Kysely (`@pikku/kysely`)** when you need:
- Type-safe SQL queries
- The Kysely query builder for custom queries
- Potential future multi-database dialect support

:::tip
You can mix backends — for example, use `@pikku/pg` for AI storage and `@pikku/redis` for channel state. Just provide the appropriate service instances in your singleton services.
:::
