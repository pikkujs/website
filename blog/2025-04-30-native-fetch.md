---
title: Pikku Now Uses Fetch!
description: Simplifying Server Support with Native Request/Response APIs
---

We're excited to announce that **Pikku now uses `fetch` directly** within its APIs—taking inspiration from frameworks like Hono and pushing even closer to modern web standards.

<!-- truncate -->

## Why This Matters

With this change, Pikku APIs now operate against the [standard `Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) and [standard `Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) objects.  
As long as a server or runtime implements these APIs, Pikku can support it **out of the box** — no complex adapters or server-specific workarounds required!

This massively expands where Pikku can run, including:

- Cloudflare Workers
- Vercel Edge Functions
- Node.js (18+ with experimental Fetch)
- Bun
- Deno
- Future platforms that follow the Fetch standard

```mermaid
graph LR
  Runtime -- Request/Response API --> Pikku
  Pikku -- Fetch API --> Runtime
```

---

## Flexibility Remains

While we now natively use `fetch`, **Pikku still allows you to create your own server wrappers** if needed.

If you're working with an environment that doesn't provide full `Request`/`Response` objects (or provides custom versions), you can still implement a simple wrapper without needing to constantly convert back and forth.

This means:

- **Better performance** where native APIs exist.
- **Maximum compatibility** for custom servers.

---

## Quick Example

When calling Pikku routes internally, you now use a standard `Request` object and the native `fetch` function:

```typescript
import { fetch, RunRouteOptions } from '@pikku/core/http';

const response = await fetch(new Request('https://example.com/api/hello', {
  method: 'GET',
}), {
  singletonServices,
  createSessionServices,
});
```

- `fetch` expects a standard `Request`.
- You still pass `singletonServices` and `createSessionServices` the same way.
- The response is a standard `Response` object.

---

## Wrapping Up

Pikku’s move to native `fetch` APIs brings us even closer to a universal runtime future—where your APIs can run anywhere without changes.

If your server or hosting environment follows modern standards, you can plug Pikku in and get moving immediately.

This change is live in the latest version of Pikku—go try it out and let us know what you build!
