---
sidebar_position: 0
title: Overview
description: Persistent storage backends for Pikku services
ai: true
---

# Storage Backends

Pikku provides official storage backend packages that implement the service interfaces required by features like [AI Agents](/docs/wiring/ai-agents/), [Workflows](/docs/wiring/workflows/), and [Channels](/docs/wiring/channels/). Choose the backend that fits your infrastructure.

## Available Backends

| Package | Database | Best For |
|---------|----------|----------|
| [`@pikku/kysely-postgres`](./postgresql) | PostgreSQL | Production workloads with full SQL, transactions, and reliability |
| [`@pikku/kysely`](./kysely) | SQL (via Kysely) | Shared Kysely base; pairs with `@pikku/kysely-mysql`, `@pikku/kysely-sqlite`, `@pikku/kysely-node-sqlite` |
| [`@pikku/redis`](./redis) | Redis | High-throughput state management and caching |
| [`@pikku/mongodb`](./mongodb) | MongoDB | Document-oriented storage with flexible schemas |

## Service Interfaces

Each backend implements one or more of these core interfaces:

| Interface | Purpose | Backends |
|-----------|---------|----------|
| `AIStorageService` | Thread, message, and working memory persistence for AI Agents | `@pikku/kysely-postgres`, `@pikku/kysely`, `@pikku/mongodb` |
| `AIRunStateService` | Agent run tracking and tool approval state | `@pikku/kysely-postgres`, `@pikku/kysely`, `@pikku/mongodb` |
| `AgentRunService` | Read-only agent run queries (used by the Console) | `@pikku/kysely-postgres`, `@pikku/redis`, `@pikku/kysely`, `@pikku/mongodb` |
| `WorkflowService` | Workflow run orchestration and step state | `@pikku/kysely-postgres`, `@pikku/redis`, `@pikku/kysely`, `@pikku/mongodb` |
| `WorkflowRunService` | Read-only workflow run queries (used by the Console) | `@pikku/kysely-postgres`, `@pikku/redis`, `@pikku/kysely`, `@pikku/mongodb` |
| `ChannelStore` | WebSocket channel and subscription persistence | `@pikku/kysely-postgres`, `@pikku/redis`, `@pikku/kysely`, `@pikku/mongodb` |
| `EventHubStore` | Channel topic subscription tracking | `@pikku/kysely-postgres`, `@pikku/redis`, `@pikku/kysely`, `@pikku/mongodb` |
| `DeploymentService` | Multi-instance deployment tracking | `@pikku/kysely-postgres`, `@pikku/redis`, `@pikku/kysely`, `@pikku/mongodb` |
| `SecretService` | Encrypted secret storage | `@pikku/kysely-postgres`, `@pikku/redis`, `@pikku/kysely`, `@pikku/mongodb` |

## Quick Comparison

| Feature | PostgreSQL | Redis | Kysely | MongoDB |
|---------|-----------|-------|--------|---------|
| **AI Storage** | PgKyselyAIStorageService | — | KyselyAIStorageService | MongoDBAIStorageService |
| **Workflows** | PgKyselyWorkflowService | RedisWorkflowService | KyselyWorkflowService | MongoDBWorkflowService |
| **Channels** | PgKyselyChannelStore | RedisChannelStore | KyselyChannelStore | MongoDBChannelStore |
| **Secrets** | PgKyselySecretService | RedisSecretService | KyselySecretService | MongoDBSecretService |
| **Transactions** | Native SQL transactions | Lua scripts | Kysely transactions | MongoDB transactions |
| **Schema init** | Auto-creates tables via `init()` | No schema needed | Auto-creates tables via `init()` | Auto-creates collections via `init()` |
| **Connection** | Kysely with `postgres` (postgres.js) | `ioredis` | Kysely (dialect-specific) | `mongodb` driver |

## Choosing a Backend

**Use PostgreSQL (`@pikku/kysely-postgres`)** when you need:
- Full AI Agent support (storage + run state)
- SQL transactions and complex queries
- A single database for everything

**Use Redis (`@pikku/redis`)** when you need:
- High-throughput workflow orchestration
- Low-latency channel state management
- You already have Redis in your stack

**Use Kysely (`@pikku/kysely`)** when you need:
- A non-Postgres SQL dialect — MySQL (`@pikku/kysely-mysql`) or SQLite (`@pikku/kysely-sqlite`, `@pikku/kysely-node-sqlite`)
- The Kysely query builder for custom queries
- Type-safe SQL queries

**Use MongoDB (`@pikku/mongodb`)** when you need:
- Document-oriented storage with flexible schemas
- You already have MongoDB in your stack
- Full coverage of all service interfaces including encrypted secrets

:::tip
You can mix backends — for example, use `@pikku/kysely-postgres` for AI storage and `@pikku/redis` for channel state. Just provide the appropriate service instances in your singleton services.
:::
