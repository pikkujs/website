---
title: '#pikku/trigger'
sidebar_label: '#pikku/trigger'
sidebar_position: 8
description: 'Wires a function to an event a source emits, rather than to a caller that asks for it.'
---

# `#pikku/trigger`

Wires a function to an event a source emits, rather than to a caller that asks for it.

```typescript
import { pikkuTriggerFunc, wireTrigger, wireTriggerSource } from '#pikku/trigger'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`pikkuTriggerFunc`](#pikkutriggerfunc) | function | Creates a trigger function configuration. Use this to define trigger functions that set up subscriptions. |
| [`wireTrigger`](#wiretrigger) | function | Registers a trigger with the Pikku framework. Declares a trigger name and its target pikku function. Runs everywhere — inspector extracts at build time. |
| [`wireTriggerSource`](#wiretriggersource) | function | Registers a trigger source with the Pikku framework. Provides the subscription function and input data. Only imported in the trigger worker process. |

## Reference

### `pikkuTriggerFunc` {#pikkutriggerfunc}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Creates a trigger function configuration.
Use this to define trigger functions that set up subscriptions.

```typescript
pikkuTriggerFunc: { <InputSchema extends StandardSchemaV1, OutputSchema extends StandardSchemaV1 | undefined = undefined>(config: PikkuTriggerFunctionConfigWithSchema<InputSchema, OutputSchema>): PikkuTriggerFunctionConfig<InferSchemaOutput<InputSchema>, OutputSchema extends StandardSchemaV1 ? InferSchemaOutput<OutputSchema> : unknown, InputSchema, OutputSchema>; <TInput, TOutput = unknown>(triggerOrConfig: PikkuTriggerFunction<TInput, TOutput> | PikkuTriggerFunctionConfig<TInput, TOutput>): PikkuTriggerFunctionConfig<TInput, TOutput>; }
```

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

### `wireTrigger` {#wiretrigger}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Registers a trigger with the Pikku framework.
Declares a trigger name and its target pikku function.
Runs everywhere — inspector extracts at build time.

```typescript
wireTrigger: (trigger: TriggerWiring) => void
```

<details>
<summary>Config keys (4)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `description` | `string` | What firing this trigger means, for whoever is reading the wiring rather than writing it. |
| `func` <sup>required</sup> | `any` | The function to run each time the trigger fires. |
| `name` <sup>required</sup> | `string` | What a `wireTriggerSource` points at to fire this trigger. It is the contract between the two, so both must spell it the same. |
| `tags` | `string[]` | Filters this trigger in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |

</details>

```typescript
wireTrigger({
  name: 'low-stock',
  func: onLowStock,
})
```

### `wireTriggerSource` {#wiretriggersource}

<span className="api-symbol-meta">function · generated into `.pikku` by the CLI</span>

Registers a trigger source with the Pikku framework.
Provides the subscription function and input data.
Only imported in the trigger worker process.

```typescript
wireTriggerSource: <TInput = unknown, TOutput = unknown>(source: TriggerSource<TInput, TOutput>) => void
```

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

## Inside an addon

Addon authors import this door as `#pikku/addon/trigger`, with one difference:

- Not available: `wireTrigger`, `wireTriggerSource` — an addon ships functions, it does not wire them. The application that installs the addon does that.

---

Run `npx pikku doc trigger` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
