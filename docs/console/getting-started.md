---
sidebar_position: 1
title: Getting Started
description: Launch and use the Pikku Console
---

# Getting Started with the Console

## Prerequisites

You need a Pikku project with generated `.pikku/` output. If you haven't already, run the CLI to generate it:

```bash
npx pikku
```

## Launch the Console

Start the Console with a single command:

```bash
npx pikku console
```

This launches the Console UI in your browser, connected to your current environment.

## Development Workflow

For the best development experience, run the CLI in watch mode alongside the Console:

```bash
# Terminal 1: Watch for changes and regenerate
npx pikku watch

# Terminal 2: Launch the Console
npx pikku console
```

As you add or modify functions, wirings, and configuration, the Console picks up changes automatically via the regenerated `.pikku/` output.

## Per-Environment Deployment

The Console is designed to run per-environment. Each environment (development, staging, production) has its own Console instance that reflects:

- The functions and wirings deployed to that environment
- Environment-specific secrets and variables
- The runtime configuration for that deployment

This means your staging Console shows exactly what's deployed to staging, and your production Console shows production — no confusion between environments.

## Next Steps

- **[Features](./features.md)** — Explore all Console sections and capabilities
- **[Pikku CLI](../pikku-cli/index.mdx)** — Learn more about the CLI commands
