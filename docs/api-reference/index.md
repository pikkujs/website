---
title: API Reference
sidebar_position: 0
description: 'Every export pikku gives you, by the door you import it from — 20 doors, 174 exports.'
---

# API Reference

This is the whole surface pikku hands you: **20 doors, 174 exports**, generated from `@pikku/cli@0.12.133`.

This is the door you open to build a service. The CLI generates a barrel per concern into .pikku, package.json maps #pikku onto it, and everything below runs in the order you actually meet it while building — write a function, give it what it needs, decide how the world reaches it, say who may call it, compose it, then drive the whole thing in a test.

## You import from `#pikku`, not `@pikku`

The CLI generates a barrel per concern into `.pikku`, and `package.json` maps `#pikku` onto it:

```json title="package.json"
{
  "imports": {
    "#pikku/*": "./.pikku/*"
  }
}
```

That indirection is the point. `#pikku/http` is *your* project's HTTP door — it carries your session type, your services and your function names, so `wireHTTP` knows what you may pass it. Importing the same helper from `@pikku/core` gets you the generic version with none of that.

## The same thing in your terminal

Everything on these pages is printed by the CLI, from the surface that ships inside the version you have installed:

```bash
npx pikku doc              # the index: every door, grouped as below
npx pikku doc http         # one door: what it exports, and how
npx pikku doc wireHTTP     # one export: signature, config keys, examples
npx pikku doc http queue   # several at once
npx pikku doc --ai         # the same, plus the skill to load per door
npx pikku doc --addon      # the addon surface instead of the app one
```

:::tip For agents
`pikku doc --ai` is the one to point a coding agent at. It names the skill that teaches each door, so the agent loads *how* only for the doors it actually needs — and the export list it reads is the installed version, not whatever it remembers.
:::

## The doors

They are grouped in the order you meet them while building.

### Create a function

The definers every wiring eventually points at, and the config and services they run against.

| Door | Exports | What it is for |
| --- | --- | --- |
| [`#pikku/function`](./create/function.md) | 20 | The function definers every wiring eventually points at, and the types they are written against. A function is handed services, then its input, then the wire —… |
| [`#pikku/setup`](./create/setup.md) | 4 | The three factories a project declares exactly once — its config, its singleton services and its per-wire services. An addon declares the same three in its own… |

### Enhance it

Errors, middleware, secrets, variables and addons — what wraps a function without changing it.

| Door | Exports | What it is for |
| --- | --- | --- |
| [`#pikku/addon`](./enhance/addon.md) | 2 | Installs an addon into this application, on its own or over rpc against a remote one. |
| [`#pikku/error`](./enhance/error.md) | 49 | The errors your functions throw and the HTTP status each one maps to, so a thrown error is part of the contract rather than a stack trace. |
| [`#pikku/middleware`](./enhance/middleware.md) | 17 | Middleware is one concept regardless of what it ends up attached to, so it is one import: define it here, then register it globally, against a tag, or against… |
| [`#pikku/secrets`](./enhance/secrets.md) | 3 | Secrets a function can use without ever holding, declared here and resolved by the secrets service at runtime. |
| [`#pikku/variables`](./enhance/variables.md) | 3 | Configuration a function reads through the variables service, declared once so a deployment can be checked for what it is missing. |

### Wire it up

One `wire*` call per protocol. The function does not change; only how the world reaches it does.

| Door | Exports | What it is for |
| --- | --- | --- |
| [`#pikku/channel`](./wire/channel.md) | 5 | Wires a function to a websocket channel, its message routes and its pub/sub topics. |
| [`#pikku/cli`](./wire/cli.md) | 4 | Wires a function as a command, with its flags and arguments derived from the function input. |
| [`#pikku/gateway`](./wire/gateway.md) | 8 | Wires a function behind a gateway that receives requests on behalf of another system. |
| [`#pikku/http`](./wire/http.md) | 3 | Wires a function to an HTTP route, with the path parameters checked against the function input. |
| [`#pikku/mcp`](./wire/mcp.md) | 5 | Wires a function as an MCP tool, resource or prompt for a model to call. |
| [`#pikku/queue`](./wire/queue.md) | 1 | Wires a function as a queue worker, so a job on the queue runs the same handler an HTTP route would. |
| [`#pikku/scheduler`](./wire/scheduler.md) | 1 | Wires a function to a cron expression to run it on a schedule. |
| [`#pikku/trigger`](./wire/trigger.md) | 3 | Wires a function to an event a source emits, rather than to a caller that asks for it. |

### Guard it

Who may call a function, and under which scope or role.

| Door | Exports | What it is for |
| --- | --- | --- |
| [`#pikku/auth`](./guard/auth.md) | 7 | Who may call a function, and what the call is made with: permissions that see the request, auth gates that run before it, and the credentials a function borrow… |
| [`#pikku/scopes`](./guard/scopes.md) | 2 | The scopes a caller can hold and the roles that grant them, gating a call outside the permission pool. |

### Orchestrate it

Workflows and agents — composing functions into something longer-lived than one call.

| Door | Exports | What it is for |
| --- | --- | --- |
| [`#pikku/agent`](./orchestrate/agent.md) | 7 | Defines an AI agent, the tools it may call and the scorers that judge what it did. |
| [`#pikku/workflow`](./orchestrate/workflow.md) | 6 | Composes functions into a durable workflow whose steps survive a restart and retry on their own. |

### Test it

Features, scenarios and steps that drive the whole system the way a user would.

| Door | Exports | What it is for |
| --- | --- | --- |
| [`#pikku/scenarios`](./test/scenarios.md) | 24 | Drives features and scenarios against a real running server, in the vocabulary a user would use. |

## Building an addon instead?

An addon ships functions someone else wires, so it gets a parallel set of doors under `#pikku/addon/*` — the same shapes, minus the ones that only make sense in an application. [The addon surface](./addons.md) has every one of them, door by door, and `npx pikku doc --addon` prints the same thing.
