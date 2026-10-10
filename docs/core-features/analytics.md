---
sidebar_position: 27
title: Analytics
description: Typed product-analytics events, identity, and where they go
ai: true
---

# Analytics

Analytics in Pikku is for product events: `page_viewed`, `signed_up`, `checkout_completed`. Things you'd normally send to a product-analytics tool or an ad platform. It isn't logging and it isn't an audit trail.

Pikku's job is to validate those events, work out who they belong to, and batch them. It does **not** store them. Where they end up is an `AnalyticsService` you put on your singleton services.

```ts
interface AnalyticsService {
  write(batch: AnalyticsRecord[]): Promise<void>
}
```

One method, always a batch. A single event is just a batch of one.

## Declaring events

`defineAnalyticsEvents` declares what your project can measure. Each key is an event name, each value is the schema for that event's props:

```ts
export const analyticsEvents = defineAnalyticsEvents({
  page_viewed: z.object({
    path: z.string().max(512),
  }),
  signed_up: z.object({}),
  checkout_completed: z.object({
    amount: z.number(),
    currency: z.string().length(3),
  }),
})
```

A few rules:

- Keep it an **exported const**. The CLI reads the value by name.
- Call it as often as you like. The CLI unions every declaration into one event schema.
- Each schema must be an object schema (something with a `shape`). A union or primitive isn't accepted as an event's props.
- It registers nothing at runtime. It only tells the CLI what to accept.

## Recording an event

Every function gets `services.analytics`. You don't wire it up. Call `record` with the event name and its props:

```ts
await analytics.record({
  name: 'checkout_completed',
  amount: totalCents / 100,
  currency: 'GBP',
})
```

Events are buffered for the invocation and flushed to your `AnalyticsService` when the function finishes. It's best-effort: if the flush fails, Pikku logs a warning and your function carries on. You can call `flush()` yourself if you want events written earlier.

Because this lives on the services every function gets, events fire the same way from an HTTP route, a queue worker, a cron task, an RPC call or anything else you've wired. Each record is stamped with the `traceId`, `functionId` and `wireType` of the invocation that recorded it, and `source: 'server'`.

To get the `record` call typed against your own events, narrow `analytics` in your app's `SingletonServices` to your event union.

## Events from the browser

Set `scaffold.analytics` in your Pikku config and the CLI generates a typed `POST /analytics` endpoint, validated against everything you declared with `defineAnalyticsEvents`. A request carries 1 to 50 events. Each one is recorded with `source: 'client'`, and the browser's own `at` timestamp is kept alongside the server's `occurredAt`.

The endpoint is unauthenticated, because anonymous visitors are most of what you're measuring. That's safe because identity is **never read from the request body**. It's stamped server-side from the session and cookies, so a crafted request can't attribute events to someone else. The CLI doesn't add middleware to it (an origin lock suits a browser-only app and breaks a native one), so guarding it is your call.

On the React side, `@pikku/react` has `createAnalytics`, a buffered, beacon-based client typed against your event union:

```ts
const analytics = createAnalytics<AnalyticsEvent>({
  endpoint: '/analytics',
  enabled: () => hasAnalyticsConsent(),
})

analytics.event('page_viewed', { path: location.pathname })
```

It flushes on an interval and when the page is hidden (using `sendBeacon`, so the last events before someone leaves aren't lost). `enabled` is checked on each event and each flush, so accepting or withdrawing consent mid-session takes effect straight away. If you pass the client to `PikkuProvider`, components can reach it with `usePikkuAnalytics()`.

## Identity

Each record carries a `userIdentity`:

| Field | What it is |
|-------|------------|
| `userId` | The session's user id, or `null` with no session |
| `orgId` | The session's organization, if it has one |
| `pikkuUserId` | The Pikku user the session resolves to |
| `vendorIds` | Ids a destination keys on that Pikku doesn't mint, e.g. GA4's client id |
| `anonymousId` | A device-scoped id Pikku minted for a visitor with no session |
| `consent` | What the visitor agreed to, keyed by purpose |

The first three come from the session. The last three come from a **resolver** you set as `analyticsIdentity` on your singleton services.

### Why it's separate from the session

A session only exists once someone has signed in, and the most interesting part of a funnel is before that. A sink needs *something* to key an anonymous visitor on, or you either collapse every visitor into one person or drop the whole pre-signup funnel. Vendor ids (GA4's `client_id`, Meta's `fbp`/`fbc`) also originate in the browser, so a session can't supply them. Without a resolver, a sink only sees what the session carries, which is fine for a product-analytics tool and not enough for an ad platform.

A resolver is just a function:

```ts
type AnalyticsIdentityResolver = (
  wire,
  resolved?: { vendorIds?; consent?; anonymousId? }
) => { vendorIds?; consent?; anonymousId? } | undefined
```

Pikku ships three building blocks, and you combine them.

### cookieAnalyticsIdentity

Reads the browser-originated half off first-party cookies. `vendorIds` maps an identity key to the cookie it lives in. `consent` maps a purpose to the cookie that grants it:

```ts
cookieAnalyticsIdentity({
  vendorIds: { gaClientId: '_ga' },
  consent: { analytics: 'shop_consent_analytics' },
})
```

A purpose is `true` only if its cookie is present and isn't a denial (`'0'`, `'false'`, `'denied'`, `'deny'`, `'no'`). A consent tool that writes a refusal instead of deleting the cookie is read as a refusal. If your consent tool packs every purpose into one encoded blob, write your own resolver. That's why the resolver is a function.

It resolves nothing off a non-HTTP wire. A cron task or queue worker has no browser behind it, so any vendor id would be invented.

### anonymousAnalyticsIdentity

Mints a device-scoped id (a random UUID in a cookie named `pikku_aid`) for visitors who have no session yet:

```ts
anonymousAnalyticsIdentity({ requires: ['analytics'] })
```

Options are `name`, `requires` (consent purposes that must be granted before the cookie is written) and `cookie` (overrides for the cookie attributes). The defaults are a two-year, first-party, `secure`, `sameSite: 'lax'` and `httpOnly` cookie. `httpOnly` is deliberate: no browser script needs this id, and a cookie scripts can't touch is harder to misuse. If you want a vendor SDK to read it, opt out explicitly.

Writing the cookie is itself the act consent governs, which is what `requires` is for. Leave it unset only where your deployment is covered by an exemption for strictly necessary audience measurement.

### composeAnalyticsIdentity

Runs resolvers in order, and each one sees what the earlier ones produced. Order matters: a minter that needs consent has to run after the resolver that reads it, otherwise it sees no consent, mints nothing, and you silently collect nothing. When two resolvers set the same key, the later one wins.

### mintCookie and randomDigits

`mintCookie(wire, name, options, mint)` is the primitive behind the anonymous id. It reads a first-party cookie and, if it's absent, mints one and sets it on the response. This is how you identify a visitor without a vendor SDK on the page, because GA4 and Meta ids are ordinary first-party cookies in a documented format.

It mints once per wire, so a second event in the same request can't hand one visitor two identities. It writes nothing on a wire with no HTTP response, or once the response has been sent, and returns `undefined` instead. `options` takes `cookie`, `requires` and `consent`, plus `overwrite` for when the request carries something newer than what's stored (Meta's `_fbc` derives from the `fbclid` on the current URL).

`randomDigits(length)` gives you cryptographically random digits, the shape both vendor formats use. Put together, a GA client id minter looks like this:

```ts
const mintGaClientId: AnalyticsIdentityResolver = (wire, resolved) => {
  const gaClientId = mintCookie(
    wire,
    '_ga',
    {
      cookie: FIRST_PARTY_YEAR,
      requires: ['analytics'],
      consent: resolved?.consent,
    },
    () => `GA1.1.${randomDigits(10)}.${Math.floor(Date.now() / 1000)}`
  )
  return gaClientId === undefined ? undefined : { vendorIds: { gaClientId } }
}
```

And all of it composed, in the right order (read consent, mint the anonymous id, mint the vendor id):

```ts
export const shopAnalyticsIdentity = composeAnalyticsIdentity(
  cookieAnalyticsIdentity({
    vendorIds: { gaClientId: '_ga' },
    consent: { analytics: 'shop_consent_analytics' },
  }),
  anonymousAnalyticsIdentity({ requires: ['analytics'] }),
  mintGaClientId
)
```

Consent is not enforced by Pikku itself. It's recorded on the identity, and the gate belongs to the sink, which is where your app decides what "no consent recorded" means.

## Where events go

If you don't set `analyticsService`, events go to `LoggerAnalyticsService`: it writes each record to your logger at `debug`. There's deliberately no no-op default, since a validated pipeline with nowhere to send events looks exactly like a broken one. It logs at `debug` so that attaching a real store doesn't report every event twice.

### Wiring a real provider

An `AnalyticsService` is anything with a `write(batch)`. Write one for your provider (or use one from an addon), and put it, plus your identity resolver, on the singleton services:

```ts
export const createSingletonServices = pikkuServices(
  async (config, existingServices) => {
    const logger = existingServices?.logger ?? new JsonConsoleLogger()

    return {
      ...(existingServices ?? {}),
      config,
      logger,
      analyticsService: new MyProviderAnalyticsService(),
      analyticsIdentity: shopAnalyticsIdentity,
    }
  }
)
```

`MyProviderAnalyticsService` here is your own class implementing `AnalyticsService`. Pikku doesn't ship vendor sinks in core.

### Several destinations with fanOutAnalytics

`fanOutAnalytics` takes a list of sinks and gives you back one `AnalyticsService`. Each entry is either a plain `AnalyticsService` or an `AnalyticsSink`, which adds an `accepts` filter:

```ts
const analyticsService = fanOutAnalytics([
  new LoggerAnalyticsService(logger),
  {
    service: new MyAdPlatformService(),
    accepts: (record) => record.name === 'checkout_completed',
  },
])
```

`accepts` is your policy about which events a destination should get. A product-analytics tool might want everything, and an ad platform just three conversions. What an event looks like once it arrives is the sink's own business.

Sinks are written concurrently (settled, not awaited in turn), so a slow vendor doesn't add its latency to the others and a vendor that's down doesn't cost the rest their events. If any destinations fail, `write` throws an `AggregateError` after all of them have been tried, and Pikku's flush guard logs it as a warning. A throwing `accepts` is handled the same way.

## Related

- [Services](/docs/core-features/services) for where singleton services live
- [Errors](/docs/core-features/errors)
