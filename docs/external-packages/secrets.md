---
sidebar_position: 3
title: Secret Overrides
description: Mapping external package secrets to your secret store
---

# Secret Overrides

External packages define secrets with their own `secretId` naming conventions. Secret overrides let you map those names to your existing secrets.

## Configuration

Override secrets in your `pikku.config.json`:

```json
{
  "externalPackages": {
    "ext": {
      "package": "@pikku/my-external-package",
      "secretOverrides": {
        "PACKAGE_API_KEY": "ACME_SERVICE_API_KEY"
      }
    }
  }
}
```

This maps the package's `PACKAGE_API_KEY` to your application's `ACME_SERVICE_API_KEY`.

## When to Use Overrides

**Naming conventions**: The package uses `STRIPE_KEY` but your organization stores it as `PAYMENTS_STRIPE_API_KEY`.

**Shared secrets**: Multiple packages need the same underlying secret but expect different names.

**Existing infrastructure**: You've already configured secrets under different names and don't want to duplicate them.

## How It Works

When the external package calls `secrets.getSecretJSON('PACKAGE_API_CREDENTIALS')`, Pikku transparently looks up `ACME_SERVICE_CREDENTIALS` instead. The package code doesn't need to know about your naming conventions.
