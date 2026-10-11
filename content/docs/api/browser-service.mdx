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

The types are exported from `@pikku/browser`: `BrowserService`, `BrowserSession`, `BrowserSessionInfo`, `BrowserLaunchOptions`, `BrowserLimits`, plus the `Browser` and `Page` types re-exported from puppeteer.

| Method | Returns | Description |
| --- | --- | --- |
| `acquire(opts?)` | `Promise<BrowserSession>` | Reuse an idle session if one exists, otherwise launch a new one |
| `launch(opts?)` | `Promise<BrowserSession>` | Always launch a new session |
| `connect(sessionId)` | `Promise<BrowserSession>` | Attach to an existing session by id |
| `sessions()` | `Promise<BrowserSessionInfo[]>` | List live sessions |
| `limits?()` | `Promise<BrowserLimits>` | Platform limits, when the provider reports them |

| Type | Fields |
| --- | --- |
| `BrowserSession` | `sessionId: string`, `browser: Browser`, and `release()`, which returns the session to the pool and keeps it warm for reuse (Cloudflare: `disconnect`) |
| `BrowserSessionInfo` | `sessionId: string`, optional `startTime`, and an optional `connectionId` that is set while a client is attached (mirrors Cloudflare's `connectionId`) |
| `BrowserLaunchOptions` | `keepAlive?: number`, the milliseconds to keep the session alive after the last client releases it |
| `BrowserLimits` | `activeSessions: number`, `maxConcurrentSessions: number`, and an optional `allowedBrowserAcquisitions` |

## LocalBrowserService

Construct `LocalBrowserService` from `@pikku/browser` with an options object. The options are listed below; `maxConcurrentSessions: 4` and `executablePath` taken from `CHROME_PATH` are typical.

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

The usage pattern is acquire, work, release:

1. Call `acquire({ keepAlive: 30000 })` to get a session.
2. Open a page with `session.browser.newPage()`, navigate with `page.goto(...)`, and read what you need (for example `page.title()`).
3. Call `session.release()` in a `finally` block so the session returns to the pool even when the work throws.

Provide the service through your singleton services (under a key of your
choosing) and hand it to whichever functions or agent tools need it. Scenario
browser steps run through their own driver, so they do not need the service
registered under a particular name.

## Next Steps

- **[Scenarios](/docs/core-features/scenarios)** — browser steps and personas
- **[Storage](/docs/storage)** — the other service backends
