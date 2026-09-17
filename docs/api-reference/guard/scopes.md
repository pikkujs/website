---
title: '#pikku/scopes'
sidebar_label: '#pikku/scopes'
sidebar_position: 2
description: 'The scopes a caller can hold and the roles that grant them, gating a call outside the permission pool.'
paper: true
---

# `#pikku/scopes`

The scopes a caller can hold and the roles that grant them, gating a call outside the permission pool.

```typescript
import { defineScope, defineSystemRole } from '#pikku/scopes'
```

## Exports

<ApiExports items={[{"name":"defineScope","kind":"function","anchor":"definescope","summary":"Declares scopes. The body is a no-op that tree-shakes away — the CLI reads the call by AST and generates a ScopeId union, so a function referencing an undeclared scope fails the build."},{"name":"defineSystemRole","kind":"function","anchor":"definesystemrole","summary":"No-op function for declaring system roles. This exists purely for TypeScript type checking and will be tree-shaken. The CLI extracts metadata via AST parsing and generates a SystemRoleName union, so a persona naming an undeclared role fails the build."}]} />

## Reference

<ApiSymbol>

### `defineScope` {#definescope}

<ApiMeta kind="function" origin="re-exported from @pikku/core/scope" />

<ApiSection label="Description">

Declares scopes. The body is a no-op that tree-shakes away — the CLI reads
the call by AST and generates a `ScopeId` union, so a function referencing an
undeclared scope fails the build.

Scopes are keyed by segment at every level: a scope is named by its key, and
its value describes it. Every node is grantable — the declaration below
yields `admin`, `admin:invoices`, `admin:invoices:create`,
`admin:invoices:void` and `billing`.

</ApiSection>

<ApiSection label="Signature">

```typescript
defineScope: (_config: CoreScopes) => void
```

</ApiSection>

<ApiSection label="Example">

```typescript
defineScope({
  admin: {
    displayName: 'Administration',
    description: 'Administrative access',
    scopes: {
      invoices: {
        description: 'Invoice management',
        scopes: {
          create: { description: 'Create invoices' },
          void: { description: 'Void invoices' },
        },
      },
    },
  },
  billing: {},
})
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `defineSystemRole` {#definesystemrole}

<ApiMeta kind="function" origin="re-exported from @pikku/core/role" />

<ApiSection label="Description">

No-op function for declaring system roles.
This exists purely for TypeScript type checking and will be tree-shaken.
The CLI extracts metadata via AST parsing and generates a `SystemRoleName`
union, so a persona naming an undeclared role fails the build.

A system role is a role that ships with the product: the console may grant
it, but cannot rename, re-scope or delete it. Roles an admin composes in the
console are unaffected and are not declared here.

Removal is deliberately not destructive. Deleting a declaration leaves the
row in the store, marked undeclared and inert, until `pikku roles prune` —
the same additive contract `defineScope` has, and for the same reason: a
mid-deploy revocation is not something a code edit should be able to cause.

</ApiSection>

<ApiSection label="Signature">

```typescript
defineSystemRole: (_config: CoreSystemRoles) => void
```

</ApiSection>

<ApiSection label="Example">

```typescript
defineSystemRole({
  buyer: {
    displayName: 'Buyer',
    description: 'Can browse the catalogue and place orders',
    scopes: ['catalogue:read', 'orders:create'],
  },
  admin: {
    description: 'Everything',
    scopes: ['admin'],
  },
})
```

</ApiSection>

</ApiSymbol>

## Inside an addon

Addon authors get this door unchanged as `#pikku/addon/scopes` — same 2 exports, same shapes. Only the import specifier differs.

---

Run `npx pikku doc scopes` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
