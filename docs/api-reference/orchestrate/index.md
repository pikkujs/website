---
title: 'Orchestrate it'
sidebar_position: 0
description: 'Workflows and agents — composing functions into something longer-lived than one call.'
---

# Orchestrate it

Workflows and agents — composing functions into something longer-lived than one call.

| Door | Exports | What it is for |
| --- | --- | --- |
| [`#pikku/agent`](./agent.md) | 7 | Defines an AI agent, the tools it may call and the scorers that judge what it did. |
| [`#pikku/workflow`](./workflow.md) | 6 | Composes functions into a durable workflow whose steps survive a restart and retry on their own. |
