---
sidebar_position: 3
title: Secret Overrides
description: Mapping addon secrets to your secret store
---

# Secret Overrides

Addons define secrets with their own `secretId` naming conventions. Secret overrides let you map those names to your existing secrets.

## Configuration

Override secrets in your `pikku.config.json`:

```json
{
  "addons": {
    "ext": {
      "package": "@pikku/my-addon",
      "secretOverrides": {
        "PACKAGE_API_KEY": "ACME_SERVICE_API_KEY"
      }
    }
  }
}
```

This maps the addon's `PACKAGE_API_KEY` to your application's `ACME_SERVICE_API_KEY`.

## When to Use Overrides

**Naming conventions**: The addon uses `STRIPE_KEY` but your organization stores it as `PAYMENTS_STRIPE_API_KEY`.

**Shared secrets**: Multiple addons need the same underlying secret but expect different names.

**Existing infrastructure**: You've already configured secrets under different names and don't want to duplicate them.

## How It Works

When the addon calls `secrets.getSecretJSON('PACKAGE_API_CREDENTIALS')`, Pikku transparently looks up `ACME_SERVICE_CREDENTIALS` instead. The addon code doesn't need to know about your naming conventions.
