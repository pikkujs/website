---
sidebar_position: 1
title: Getting Started
description: Launch and use the Pikku Console
ai: true
---

# Getting Started with the Console

## Launch the Console

The Console ships with the CLI — there's nothing extra to install. Start your dev server:

```bash
npx pikku dev
```

Then open **`http://localhost:3000/console`**. The Console connects to the same server your API runs on, so it sees exactly what's running: functions, wirings, secrets, the dev database, and everything else.

As you add or modify functions, wirings, and configuration, the dev server regenerates the registry and the Console picks up the changes automatically.

## Production Servers

`pikku serve` (the bundled bun/node runner) doesn't mount the Console unless you ask for it:

```bash
npx pikku serve --console
```

That serves the same UI at `/console` on the server's port — same-origin, first-party cookies, no separate process.

## Authentication

The Console uses your application's own authentication — sign in with the same credentials as any admin user of your app. What you can see and do in the Console is governed by the same permissions as the rest of your application.

Two conveniences on top of that:

- **Dev quick login** — when running locally via `pikku dev` or `pikku serve`, the login screen shows a one-click quick-login button that seeds and signs in an `admin@pikku.dev` admin. It only works on loopback hosts; set `PIKKU_DEV_QUICK_LOGIN=false` to turn it off.
- **Bearer token** — an external Console (served cross-origin, talking to your server) can't use the session cookie. Set the `PIKKU_CONSOLE_TOKEN` secret on the server and the Console's requests authenticate with `Authorization: Bearer <token>` instead; while the secret is unset the token path is inert.

## Per-Environment

The Console is designed to run per-environment. Each environment (development, staging, production) has its own Console that reflects:

- The functions and wirings deployed to that environment
- Environment-specific secrets and variables
- The runtime configuration for that deployment

Your staging Console shows exactly what's deployed to staging, and your production Console shows production — no confusion between environments.

## Next Steps

- **[Features](./features.md)** — Explore all Console sections and capabilities
- **[Pikku CLI](../pikku-cli/index.mdx)** — Learn more about the CLI commands
