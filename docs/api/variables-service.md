---
title: VariablesService
---

The variables service provides methods to retrieve environment variables (or variables from other systems). This is needed since some runtimes (like cloudflare) don't provide things via `proces.env`

```typescript reference title="variables-service.ts"
https://raw.githubusercontent.com/pikku/pikku/blob/master/packages/core/src/services/variables-service.ts
```

There's a default implementation for environment variables:

```typescript reference title="local-variables.ts"
https://raw.githubusercontent.com/pikku/pikku/blob/master/packages/core/src/services/local-variables.ts
```
