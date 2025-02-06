---
title: Logger
---

The logger service in pikku is a simple wrapper (which isn't always needed, you could just cast your logger to it) with the standard info, debug, error apis.

```typescript reference title="logger.ts"
https://raw.githubusercontent.com/pikku/pikku/blob/master/packages/core/src/services/logger.ts
```

There's a default implement for the console logger:

```typescript reference title="logger.ts"
https://raw.githubusercontent.com/pikku/pikku/blob/master/packages/core/src/services/logger-console.ts
```

And you can see a simple wrapper around **Pino** if you want to create your own

```typescript reference title="pino.ts"
https://raw.githubusercontent.com/pikku/pikku/blob/master/packages/services/pino/src/pino.ts
```