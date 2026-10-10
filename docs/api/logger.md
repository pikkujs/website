---
title: Logger
---

The Logger interface provides structured logging across all Pikku services and functions. Every singleton service set includes a logger, and it's available in all function contexts via `services.logger`.

## Interface

The Logger interface is minimal by design — it matches the common subset of popular logging libraries:

Source: [`logger.ts`](https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/logger.ts)

Each method accepts a string message. `info`, `warn` and `error` also accept a
structured object, and `error` accepts an `Error`; `debug` and `trace` take a
string only:

```typescript @snippet co-logger-usage
```

`info`, `warn`, `error`, `debug` and `setLevel(level)` are required. Two members
are optional, so check before calling them on a logger you did not write:

| Member | Description |
|--------|-------------|
| `trace?(message, ...meta)` | The level below `debug`, for loggers that have one |
| `scope?(traceId): Logger` | Returns a child logger that stamps every line with the trace id |

Every parameter is `Safe<>`-guarded: a `SecretValue` anywhere in the message or
the metadata, however deeply nested, collapses to `never` and fails the build.
Reveal it first if you genuinely mean to log it.

## Implementations

### ConsoleLogger (built-in)

The default logger that wraps `console.*`. No additional packages required:

Source: [`logger-console.ts`](https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/logger-console.ts)

Import `ConsoleLogger` from `@pikku/core/services` and construct it with no arguments.

### PinoLogger

For production use with structured JSON output, use the [Pino](https://getpino.io/) wrapper from `@pikku/pino`:

```bash npm2yarn
npm install @pikku/pino pino
```

Source: [`pino.ts`](https://github.com/pikkujs/pikku/blob/main/packages/services/pino/src/pino.ts)

Import `PinoLogger` from `@pikku/pino`, construct it with no arguments, and set the level with `setLevel(LogLevel.info)` using `LogLevel` from `@pikku/core/services`.

The `PinoLogger` exposes the underlying `pino.Logger` instance via `logger.pino` for advanced configuration.

### Custom Logger

Any object that implements the `Logger` interface works. If your logging library already has `info`, `warn`, `error`, and `debug` methods, you can cast it directly:

Create the logger with `winston.createLogger({ transports: [new winston.transports.Console()] })` and cast it to the `Logger` interface.

## Log Levels

Use `setLevel()` to control verbosity. `LogLevel` is an enum ordered from most
to least verbose: `trace`, `debug`, `info`, `warn`, `error`, `critical`.

Call `setLevel` with a `LogLevel` from `@pikku/core/services`: `LogLevel.debug` shows all logs, `LogLevel.warn` shows only warnings and errors.

## Registration

Pass the logger when creating singleton services:

Pass the logger under the `logger` key when you build the singleton services, for example `new PinoLogger()`.
