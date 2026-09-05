---
title: '#pikku/scenarios'
sidebar_label: '#pikku/scenarios'
sidebar_position: 1
description: 'Drives features and scenarios against a real running server, in the vocabulary a user would use.'
---

# `#pikku/scenarios`

Drives features and scenarios against a real running server, in the vocabulary a user would use.

```typescript
import { createCookieJar, createScenarioRunner, pikkuAddonScenarioStep } from '#pikku/scenarios'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`createCookieJar`](#createcookiejar) | function | A cookie store for a scenario run, so a step that signs in leaves the session cookie behind for the steps after it. |
| [`createScenarioRunner`](#createscenariorunner) | function | A workflow service with the scenario capability attached — the two lines `pikku scenario run` needs, in one call so no caller has to remember that the capability is installed rather than inherited. |
| [`pikkuAddonScenarioStep`](#pikkuaddonscenariostep) | function | A step in which a third-party system acts — "Given Stripe's webhook arrives", "When Mailgun bounces it". |
| [`PikkuBrowserWire`](#pikkubrowserwire) | interface | Structural browser handle, present only when the runner provisioned a browser for this step (a `browser` binding on the step config). |
| [`pikkuFeature`](#pikkufeature) | function | A feature: an ordered group of scenarios, mirroring gherkin's Feature ↔ Scenario structure. Scenarios are referenced by imported identifier, so a renamed or deleted scenario is a compile error rather than a silent skip. |
| [`PikkuFeatureEntry`](#pikkufeatureentry) | type | One entry in a feature's `scenarios` list, validated against itself: a bare scenario, or a scenario paired with the input to run it with. The paired form is gherkin's `Examples:` written as an ordinary loop. |
| [`PikkuFunctionScenario`](#pikkufunctionscenario) | type | `Ctx` types `scenario.context`, defaulting to the body's own output. A hook returns void but shares the scenario's context, so it passes that scenario's output here instead. |
| [`PikkuFunctionScenarioStep`](#pikkufunctionscenariostep) | type | One surface's implementation of a step. |
| [`pikkuPlatformScenarioStep`](#pikkuplatformscenariostep) | function | A step in which the app acts on itself — "Given the platform has expired the trial". |
| [`pikkuScenario`](#pikkuscenario) | function | A scenario: a complex workflow that drives the app the way users do. Steps run as actors over the REAL transport — `scenario.do(step, rpc, data, &#123; actor: actors.yasser &#125;)` — so flows double as e2e tests and staged/production health checks (no state reset; scope what you create). |
| [`pikkuScenarioHook`](#pikkuscenariohook) | function | Declares a scenario hook. Returns the function verbatim — a hook is never registered, so this exists purely to give an inline hook a call site to be contextually typed from, the way every other pikku primitive is. |
| [`PikkuScenarioHook`](#pikkuscenariohook-2) | type | A scenario lifecycle hook: the scenario's own `(services, data, wire)` signature with its result discarded. `OutputSchema` types `scenario.context` while the return type stays `void`. |
| [`PikkuScenarioRef`](#pikkuscenarioref) | type | A scenario as a feature references it. Any `pikkuScenario` export is assignable; `In` is recovered from it so the paired form's `data` is checked against that scenario's own input. |
| [`pikkuScenarioStep`](#pikkuscenariostep) | function | A named, reusable scenario step, declaring one implementation per surface an actor can drive it through. |
| [`pollUntil`](#polluntil) | function | Retries an assertion until it passes or the timeout runs out — for the eventually-consistent parts of a scenario (a queued job, a projection). |
| [`postScenarioJson`](#postscenariojson) | function | POST JSON somewhere and report what came back, without throwing on a 4xx/5xx. |
| [`readScenarioHttpResponse`](#readscenariohttpresponse) | function | Drain a response into the shape a step can carry: the parsed body (an empty one counting as no body at all) alongside the text it was parsed from. |
| [`requireScenarioEnv`](#requirescenarioenv) | function | The environment the current scenario run targets, or a throw explaining that the run carries none. Use it in a step that needs the target's URLs. |
| [`ScenarioHttpResponse`](#scenariohttpresponse) | interface | What the transport answered, for a step that treats the status as data. |
| [`ScenarioSurface`](#scenariosurface) | type | How an actor drives the system for one step. |
| [`TestIdSelector`](#testidselector) | interface | How a browser step names an element. |
| [`TypedPersonas`](#typedpersonas) | type | The personas this project declares, keyed by name — the `actors` a scenario step runs as. |
| [`TypedScenario`](#typedscenario) | type | `Out` types `scenario.context`. |
| [`TypedScenarioSteps`](#typedscenariosteps) | interface | The typed half of a scenario wire: `given`/`when`/`then`, narrowed to the names declared by `pikkuScenarioStep` in this project. `given` and `when` differ only in the prose the reporter renders; `then` additionally makes the step's bindings witnesses rather than alternatives. |

## Reference

### `createCookieJar` {#createcookiejar}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/workflow`</span>

A cookie store for a scenario run, so a step that signs in leaves the session
cookie behind for the steps after it.

```typescript
createCookieJar: (apiUrl: string) => ScenarioCookieJar
```

```typescript
/**
 * Signing up is the one flow an actor cannot perform, because an actor is
 * already signed in before the first step runs. The jar is what makes it
 * possible from a bare `fetch`: it keeps the Set-Cookie the sign-up returned
 * and replays it on the next call, so the session survives the hop the way a
 * browser's would.
 */
export const signsUpShopper = pikkuScenarioStep<
  { email: string; password: string },
  { signedUpAs?: string }
>({
  name: 'signsUpShopper',
  description: 'signs a new shopper up and reads back the session it created',
  template: 'signs up as {email}',
  default: async (_services, { email, password }, { scenarioStep }) => {
    const { apiUrl } = requireScenarioEnv(scenarioStep)
    const jar = createCookieJar(apiUrl)
    await jar.fetch(`${apiUrl}/auth/sign-up/email`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password, name: email }),
    })
    const session = await readScenarioHttpResponse<{
      user?: { email?: string }
    } | null>(await jar.fetch(`${apiUrl}/auth/get-session`))
    return { signedUpAs: session.body?.user?.email }
  },
})
```

### `createScenarioRunner` {#createscenariorunner}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/workflow`</span>

A workflow service with the scenario capability attached — the two lines
`pikku scenario run` needs, in one call so no caller has to remember that the
capability is installed rather than inherited.

The in-memory service is the right engine because a scenario run is a single
external process driving a deployed app over its real transport: there is
nothing to persist and no second worker to resume it.

```typescript
createScenarioRunner: (options?: WorkflowQueueOptions) => { workflowService: InMemoryWorkflowService; scenarioService: PikkuScenarioService; }
```

### `pikkuAddonScenarioStep` {#pikkuaddonscenariostep}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

A step in which a third-party system acts — "Given Stripe's webhook arrives",
"When Mailgun bounces it".

`addon` names the addon that wraps that service, the same name its
`wireAddon` declares. These steps *are* the mock its consumers currently
hand-write: shipped by the addon author, maintained with the addon, and the
same artifact that appears in the prose.

Note that arranging and asserting are different — "Stripe's webhook arrives"
stubs, "Then Stripe was charged" asserts, and only the first is a stub.

Local-test-only, and never in a virtual user's catalogue: one that could
invoke this would forge its own payment success.

```typescript
pikkuAddonScenarioStep: { <InputSchema extends StandardSchemaV1 | undefined = undefined, OutputSchema extends StandardSchemaV1 | undefined = undefined>(config: PikkuSubjectScenarioStepConfigWithSchema<InputSchema, OutputSchema> & { addon: string; }): PikkuFunctionConfig<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "scenarioStep", PikkuFunctionScenarioStep<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "default">, InputSchema, OutputSchema>; <In, Out = unknown>(config: PikkuSubjectScenarioStepConfig<In, Out> & { addon: string; }): PikkuFunctionConfig<In, Out, "scenarioStep">; }
```

```typescript
/**
 * Stripe telling us the card cleared. `addon` names the wiring it belongs to —
 * the same `stripe` that `wireAddon` declares — so the step is filed under the
 * service it speaks for rather than under the shop.
 *
 * This arranges, it does not assert: a scenario uses it to get an order into
 * the paid state without a real card, and checks the consequences separately.
 */
export const stripeReportsPayment = pikkuAddonScenarioStep<
  { orderId: string; paymentIntentId?: string },
  { applied: boolean }
>({
  addon: 'stripe',
  name: 'stripeReportsPayment',
  description: 'delivers a payment_intent.succeeded event for an order',
  template: 'Stripe confirms payment for {orderId}',
  func: async (_services, { orderId, paymentIntentId }, { rpc }) => {
    return rpc.invoke('applyStripeEvent', {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: paymentIntentId ?? `pi_${orderId}`,
          metadata: { orderId },
        },
      },
    })
  },
})
```

### `PikkuBrowserWire` {#pikkubrowserwire}

<span className="api-symbol-meta">interface · re-exported from `@pikku/core/workflow`</span>

Structural browser handle, present only when the runner provisioned a
browser for this step (a `browser` binding on the step config).

`@pikku/core` deliberately never imports playwright — it must stay
dependency-free for edge runtimes. `@pikku/playwright` augments this
interface via `declare module`, so `wire.browser.page` is a fully typed
Playwright `Page` in a project that installs it.

<details>
<summary>Config keys (3)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `actor` <sup>required</sup> | `string` | The actor whose browser context this is |
| `goto` <sup>required</sup> | `(url: string) => Promise<void>` |  |
| `screenshot` <sup>required</sup> | `(name?: string) => Promise<Uint8Array>` |  |

</details>

### `pikkuFeature` {#pikkufeature}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

A feature: an ordered group of scenarios, mirroring gherkin's Feature ↔
Scenario structure. Scenarios are referenced by imported identifier, so a
renamed or deleted scenario is a compile error rather than a silent skip.

A scenario does not have to belong to a feature — a void-input scenario
still runs standalone.

```ts
export const credentialFeature = pikkuFeature({
  name: 'Credential API',
  tags: ['credential'],
  before: startsMockOAuthServer,
  after: stopsMockOAuthServer,
  scenarios: [
    credentialLazyLoadScenario,
    ...['stripe', 'google'].map((name) => ({
      scenario: credentialRoundTripScenario,
      data: { name },
    })),
  ],
})
```

```typescript
pikkuFeature: <const Scenarios extends readonly unknown[]>(config: PikkuFeatureConfig<Scenarios>) => PikkuFeatureConfig<Scenarios>
```

```typescript
export const journeyFeature = pikkuFeature({
  name: 'Browser journey',
  description: 'The job this app exists for, performed by clicking',
  tags: ['journey'],
  scenarios: [shopperBuysAnItemInTheBrowser],
})
```

### `PikkuFeatureEntry` {#pikkufeatureentry}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

One entry in a feature's `scenarios` list, validated against itself: a bare
scenario, or a scenario paired with the input to run it with. The paired form
is gherkin's `Examples:` written as an ordinary loop.

```typescript
PikkuFeatureEntry: PikkuFeatureEntry<Entry>
```

### `PikkuFunctionScenario` {#pikkufunctionscenario}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

`Ctx` types `scenario.context`, defaulting to the body's own output. A hook
returns void but shares the scenario's context, so it passes that scenario's
output here instead.

```typescript
PikkuFunctionScenario: PikkuFunctionScenario<In, Out, Ctx>
```

### `PikkuFunctionScenarioStep` {#pikkufunctionscenariostep}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

One surface's implementation of a step.

Each binding is typed independently, so a browser binding gets a non-optional
`wire.browser` and a cli binding a non-optional `wire.cli` without either
leaking into the other.

```typescript
PikkuFunctionScenarioStep: PikkuFunctionScenarioStep<In, Out, Surface, HasActor>
```

### `pikkuPlatformScenarioStep` {#pikkuplatformscenariostep}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

A step in which the app acts on itself — "Given the platform has expired the
trial".

The grammatical subject of that sentence is not a user of your app; it **is**
your app, which is why it is its own declaration rather than a persona with an
asterisk. A persona is a person.

Local-test-only, and never in a virtual user's catalogue: a virtual user that
could expire its own trial is manufacturing the outcome it exists to discover.

```typescript
pikkuPlatformScenarioStep: { <InputSchema extends StandardSchemaV1 | undefined = undefined, OutputSchema extends StandardSchemaV1 | undefined = undefined>(config: PikkuSubjectScenarioStepConfigWithSchema<InputSchema, OutputSchema>): PikkuFunctionConfig<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "scenarioStep", PikkuFunctionScenarioStep<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "default">, InputSchema, OutputSchema>; <In, Out = unknown>(config: PikkuSubjectScenarioStepConfig<In, Out>): PikkuFunctionConfig<In, Out, "scenarioStep">; }
```

```typescript
/**
 * Shipping is the shop acting on itself: no shopper clicks it, and the order
 * update the customer receives is a consequence rather than a request.
 */
export const shipsTheOrder = pikkuPlatformScenarioStep<
  { orderId: string },
  { orderId: string }
>({
  name: 'shipsTheOrder',
  description:
    'ships an order, which is what tells the shopper it is on its way',
  template: 'ships order {orderId}',
  func: async (_services, { orderId }, { rpc }) => {
    await rpc.invoke('notifyOrderShipped', { orderId })
    return { orderId }
  },
})
```

### `pikkuScenario` {#pikkuscenario}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

A scenario: a complex workflow that drives the app the way users do.
Steps run as actors over the REAL transport — `scenario.do(step, rpc,
data, &#123; actor: actors.yasser &#125;)` — so flows double as e2e tests and
staged/production health checks (no state reset; scope what you create).

```typescript
pikkuScenario: { <InputSchema extends StandardSchemaV1 | undefined = undefined, OutputSchema extends StandardSchemaV1 | undefined = undefined>(config: PikkuScenarioConfigWithSchema<InputSchema, OutputSchema>): PikkuFunctionConfig<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "scenario" | "actors", PikkuFunctionScenario<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown>, InputSchema, OutputSchema>; <In, Out = unknown>(func: PikkuFunctionScenario<In, Out> | PikkuFunctionConfig<In, Out, "scenario" | "actors", PikkuFunctionScenario<In, Out>>): PikkuFunctionConfig<In, Out, "scenario" | "actors">; }
```

```typescript
// A scenario is a workflow whose steps run as real users ("actors") over the
// real transport — sign-in, auth middleware, permissions and serialization are
// all exercised end-to-end. The same flow doubles as an e2e test and a
// staging/production health check. Actors are registered in pikku.config.json.
export const shopperBuysAnItem = pikkuScenario({
  title: 'Shopper buys an item',
  description: 'Browse the catalogue, fill a basket and pay for an order.',
  tags: ['checkout'],
  func: async ({ logger }, _input, { scenario, actors }) => {
    if (!actors?.shopper) {
      throw new Error(
        'shopperBuysAnItem needs the `shopper` actor — run via `pikku scenario run`'
      )
    }
    const shopper = actors.shopper

    // Each step names what the actor is trying to achieve, the exposed RPC
    // that achieves it, and who performs it. The call goes through the actor's
    // authenticated client — never internal dispatch.
    const basket = await scenario.do(
      'Shopper opens their basket',
      'getBasket',
      {},
      { actor: shopper }
    )

    const catalogue = await scenario.do(
      'Shopper browses the catalogue',
      'listItems',
      { search: 'mug' },
      { actor: shopper }
    )
    if (catalogue.items.length === 0)
      throw new Error('Catalogue has no mugs to buy')

    await scenario.do(
      'Shopper adds a mug to the basket',
      'addToBasket',
      {
        basketId: basket.basketId,
        itemId: catalogue.items[0]!.itemId,
        quantity: 1,
      },
      { actor: shopper }
    )

    const order = await scenario.do(
      'Shopper checks out',
      'createOrder',
      {
        basketId: basket.basketId,
        shippingAddress: {
          line1: '1 High Street',
          city: 'London',
          postcode: 'N1 1AA',
          country: 'GB',
        },
      },
      { actor: shopper }
    )

    // Durable polling step: re-invokes the RPC as the actor until the
    // predicate passes, or `within` elapses and fails the scenario.
    await scenario.expectEventually(
      'Order is paid',
      'getOrder',
      { orderId: order.orderId },
      (o: { status: string }) => o.status === 'paid',
      { actor: shopper, within: '30s', interval: 500 }
    )

    logger.info(
      `Scenario order ${order.orderId} paid: ${order.totalCents} cents`
    )
    return { orderId: order.orderId, totalCents: order.totalCents }
  },
})
```

### `pikkuScenarioHook` {#pikkuscenariohook}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Declares a scenario hook. Returns the function verbatim — a hook is never
registered, so this exists purely to give an inline hook a call site to be
contextually typed from, the way every other pikku primitive is.

```typescript
pikkuScenarioHook: <In = unknown, Ctx = unknown>(hook: PikkuFunctionScenario<In, void, Ctx>) => PikkuFunctionScenario<In, void, Ctx>
```

```typescript
/**
 * Empties the shopper's basket before the assistant is asked to fill it.
 *
 * The scenario's real assertion is "the basket now has the mug", and a basket
 * a previous run left full satisfies that whether or not the assistant did
 * anything. A hook runs outside the recorded steps, so the tidying never shows
 * up in the report as something the shopper did.
 */
const emptiesTheBasket = pikkuScenarioHook(
  async (_services, _data, { actors }) => {
    const basket = await actors.shopper.invoke('getBasket', {})
    for (const item of basket.items) {
      await actors.shopper.invoke('removeFromBasket', {
        basketId: basket.basketId,
        itemId: item.itemId,
      })
    }
  }
)
```

### `PikkuScenarioHook` {#pikkuscenariohook-2}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

A scenario lifecycle hook: the scenario's own `(services, data, wire)`
signature with its result discarded. `OutputSchema` types
`scenario.context` while the return type stays `void`.

```typescript
PikkuScenarioHook: PikkuScenarioHook<InputSchema, OutputSchema>
```

### `PikkuScenarioRef` {#pikkuscenarioref}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

A scenario as a feature references it. Any `pikkuScenario` export is
assignable; `In` is recovered from it so the paired form's `data` is
checked against that scenario's own input.

```typescript
PikkuScenarioRef: PikkuScenarioRef<In, Out>
```

<details>
<summary>Config keys (30)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `after` | `CorePikkuFunctionHook<any, any, any>` | Scenarios only: always runs after the body, in a `finally`. Throwing fails an otherwise-passing run; on an already-failed run it attaches as `cause` and never replaces the original error. |
| `approvalDescription` | `any` | Builds the sentence a human is shown when asked to approve a call, from that call's own input. |
| `approvalRequired` | `boolean` | Under an agent's `explicit` approval policy, calling this pauses for a human to approve it. |
| `audit` | `boolean \| { durability?: "best-effort" \| "transactional"; }` | Records every call in the audit log. `transactional` durability writes the entry in the same transaction as the work, so the two cannot disagree; `best-effort` does not hold the request up for it. |
| `auth` | `boolean` | Whether calling this requires a session, wherever it is wired. A wiring can be more permissive than the function, never less. |
| `before` | `CorePikkuFunctionHook<any, any, any>` | Scenarios only: runs before the scenario body, with the scenario's own signature. Throwing skips the body and fails the run, but `after` still runs. |
| `deploy` | `"auto" \| "serverless" \| "server"` | Where this function is deployed when the build can go either way. `auto` lets the analyser decide from what the function touches. |
| `description` | `string` | What the function does. An agent choosing between tools reads this, so it is worth more care than a comment would be. |
| `errors` | `(typeof PikkuError)[]` | Error classes this may throw, so each one's registered HTTP status is used instead of a 500. |
| `expose` | `boolean` | Makes the function callable from outside as `POST /rpc/&lt;name&gt;`. Without a session requirement, a permission or an addon gate, that means callable by anyone. |
| `func` <sup>required</sup> | `PikkuFunctionScenario<In, Out, Out>` | The body. Its first parameter is the services it needs, destructured inline so the build can tree-shake the rest away. |
| `input` | `any` | The input schema, which is also the input type — there is no separate generic to keep in step with it. |
| `mcp` | `boolean` | Offers the function to MCP clients as a tool, without a separate `wireMCPTool`. |
| `middleware` | `PikkuMiddleware[]` | Wraps this function wherever it is called from, unlike wiring middleware which only wraps one route into it. |
| `output` | `any` | The output schema, which is also the return type. Naming a type here instead is what produces PKU463. |
| `override` | `string` | Explicit logical name override; lets multiple exports share a versioned base |
| `permissions` | `CorePermissionGroup<PikkuPermission<In>>` | Checks that run before the body. Grouped names OR together, so any one passing admits the caller; use `scopes` to require rather than offer. |
| `permissionsInBody` | `boolean` | Declares that the body does its own permission check, so the function is not open despite naming no session, scope or permission. It grants nothing — asserting it falsely just disables the audit that would have caught the mistake. Requires `allow.permissionsInBody` in the config. |
| `readonly` | `boolean` | Declares that the function only reads. It is enforced rather than decorative: a read-only session is refused any function without it, and an agent may call one without asking permission first. |
| `remote` | `boolean` | Publishes the function in this package's remote surface, which is what a `wireRemoteAddon` consumer gets a typed client for. |
| `requiresActor` | `boolean` | Scenario steps only, and set by the definer rather than by hand: this step needs a persona, so the runner injects `wire.actor`. |
| `scopes` | `import("#pikku/scopes/pikku-scopes.gen.js").ScopeId[]` | Scopes the session must hold. All are required, and checked before `permissions`, which OR together — a scope only narrows access. |
| `skip` | `string` | Scenarios only: why this scenario is held out of a default run. Reported as skipped rather than quietly omitted; naming it in `--flows` runs it. |
| `surfaces` | `ScenarioSurface[]` | Scenario steps only: which surfaces this step declares a binding for. The runner uses it to pick a binding, decide whether to provision a browser, and report how much of the flow each surface actually covers. |
| `tags` | `string[]` | Filters this function in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |
| `title` | `string` | A human name for this function, shown wherever it is listed rather than called. |
| `version` | `number` | Which version of this contract this export is. Two exports sharing an `override` and differing here are the same function at two versions. |
| `workflowQueued` | `boolean` | When true, workflow steps calling this function are dispatched via the queue. No queue service configured is a hard error. Defaults to false (inline). |
| `workflowRetries` | `number` | Number of retry attempts when this function is used as a workflow step. |
| `workflowTimeout` | `string` | Timeout for this function when used as a workflow step (e.g. '30s', '5m'). |

</details>

### `pikkuScenarioStep` {#pikkuscenariostep}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

A named, reusable scenario step, declaring one implementation per surface an
actor can drive it through.

The step's identity is what the actor is trying to do; which surface carries
it out is a binding. That is what lets one ladder run through a real browser,
over the websocket, or entirely server-side — and what makes "how much of this
flow can a human actually reach" a number rather than a guess.

Steps are deliberately NOT registered as RPCs: a browser-driving step must
never be network-callable.

```typescript
pikkuScenarioStep: { <InputSchema extends StandardSchemaV1 | undefined = undefined, OutputSchema extends StandardSchemaV1 | undefined = undefined>(config: PikkuScenarioStepConfigWithSchema<InputSchema, OutputSchema, true> & { actor: true; }): PikkuFunctionConfig<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "scenarioStep" | "browser" | "cli", PikkuFunctionScenarioStep<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "browser" | "cli" | "default">, InputSchema, OutputSchema>; <In, Out = unknown>(config: PikkuScenarioStepConfig<In, Out, true> & { actor: true; }): PikkuFunctionConfig<In, Out, "scenarioStep" | "browser" | "cli">; <InputSchema extends StandardSchemaV1 | undefined = undefined, OutputSchema extends StandardSchemaV1 | undefined = undefined>(config: PikkuScenarioStepConfigWithSchema<InputSchema, OutputSchema, true> & { browser: {}; }): PikkuFunctionConfig<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "scenarioStep" | "browser" | "cli", PikkuFunctionScenarioStep<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "browser" | "cli" | "default">, InputSchema, OutputSchema>; <In, Out = unknown>(config: PikkuScenarioStepConfig<In, Out, true> & { browser: {}; }): PikkuFunctionConfig<In, Out, "scenarioStep" | "browser" | "cli">; <InputSchema extends StandardSchemaV1 | undefined = undefined, OutputSchema extends StandardSchemaV1 | undefined = undefined>(config: PikkuScenarioStepConfigWithSchema<InputSchema, OutputSchema>): PikkuFunctionConfig<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "scenarioStep" | "browser" | "cli", PikkuFunctionScenarioStep<InputSchema extends StandardSchemaV1 ? InferSchemaOutput<InputSchema> : unknown, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, "browser" | "cli" | "default">, InputSchema, OutputSchema>; <In, Out = unknown>(config: PikkuScenarioStepConfig<In, Out>): PikkuFunctionConfig<In, Out, "scenarioStep" | "browser" | "cli">; }
```

```typescript
export const opensPage = pikkuScenarioStep({
  name: 'opensPage',
  description: 'opens an app page as the signed-in actor',
  template: 'opens {path}',
  input: OpensPageInput,
  output: OpensPageOutput,
  browser: async (_services, { path }, { browser }) => {
    const actor = session(browser)
    const status = await actor.gotoApp(path)
    let pathname = path
    try {
      pathname = new URL(actor.page.url()).pathname
    } catch {
      // A page that never navigated keeps the requested path — the assertion in
      // the scenario is what reports that, not a thrown URL parse error.
    }
    return { pathname, status }
  },
})
```

### `pollUntil` {#polluntil}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/workflow`</span>

Retries an assertion until it passes or the timeout runs out — for the
eventually-consistent parts of a scenario (a queued job, a projection).

```typescript
pollUntil: <T>(attempt: () => Promise<T | undefined> | T | undefined, { timeoutMs, intervalMs }?: PollOptions) => Promise<T | undefined>
```

```typescript
export const awaitsCheckout = pikkuScenarioStep<
  { run: CheckoutRun; timeoutMs?: number },
  CheckoutRun
>({
  name: 'awaitsCheckout',
  description: 'waits for a started checkout run to reach a terminal status',
  template: 'waits for the checkout to finish',
  default: async (_services, { run, timeoutMs }, { scenarioStep }) => {
    if (!run.runId) throw new Error(`Checkout never started: ${run.serialized}`)
    const { apiUrl } = requireScenarioEnv(scenarioStep)
    let last = ''
    const finished = await pollUntil(
      async () => {
        const response = await readScenarioHttpResponse<
          { status?: string } | undefined
        >(
          await fetch(`${apiUrl}/workflow/checkoutWorkflow/status/${run.runId}`)
        )
        last = response.serialized
        const outcome = response.body?.status
        return outcome && TERMINAL.includes(outcome)
          ? { ...response, runId: run.runId, outcome }
          : undefined
      },
      { timeoutMs: timeoutMs ?? 30_000, intervalMs: 100 }
    )
    if (!finished) {
      throw new Error(`Run ${run.runId} never finished: ${last}`)
    }
    return finished
  },
})
```

### `postScenarioJson` {#postscenariojson}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/services`</span>

POST JSON somewhere and report what came back, without throwing on a 4xx/5xx.

Every scenario that reaches past a persona was writing this by hand — the same
`content-type`, the same `JSON.stringify`, the same drain — and the copies had
drifted: some returned `res.json()`, which loses the status and throws
outright when the target answers an empty body or an HTML error page. A
refusal is the expected outcome of a permissions scenario, so it has to
survive as data.

```typescript
postScenarioJson: <T = unknown>(url: string, { body, headers, method, fetch: send, }?: ScenarioJsonRequest) => Promise<ScenarioHttpResponse<T>>
```

```typescript
export const startsCheckout = pikkuScenarioStep<
  { basketId: string; userId: string },
  CheckoutRun
>({
  name: 'startsCheckout',
  description: 'starts the checkout workflow over HTTP and reports the run',
  template: 'starts checkout for {basketId}',
  default: async (_services, { basketId, userId }, { scenarioStep }) => {
    const { apiUrl } = requireScenarioEnv(scenarioStep)
    const response = await postScenarioJson<{ runId?: string } | undefined>(
      `${apiUrl}/workflow/checkoutWorkflow/start`,
      {
        body: {
          data: {
            basketId,
            userId,
            shippingAddress: {
              line1: '1 High Street',
              city: 'London',
              postcode: 'N1 1AA',
              country: 'GB',
            },
          },
        },
      }
    )
    return { ...response, runId: response.body?.runId }
  },
})
```

### `readScenarioHttpResponse` {#readscenariohttpresponse}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/services`</span>

Drain a response into the shape a step can carry: the parsed body (an empty
one counting as no body at all) alongside the text it was parsed from.

`invokeRaw` returns this, and a step that has to reach past a persona — a
route with no RPC, an identity no persona can hold — reaches for this rather
than writing the same record by hand.

```typescript
readScenarioHttpResponse: <T = unknown>(res: Response) => Promise<ScenarioHttpResponse<T>>
```

```typescript
export const awaitsCheckout = pikkuScenarioStep<
  { run: CheckoutRun; timeoutMs?: number },
  CheckoutRun
>({
  name: 'awaitsCheckout',
  description: 'waits for a started checkout run to reach a terminal status',
  template: 'waits for the checkout to finish',
  default: async (_services, { run, timeoutMs }, { scenarioStep }) => {
    if (!run.runId) throw new Error(`Checkout never started: ${run.serialized}`)
    const { apiUrl } = requireScenarioEnv(scenarioStep)
    let last = ''
    const finished = await pollUntil(
      async () => {
        const response = await readScenarioHttpResponse<
          { status?: string } | undefined
        >(
          await fetch(`${apiUrl}/workflow/checkoutWorkflow/status/${run.runId}`)
        )
        last = response.serialized
        const outcome = response.body?.status
        return outcome && TERMINAL.includes(outcome)
          ? { ...response, runId: run.runId, outcome }
          : undefined
      },
      { timeoutMs: timeoutMs ?? 30_000, intervalMs: 100 }
    )
    if (!finished) {
      throw new Error(`Run ${run.runId} never finished: ${last}`)
    }
    return finished
  },
})
```

### `requireScenarioEnv` {#requirescenarioenv}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/workflow`</span>

The environment the current scenario run targets, or a throw explaining that
the run carries none. Use it in a step that needs the target's URLs.

```typescript
requireScenarioEnv: (scenarioStep: PikkuScenarioStepWire | undefined) => ScenarioEnvironment
```

```typescript
export const startsCheckout = pikkuScenarioStep<
  { basketId: string; userId: string },
  CheckoutRun
>({
  name: 'startsCheckout',
  description: 'starts the checkout workflow over HTTP and reports the run',
  template: 'starts checkout for {basketId}',
  default: async (_services, { basketId, userId }, { scenarioStep }) => {
    const { apiUrl } = requireScenarioEnv(scenarioStep)
    const response = await postScenarioJson<{ runId?: string } | undefined>(
      `${apiUrl}/workflow/checkoutWorkflow/start`,
      {
        body: {
          data: {
            basketId,
            userId,
            shippingAddress: {
              line1: '1 High Street',
              city: 'London',
              postcode: 'N1 1AA',
              country: 'GB',
            },
          },
        },
      }
    )
    return { ...response, runId: response.body?.runId }
  },
})
```

### `ScenarioHttpResponse` {#scenariohttpresponse}

<span className="api-symbol-meta">interface · re-exported from `@pikku/core/services`</span>

What the transport answered, for a step that treats the status as data.

An HTTP response with its body already drained: the stream can only be read
once, and a step's return value crosses into the run record, so the response
object itself cannot travel. This is the shape every caller ends up with.

```typescript
ScenarioHttpResponse: ScenarioHttpResponse<T>
```

<details>
<summary>Config keys (4)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `body` <sup>required</sup> | `T` | The parsed JSON body — or, when the body was not JSON, the raw text it was parsed from, so an HTML error page is still readable rather than lost. `undefined` for an empty response. `T` is a claim the caller makes, not one the transport checked: a step that knows the route's payload names it here instead of casting at every use. |
| `ok` <sup>required</sup> | `boolean` |  |
| `serialized` <sup>required</sup> | `string` | The whole body as text, so an assertion can search it without knowing the payload's shape — and so an error body that is HTML rather than JSON still says what went wrong. |
| `status` <sup>required</sup> | `number` |  |

</details>

### `ScenarioSurface` {#scenariosurface}

<span className="api-symbol-meta">type · re-exported from `@pikku/core/workflow`</span>

How an actor drives the system for one step.

A step declares one implementation per surface it supports, and the runner
picks between them — so the same ladder can run through a real browser, over
the websocket, or entirely server-side.

`default` is the floor: it is what every other surface falls back to, so it
can never itself fall back.

### `TestIdSelector` {#testidselector}

<span className="api-symbol-meta">interface · re-exported from `@pikku/core/workflow`</span>

How a browser step names an element.

A `data-testid` on its own is rarely enough to name exactly one: `where`
matches the element's own data attributes (so a step asserts a status
without reading translated copy back to the app), `prefix` matches a family
of ids, `containing` picks the match holding a piece of text, and `within`
scopes the lookup to one row or section.

Declared here so a step's input type is structural; the driver
(`@pikku/playwright`) is what resolves it against a real page.

<details>
<summary>Config keys (5)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `containing` | `string` | Narrow to the one match holding this text. |
| `prefix` | `boolean` | Match every test id beginning with `testId`, e.g. every `flow-card-*`. |
| `testId` <sup>required</sup> | `string` |  |
| `where` | `Record<string, string>` | Data attributes the element must also carry, e.g. `&#123; 'data-open': 'true' &#125;`. |
| `within` | `TestIdSelector` | Scope the lookup to one enclosing element, e.g. the row for one user. |

</details>

### `TypedPersonas` {#typedpersonas}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

The personas this project declares, keyed by name — the `actors` a scenario
step runs as.

### `TypedScenario` {#typedscenario}

<span className="api-symbol-meta">type · generated into `.pikku` by the CLI</span>

`Out` types `scenario.context`.

```typescript
TypedScenario: TypedScenario<Out>
```

<details>
<summary>Config keys (13)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `approval` <sup>required</sup> | `WorkflowWireApproval` | Suspend workflow until a human records a decision against this gate |
| `context` <sup>required</sup> | `ScenarioContext<Out>` | Scratch the body writes and the `before`/`after` hooks read. A hook is a separate function and cannot see the body's locals, so this is how teardown learns the ids the body minted. Deliberately *not* a world: it is scoped to one run, and scenario steps cannot reach it. Steps stay pure functions of their declared inputs, so the ladder in the report remains a complete account of what a step saw. |
| `expectError` <sup>required</sup> | `<TInput = any>(stepName: string, rpcName: string, data: TInput, options?: WorkflowExpectE…` | Error-path step: succeeds only when the RPC throws; returns the message |
| `expectEventually` <sup>required</sup> | `<TOutput = any, TInput = any>(stepName: string, rpcName: string, data: TInput, predicate:…` | Durable polling step: invoke `rpcName` (as an actor when `options.actor` is set) until `predicate` passes or `options.within` elapses. |
| `expectScore` <sup>required</sup> | `(stepName: string, runId: string, scorerName: string, options?: WorkflowExpectScoreOption…` | Grade-assertion step: runs one declared scorer against a finished agent run and asserts the score. Returns the grade, so a scenario can report the reason a judge gave rather than only that it fell short. |
| `expectService` <sup>required</sup> | `(stepName: string, serviceMethod: string, options?: WorkflowExpectServiceOptions) => Prom…` | Stub-assertion step: asserts `service.method` was called on the target server |
| `getRun` <sup>required</sup> | `() => Promise<WorkflowRun>` | Get the current workflow run |
| `name` <sup>required</sup> | `string` | The workflow name |
| `pikkuUserId` | `string` | Pikku user ID propagated from the originating request for credential resolution |
| `runId` <sup>required</sup> | `string` | The current run ID |
| `runScheduledTask` <sup>required</sup> | `(name: string) => Promise<unknown>` |  |
| `sleep` <sup>required</sup> | `WorkflowWireSleep` | Sleep for a duration |
| `suspend` <sup>required</sup> | `WorkflowWireSuspend` | Suspend workflow until explicitly resumed |

</details>

### `TypedScenarioSteps` {#typedscenariosteps}

<span className="api-symbol-meta">interface · generated into `.pikku` by the CLI</span>

The typed half of a scenario wire: `given`/`when`/`then`, narrowed to the
names declared by `pikkuScenarioStep` in this project. `given` and `when`
differ only in the prose the reporter renders; `then` additionally makes the
step's bindings witnesses rather than alternatives.

## Inside an addon

Addon authors get this door unchanged as `#pikku/addon/scenarios` — same 24 exports, same shapes. Only the import specifier differs.

---

Run `npx pikku doc scenarios` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
