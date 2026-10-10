---
sidebar_position: 20
title: Services
description: How services work
---

# Services

Services in Pikku are how your functions interact with external state – databases, caches, email providers, logging, and more. They're just plain TypeScript classes or objects, with no framework magic required.

Think of services as your application's **toolbox**. Each function can pick which tools it needs by destructuring them from the first parameter.

## A Simple Service

Here's a minimal example – a service that manages a book collection:

```typescript @snippet co-service-interface
```

That's it! No decorators, no base classes, no framework coupling. Just a regular TypeScript class.

## Using Services in Functions

Services are available to your functions via the first parameter. **Always destructure only the services you need**:

```typescript @snippet co-service-use
```

:::tip Tree-Shaking
Destructuring services directly in the parameter list is critical. This tells Pikku which services each function actually uses, enabling proper tree-shaking when you deploy filtered subsets of your application.
:::

## Types of Services

Pikku supports two types of services:

### Singleton Services

Created once when the server starts and shared across all function calls. Use these for:

- **Database connections** – Connection pools
- **Cache clients** – Redis, Memcached
- **External APIs** – Third-party service clients
- **Logger** – Application-wide logging
- **Configuration** – App config loaded at startup
- **JWT** – Token signing and verification

A database pool, for example, is created once in `createSingletonServices` and shared by every function.

:::warning Don't Store Request State
Since singleton services are shared across all function calls, **never** store request-specific data in them (like user IDs or session data). That's what wire services are for.
:::

### Wire Services

Created for all supported wirings. Use these for:

- **Request/Response** – HTTP headers, cookies, response modification
- **Database transactions** – Per-wire transaction scope
- **User sessions** – Current user's session data
- **Temporary resources** – Auto-cleanup after the wire completes

Wire services can depend on singleton services and have access to the current `wire` object (which includes session access).

## Creating Services

Services are defined in two files: type definitions and implementations.

### 1. Define Your Service Types

First, extend Pikku's type system with your services:

Define the types in `types/application-types.d.ts`:

- `Config` extends `CoreConfig` with your own settings (a log level, database host and port).
- `SingletonServices` extends `CoreSingletonServices<Config>` and adds your services, such as `jwt`, `books` and `database`.
- `Services` extends `CoreServices<SingletonServices>` and adds wire-specific services, such as a `dbTransaction`.

:::info Why a .d.ts file?
Using a declaration file enforces that you only define types here, not implementations. This keeps your type definitions clean and separate from business logic.
:::

### 2. Implement Service Factories

Then implement the factories that create your services:

```typescript @snippet shopServices
```

```typescript @snippet shopWireServices
```

Key points:

- **`pikkuConfig`** wraps your config factory - no generic types needed
- **`pikkuServices`** wraps your singleton services factory - receives `(config, existingServices?)` and types are inferred
- **`pikkuWireServices`** wraps your wire services factory - receives `(singletonServices, wire)` and types are inferred
- Pikku automatically merges wire services with singleton services, so your functions have access to both
- Don't spread `...singletonServices` – Pikku handles that for you

```typescript reference title="services.ts"
https://github.com/pikkujs/pikku/blob/main/templates/functions/src/services.ts
```

## Service Management Philosophy

Pikku uses **dependency lookup** rather than dependency injection. This means:

- ✅ **Single source of truth** – Service factories manage all service creation
- ✅ **Explicit dependencies** – Functions declare exactly what they need
- ✅ **Simple mental model** – No decorators, no reflection, no magic
- ✅ **Runtime flexibility** – Easy to swap implementations based on environment
- ✅ **Better tree-shaking** – Pikku analyzes which services each function uses

Unlike frameworks like NestJS that use decorators and automatic dependency injection:

With NestJS, a service declares its dependencies through a decorated constructor, with `@Inject("DATABASE")` and `@Inject("LOGGER")` parameters on an `@Injectable()` class.

Pikku keeps it simple:

With Pikku, a function just destructures the services it needs from its first argument.

| **Aspect**       | **Pikku (Dependency Lookup)**    | **NestJS (Dependency Injection)** |
| ---------------- | -------------------------------- | --------------------------------- |
| **Setup**        | Define in factory functions      | Decorators on every service       |
| **Runtime**      | No reflection overhead           | Reflection at startup             |
| **Tree-shaking** | Excellent (Pikku analyzes usage) | Limited (all services bundled)    |
| **Mental model** | Explicit and simple              | "Magical" but familiar to some    |
| **Testing**      | Mock the factories               | Mock via DI container             |

The trade-off: Pikku requires you to explicitly create your services in factory functions, but in exchange you get better tree-shaking, faster cold starts, and a simpler mental model.

## Built-in Service Interfaces

Pikku defines service interfaces for its core features. You provide implementations via storage packages like `@pikku/kysely-postgres`, `@pikku/kysely`, `@pikku/mongodb`, or `@pikku/redis`.

### Required by Feature

| Service                    | Interface                    | Required For                                    | Packages                                                                                                      |
| -------------------------- | ---------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `logger`                   | `Logger`                     | Always                                          | Built-in (`ConsoleLogger`), `@pikku/pino`                                                                     |
| `config`                   | `CoreConfig`                 | Always                                          | Your own                                                                                                      |
| `variables`                | `VariablesService`           | Configuration                                   | Built-in (`LocalVariablesService`)                                                                            |
| `schema`                   | `SchemaService`              | Validation                                      | `@pikku/schema-ajv`, `@pikku/schema-cfworker`                                                                 |
| `secrets`                  | `SecretService`              | [Secrets](/docs/core-features/secrets)          | Built-in (`LocalSecretService`), `@pikku/kysely-postgres`, `@pikku/kysely`, `@pikku/redis`, `@pikku/mongodb`  |
| `jwt`                      | `JWTService`                 | JWT auth                                        | `@pikku/jose`                                                                                                 |
| `eventHub`                 | `EventHubService`            | Channels (pub/sub)                              | Runtime-provided (`LocalEventHubService`), `@pikku/kysely-postgres` (`PgEventHubService`)                     |
| `schedulerService`         | `SchedulerService`           | [Scheduled Tasks](/docs/wiring/scheduled-tasks) | Built-in (`InMemorySchedulerService`)                                                                         |
| `queueService`             | `QueueService`               | [Queues](/docs/wiring/queue/)                   | `@pikku/queue-bullmq`, `@pikku/queue-pg-boss`, `@pikku/queue-nats`, `CloudflareQueueService`, `SQSQueueService` |
| `workflowService`          | `WorkflowService`            | [Workflows](/docs/wiring/workflows/)            | `@pikku/kysely-postgres`, `@pikku/kysely`, `@pikku/redis`, `@pikku/mongodb`                                   |
| `workflowRunService`       | `WorkflowRunService`         | Workflows                                       | `@pikku/kysely-postgres`, `@pikku/kysely`, `@pikku/redis`, `@pikku/mongodb`                                   |
| `agentRunner`              | `AgentRunnerService`         | [AI Agents](/docs/wiring/ai-agents/)            | `@pikku/ai-vercel`                                                                                            |
| `agentStorage`             | `AgentStorageService`        | AI Agents                                       | `@pikku/kysely-postgres`, `@pikku/kysely`, `@pikku/mongodb`                                                   |
| `agentRunState`            | `AgentRunStateService`       | AI Agents                                       | `@pikku/kysely-postgres`, `@pikku/kysely`, `@pikku/mongodb`                                                   |
| `agentRunService`          | `AgentRunService`            | AI agents                                       | `@pikku/kysely-postgres`, `@pikku/kysely`, `@pikku/mongodb`                                                   |
| `aiEmbedding`              | `AIEmbeddingService`         | Semantic search                                 | Your own                                                                                                      |
| `channelStore`             | `ChannelStore`               | Serverless [Channels](/docs/wiring/channels/)   | `@pikku/kysely-postgres`, `@pikku/kysely`, `@pikku/redis`, `@pikku/mongodb`                                   |
| `credentialService`        | `CredentialService`          | [Credentials](/docs/wiring/credentials/)        | Built-in (`LocalCredentialService`), `@pikku/kysely`                                                          |
| `deploymentService`        | `DeploymentService`          | Multi-instance deploy                           | `@pikku/kysely-postgres`, `@pikku/kysely`, `@pikku/redis`, `@pikku/mongodb`                                   |
| `emailService`             | `EmailService`               | Sending email                                   | Built-in (`LocalEmailService`)                                                                                |
| `webhookService`           | `WebhookService`             | [Outgoing webhooks](../api/webhook-service.md)     | Built-in (`QueueWebhookService`), `@pikku/kysely` (`KyselyWebhookService`)                                    |
| `sessionStore`             | `SessionStore`               | Persisted user sessions                         | Built-in (`InMemorySessionStore`), `@pikku/kysely`, `@pikku/redis`, `@pikku/mongodb`                          |
| `scopeService`             | `ScopeService`               | Scopes and roles                                | `@pikku/kysely` (`KyselyScopeService`)                                                                        |
| `featureFlags`             | `FeatureFlagSource`          | Feature flags                                   | `@pikku/kysely` (`KyselyFeatureFlagStore`)                                                                    |
| `audit`                    | `AuditService`               | Audit log                                       | `@pikku/kysely` (`KyselyAuditService`)                                                                        |
| `analyticsService`         | `AnalyticsService`           | Product analytics                               | `@pikku/kysely` (`KyselyAnalyticsService`), built-in (logger)                                                 |
| `analyticsIdentity`        | `AnalyticsIdentityResolver`  | Browser-originated analytics identity           | Your own                                                                                                      |
| `coverageService`          | `CoverageService`            | Live coverage (`pikku dev --coverage`)          | Built-in (dev only)                                                                                           |
| `virtualUserRunStore`      | `VirtualUserRunStore`        | Persona runs                                    | `@pikku/kysely` (`KyselyVirtualUserRunStore`)                                                                 |
| `virtualUserScheduleStore` | `VirtualUserScheduleStore`   | Persona schedules                               | `@pikku/kysely` (`KyselyVirtualUserScheduleStore`)                                                            |
| `content`                  | `ContentService`             | Static content serving                          | Built-in (`LocalContent`)                                                                                     |
| `triggerService`           | `TriggerService`             | [Triggers](/docs/wiring/triggers/)              | Built-in (`InMemoryTriggerService`)                                                                           |
| `gatewayService`           | `GatewayService`             | [Gateway](/docs/wiring/gateway/)                | Built-in (`LocalGatewayService`)                                                                              |
| `metaService`              | `MetaService`                | Deploy / introspection                          | Generated (`PikkuMetaService`)                                                                                |

Some services are built per invocation rather than once at startup: `auditLog` (an `AuditLog` buffer that flushes into `audit`) and `analytics` (an `AnalyticsLog` buffer that writes into `analyticsService`). You do not construct them - Pikku installs them on the services object when the function is invoked. `auth` is likewise injected by whichever auth package registered a factory, and your `createSingletonServices` must not return it itself.

You only need to provide the services your project uses. The CLI detects which services your functions reference and generates a `RequiredSingletonServices` type that makes unused services optional.

## Error Handling in Services

Services can throw Pikku errors that are automatically mapped to HTTP status codes:

```typescript @snippet addError
```

When this error is thrown from a function called via HTTP, Pikku automatically sends a 400 response. See [Errors](/docs/core-features/errors) for more details.

## Environment-Based Service Switching

Services make it easy to swap implementations based on environment:

Pick the implementation in `createSingletonServices`: when `NODE_ENV` is `production`, create an `S3Storage` from the AWS config, otherwise a `LocalStorage` pointing at `./tmp`, and return it as `storage`.

For tests, create a separate factory that returns mocked services:

For tests, write a `createTestServices` with `pikkuServices` that returns a no-op logger, a mock database and an in-memory storage in place of the real ones.

## Summary

Pikku services are:

- **Plain TypeScript** – No decorators or framework coupling
- **Explicitly managed** – Factory functions control creation
- **Tree-shakeable** – Only bundled when actually used by functions
- **Flexible** – Easy to swap based on environment or testing needs
- **Two types** – Singletons for global resources, session services for per-request state
- **Automatically merged** – Pikku combines singleton and session services for you

The key insight: **your services don't know about Pikku**. They're just classes that your functions happen to use via the services parameter. This keeps your business logic portable and easy to test.

## Next Steps

- [Server Lifecycle](/docs/core-features/server-lifecycle) – Run migrations, seeding and teardown around your services
- [Middleware](/docs/core-features/middleware) – Add cross-cutting concerns like logging and authentication
- [Errors](/docs/core-features/errors) – Map custom errors to HTTP status codes
- [Functions](/docs/core-features/functions) – Understand how functions use services
