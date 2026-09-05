---
title: 'Wire it up'
sidebar_position: 0
description: 'One `wire*` call per protocol. The function does not change; only how the world reaches it does.'
---

# Wire it up

One `wire*` call per protocol. The function does not change; only how the world reaches it does.

| Door | Exports | What it is for |
| --- | --- | --- |
| [`#pikku/channel`](./channel.md) | 5 | Wires a function to a websocket channel, its message routes and its pub/sub topics. |
| [`#pikku/cli`](./cli.md) | 4 | Wires a function as a command, with its flags and arguments derived from the function input. |
| [`#pikku/gateway`](./gateway.md) | 8 | Wires a function behind a gateway that receives requests on behalf of another system. |
| [`#pikku/http`](./http.md) | 3 | Wires a function to an HTTP route, with the path parameters checked against the function input. |
| [`#pikku/mcp`](./mcp.md) | 5 | Wires a function as an MCP tool, resource or prompt for a model to call. |
| [`#pikku/queue`](./queue.md) | 1 | Wires a function as a queue worker, so a job on the queue runs the same handler an HTTP route would. |
| [`#pikku/scheduler`](./scheduler.md) | 1 | Wires a function to a cron expression to run it on a schedule. |
| [`#pikku/trigger`](./trigger.md) | 3 | Wires a function to an event a source emits, rather than to a caller that asks for it. |
