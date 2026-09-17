---
title: Browser Service
description: Browser automation with warm sessions, locally or on Cloudflare
---

# BrowserService

`BrowserService` is the contract for launching and reusing browser sessions. It
is modeled on `@cloudflare/puppeteer`'s binding surface, so one consumer code
path behaves the same on Cloudflare (session reuse via the platform) and locally
(an in-process keep-alive pool).

`@pikku/browser` ships `LocalBrowserService`, the Node implementation used in
local dev, sandboxes and server-target runtimes. Your own functions and agent
tools can take the service; scenario browser steps run through their own driver
and resolve sessions themselves.

```bash
npm install @pikku/browser puppeteer-core
```

`puppeteer-core` (not `puppeteer`) is used on purpose: nothing ever downloads a
Chromium binary. `LocalBrowserService` lazy-imports it inside `launch`, so a
project that only ever runs where the platform provides a browser never needs it
installed.

## Interface

```typescript
import type {
  BrowserService,
  BrowserSession,
  BrowserSessionInfo,
  BrowserLaunchOptions,
  BrowserLimits,
  Browser,
  Page,
} from '@pikku/browser'
```

| Method | Returns | Description |
| --- | --- | --- |
| `acquire(opts?)` | `Promise<BrowserSession>` | Reuse an idle session if one exists, otherwise launch a new one |
| `launch(opts?)` | `Promise<BrowserSession>` | Always launch a new session |
| `connect(sessionId)` | `Promise<BrowserSession>` | Attach to an existing session by id |
| `sessions()` | `Promise<BrowserSessionInfo[]>` | List live sessions |
| `limits?()` | `Promise<BrowserLimits>` | Platform limits, when the provider reports them |

```typescript
interface BrowserSession {
  sessionId: string
  browser: Browser
  /** Return the session to the pool, kept warm for reuse (CF: `disconnect`). */
  release(): Promise<void>
}

interface BrowserSessionInfo {
  sessionId: string
  startTime?: number
  /** Set when a client is currently attached (mirrors CF's connectionId). */
  connectionId?: string
}

interface BrowserLaunchOptions {
  /** ms to keep the session alive after the last client releases it. */
  keepAlive?: number
}

interface BrowserLimits {
  activeSessions: number
  maxConcurrentSessions: number
  allowedBrowserAcquisitions?: number
}
```

## LocalBrowserService

```typescript
import { LocalBrowserService } from '@pikku/browser'

const browserService = new LocalBrowserService({
  logger,
  // Path to a system Chrome/Chromium. Defaults to $PUPPETEER_EXECUTABLE_PATH,
  // else puppeteer-core resolves the installed `chrome` channel.
  executablePath: process.env.CHROME_PATH,
  maxConcurrentSessions: 4,
})
```

| Option | Type | Description |
| --- | --- | --- |
| `logger` | `{ info, warn, error }` | Optional logger for session lifecycle messages |
| `launchArgs` | `string[]` | Chromium launch flags; defaults suit containers (no sandbox) |
| `executablePath` | `string` | System Chrome/Chromium path; defaults to `$PUPPETEER_EXECUTABLE_PATH` or the installed `chrome` channel |
| `maxConcurrentSessions` | `number` | Cap on simultaneously attached sessions |

The service holds launched browsers in an in-process keep-alive pool. `release()`
does not close the browser; it marks the session idle so the next `acquire()`
reuses it, and the idle timer closes it once `keepAlive` elapses.

## Usage

```typescript
const session = await browserService.acquire({ keepAlive: 30_000 })
try {
  const page = await session.browser.newPage()
  await page.goto('https://example.com')
  return await page.title()
} finally {
  await session.release()
}
```

Provide the service through your singleton services (under a key of your
choosing) and hand it to whichever functions or agent tools need it. Scenario
browser steps run through their own driver, so they do not need the service
registered under a particular name.

## Next Steps

- **[Scenarios](../core-features/scenarios.md)** — browser steps and personas
- **[Storage](../storage/index.md)** — the other service backends
