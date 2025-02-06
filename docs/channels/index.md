---
sidebar_position: 0
title: Introduction
description: Pikku Channels
---

Channels, such as WebSockets, provide an excellent way to establish bidirectional communication within an application. They enable real-time interaction and data exchange, making them a powerful tool for dynamic applications.

The function-based approach described here is inspired by AWS Serverless WebSockets, allowing flexibility to implement channels through traditional WebSocket servers (like `ws` or `uws`) or serverless platforms. This versatility ensures compatibility with various architectures and deployment strategies.

When implementing channels, the choice between **stateful** and **stateless** approaches is crucial. Each comes with unique trade-offs, particularly when working with serverless environments.

### Stateless vs. Stateful Functions

- **Stateless Functions**:
  - Execute a task, optionally send a response, and then terminate.
  - Ideal for serverless platforms where functions are billed per execution.
  - Subscriptions are possible but must be **offloaded to a separate process** (e.g., a dedicated service or worker) to maintain efficiency and avoid the high costs of keeping a serverless function running.

- **Stateful Functions**:
  - Can maintain persistent resources like timers or subscriptions directly within the function.
  - Suited for environments running on dedicated machines, as they allow long-lived connections.
  - Not recommended for serverless due to the high costs of maintaining continuous function activity.

### Choosing the Right Approach

The decision to use a stateful or stateless approach depends largely on your application's requirements and deployment environment. Stateless functions are preferred for cost efficiency in serverless architectures, especially when subscriptions are offloaded to separate, purpose-built processes. Stateful functions, on the other hand, work better for scenarios where maintaining long-lived connections is essential, typically in non-serverless setups.

In the following sections, we’ll explore these concepts further and provide practical guidance on implementing both approaches effectively. For now, let’s dive into how channels are currently implemented and the possibilities they offer.
