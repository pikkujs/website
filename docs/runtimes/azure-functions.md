---
title: Azure Functions
description: Deploy Pikku to Azure Functions
hide_title: true
image: /img/logos/azure-light.svg
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

Pikku supports Azure Functions through two paths:

1. **`pikku deploy --provider azure`** — automated deployment that generates Azure Functions v4 entry points with code-based trigger registration (beta)
2. **`@pikku/azure-functions`** — handler adapters for manual integration

## Recommended: Pikku Deploy

Install the deploy adapter:

```bash
npm install @pikku/deploy-azure
```

Add to your `pikku.config.json`:

```json
{
  "deploy": {
    "providers": {
      "azure": "@pikku/deploy-azure"
    },
    "defaultProvider": "azure"
  }
}
```

Then:

```bash
npx pikku deploy plan
npx pikku deploy apply
```

The pipeline provisions one Azure Function per deployment unit, with queue triggers, timer triggers (cron), and generated `host.json` / `local.settings.json`.

See the [Deploy guide](/docs/deploy#azure-functions) for full documentation.

:::note Beta
The Azure Functions provider is in beta.
:::

## Manual Setup with `@pikku/azure-functions`

```bash
npm install @pikku/azure-functions
```

The package provides handler factories for HTTP, queue, and timer triggers, plus an `AzureQueueService` for dispatching jobs and an Azure deployment service. The generated entry points from `pikku deploy` use these same factories — inspect `.deploy/azure/` output for working examples.
