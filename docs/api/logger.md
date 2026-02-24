---
title: Logger
---

The Logger interface provides structured logging across all Pikku services and functions. Every singleton service set includes a logger, and it's available in all function contexts via `services.logger`.

## Interface

The Logger interface is minimal by design — it matches the common subset of popular logging libraries:

```typescript reference title="logger.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/logger.ts
```

Each method accepts either a string message or a structured object:

```typescript
logger.info('User signed in')
logger.info({ userId: 'user-123', action: 'sign-in' })
logger.error(new Error('Connection failed'))
```

## Implementations

### ConsoleLogger (built-in)

The default logger that wraps `console.*`. No additional packages required:

```typescript reference title="logger-console.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/logger-console.ts
```

```typescript
import { ConsoleLogger } from '@pikku/core/services'

const logger = new ConsoleLogger()
```

### PinoLogger

For production use with structured JSON output, use the [Pino](https://getpino.io/) wrapper from `@pikku/pino`:

```bash npm2yarn
npm install @pikku/pino pino
```

```typescript reference title="pino.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/services/pino/src/pino.ts
```

```typescript
import { PinoLogger } from '@pikku/pino'

const logger = new PinoLogger()
logger.setLevel('info') // Uses LogLevel enum mapping
```

The `PinoLogger` exposes the underlying `pino.Logger` instance via `logger.pino` for advanced configuration.

### Custom Logger

Any object that implements the `Logger` interface works. If your logging library already has `info`, `warn`, `error`, and `debug` methods, you can cast it directly:

```typescript
import winston from 'winston'

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
}) as unknown as Logger
```

## Log Levels

Use `setLevel()` to control verbosity:

```typescript
import { LogLevel } from '@pikku/core/services'

logger.setLevel(LogLevel.debug) // Show all logs
logger.setLevel(LogLevel.warn)  // Only warnings and errors
```

## Registration

Pass the logger when creating singleton services:

```typescript
const singletonServices = await createSingletonServices(config, {
  logger: new PinoLogger(),
})
```
