---
title: ContentService
draft: true
---

The variables service provides methods to retrieve environment variables (or variables from other systems). This is needed since some runtimes (like cloudflare) don't provide things via `proces.env`

```typescript reference title="content-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/master/packages/core/src/services/content-service.ts
```

AJV