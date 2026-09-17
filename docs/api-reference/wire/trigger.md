---
title: '#pikku/trigger'
sidebar_label: '#pikku/trigger'
sidebar_position: 8
description: 'Wires a function to an event a source emits, rather than to a caller that asks for it.'
paper: true
---

# `#pikku/trigger`

Wires a function to an event a source emits, rather than to a caller that asks for it.

```typescript
import { pikkuTriggerFunc, wireTrigger, wireTriggerSource } from '#pikku/trigger'
```

## Exports

<ApiExports items={[{"name":"pikkuTriggerFunc","kind":"function","anchor":"pikkutriggerfunc","summary":"Creates a trigger function configuration. Use this to define trigger functions that set up subscriptions."},{"name":"wireTrigger","kind":"function","anchor":"wiretrigger","summary":"Registers a trigger with the Pikku framework. Declares a trigger name and its target pikku function. Runs everywhere — inspector extracts at build time."},{"name":"wireTriggerSource","kind":"function","anchor":"wiretriggersource","summary":"Registers a trigger source with the Pikku framework. Provides the subscription function and input data. Only imported in the trigger worker process."}]} />

## Reference

<ApiSymbol>

### `pikkuTriggerFunc` {#pikkutriggerfunc}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Creates a trigger function configuration.
Use this to define trigger functions that set up subscriptions.

</ApiSection>

<ApiSection label="Signature">

```typescript
pikkuTriggerFunc: { <InputSchema extends StandardSchemaV1, OutputSchema extends StandardSchemaV1 | undefined = undefined>(config: PikkuTriggerFunctionConfigWithSchema<InputSchema, OutputSchema>): PikkuTriggerFunctionConfig<InferSchemaOutput<InputSchema>, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, InputSchema, OutputSchema>; <TInput, TOutput = unknown>(triggerOrConfig: PikkuTriggerFunction<TInput, TOutput> | PikkuTriggerFunctionConfig<TInput, TOutput>): PikkuTriggerFunctionConfig<TInput, TOutput>; }
```

</ApiSection>

<ApiSection label="Example">

```typescript
export const redisSubscribeTrigger = pikkuTriggerFunc<
  { channel: string },
  { message: string }
>(async ({ redis }, { channel }, { trigger }) => {
  const subscriber = redis.duplicate()
  await subscriber.subscribe(channel, (msg) => {
    trigger.invoke({ message: msg })
  })
  return () => subscriber.unsubscribe()
})

export const redisSubscribeTrigger = pikkuTriggerFunc({
  title: 'Redis Subscribe Trigger',
  description: 'Listens to Redis pub/sub channel',
  input: z.object({ channel: z.string() }),
  output: z.object({ message: z.string() }),
  func: async ({ redis }, { channel }, { trigger }) => {
    const subscriber = redis.duplicate()
    await subscriber.subscribe(channel, (msg) => {
      trigger.invoke({ message: msg })
    })
    return () => subscriber.unsubscribe()
  }
})
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `wireTrigger` {#wiretrigger}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Registers a trigger with the Pikku framework.
Declares a trigger name and its target pikku function.
Runs everywhere — inspector extracts at build time.

</ApiSection>

<ApiSection label="Signature">

```typescript
wireTrigger: (trigger: TriggerWiring) => void
```

</ApiSection>

<ApiSection label="Config keys (4)">

| Key | Type | What it does |
| --- | --- | --- |
| `description` | `string` | What firing this trigger means, for whoever is reading the wiring rather than writing it. |
| `func` <sup>required</sup> | `any` | The function to run each time the trigger fires. |
| `name` <sup>required</sup> | `string` | What a `wireTriggerSource` points at to fire this trigger. It is the contract between the two, so both must spell it the same. |
| `tags` | `string[]` | Filters this trigger in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |

</ApiSection>

<ApiSection label="Example">

```typescript
wireTrigger({
  name: 'low-stock',
  func: onLowStock,
})
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `wireTriggerSource` {#wiretriggersource}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Registers a trigger source with the Pikku framework.
Provides the subscription function and input data.
Only imported in the trigger worker process.

</ApiSection>

<ApiSection label="Signature">

```typescript
wireTriggerSource: <TInput = unknown, TOutput = unknown>(source: TriggerSource<TInput, TOutput>) => void
```

</ApiSection>

<ApiSection label="Example">

```typescript
/**
 * The other half of the same trigger, and the shape a source is actually for:
 * something outside the app pushes, and the app listens.
 *
 * `name` is the contract — it must spell the `wireTrigger` above exactly, or
 * the two never meet. Compare the sweep: a source that starts its own timer is
 * `wireScheduler` written badly, while a source that holds a subscription is
 * the only thing that can do this at all.
 */
wireTriggerSource({
  name: 'low-stock',
  func: warehouseStockFeed,
  input: { threshold: 5 },
})
```

</ApiSection>

</ApiSymbol>

## Inside an addon

Addon authors import this door as `#pikku/addon/trigger`, with one difference:

- Not available: `wireTrigger`, `wireTriggerSource` — an addon ships functions, it does not wire them. The application that installs the addon does that.

---

Run `npx pikku doc trigger` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
