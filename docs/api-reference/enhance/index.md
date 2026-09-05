---
title: 'Enhance it'
sidebar_position: 0
description: 'Errors, middleware, secrets, variables and addons — what wraps a function without changing it.'
---

# Enhance it

Errors, middleware, secrets, variables and addons — what wraps a function without changing it.

| Door | Exports | What it is for |
| --- | --- | --- |
| [`#pikku/addon`](./addon.md) | 2 | Installs an addon into this application, on its own or over rpc against a remote one. |
| [`#pikku/error`](./error.md) | 49 | The errors your functions throw and the HTTP status each one maps to, so a thrown error is part of the contract rather than a stack trace. |
| [`#pikku/middleware`](./middleware.md) | 17 | Middleware is one concept regardless of what it ends up attached to, so it is one import: define it here, then register it globally, against a tag, or against… |
| [`#pikku/secrets`](./secrets.md) | 3 | Secrets a function can use without ever holding, declared here and resolved by the secrets service at runtime. |
| [`#pikku/variables`](./variables.md) | 3 | Configuration a function reads through the variables service, declared once so a deployment can be checked for what it is missing. |
