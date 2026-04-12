# Blog: Code-Defined Roles & Permissions with Pikku Tags

## Hook

Most backend projects start with 4 RBAC tables (roles, permissions, role_permissions, user_role_assignments). By month three, nobody remembers which permission does what, the seed data is out of sync, and adding a new role means a migration + deploy.

What if you just... didn't?

## Core idea

Define roles and permissions entirely in code. One file. Version-controlled. No DB tables.

```typescript
// lib/permissions.ts — this IS your RBAC system

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['*'],
  coordinator: ['users.view', 'stays.review', 'stays.manage', 'rooms.manage', ...],
  facilitator: ['stays.request', 'retreats.manage', 'kitchen.view', ...],
  guest: ['stays.request', 'boats.request'],
}
```

Users get a `roles: text[]` column on their table. That's it.

## How it works with Pikku

### 1. Tag your functions

```typescript
export const approveStay = pikkuFunc({
  tags: ['stays.review'],
  input: ApproveStayInput,
  output: ApproveStayOutput,
  func: async ({ kysely }, { requestId }, { session }) => {
    // business logic only — no permission checks here
  },
})
```

### 2. Register permission checks for tags

```typescript
import { addPermission } from '@pikku/core'

for (const permissionKey of ALL_PERMISSIONS) {
  addPermission(permissionKey, [
    async (_services, _data, wire) => {
      const roles = wire.session?.roles ?? []
      return roles.some(r => roleHasPermission(r, permissionKey))
    },
  ])
}
```

### 3. Pikku enforces automatically

When a request hits `POST /stays/:id/approve`, Pikku sees the `stays.review` tag, runs the registered permission check, and returns 403 if the user's roles don't include that permission. Your function code never touches auth.

## Why this is better

### vs. DB-driven RBAC

| | DB tables | Code-defined |
|---|---|---|
| Source of truth | Database (mutable) | Git (immutable) |
| Adding a role | Migration + seed + deploy | Edit one file + deploy |
| Auditing who can do what | SQL query across 4 tables | Read one file |
| Permission check speed | DB query per request | In-memory lookup |
| Drift between envs | Common (missed seed data) | Impossible (same deploy) |

### vs. Middleware-based auth

With middleware-based auth, you embed permission checks inside every function:

```typescript
// Don't do this
func: async (services, input, { session }) => {
  if (!hasPermission(session, 'stays.review')) throw new ForbiddenError()
  // ... actual logic
}
```

With tag-based permissions, the function body is pure business logic. Permission enforcement is declarative and automatic.

## The roles array

```sql
CREATE TABLE app."user" (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  roles TEXT[] NOT NULL DEFAULT '{}',
  -- ...
);
```

Set roles via a simple endpoint:

```typescript
export const setUserRoles = pikkuFunc({
  tags: ['roles.assign'],
  func: async ({ kysely }, { userId, roles }) => {
    await kysely.updateTable('user').set({ roles }).where('userId', '=', userId).execute()
  },
})
```

## JWT includes roles

The auth session maps roles from the JWT token — no DB lookup on every request:

```typescript
// Auth wiring: embed roles in JWT
callbacks: {
  async jwt({ token, user }) {
    if (user) token.roles = user.roles ?? []
    return token
  },
}

// Middleware: extract roles from JWT
authJsSession({
  secretId: 'AUTH_SECRET',
  mapSession: (claims) => ({
    userId: claims.sub,
    roles: claims.roles ?? [],
  }),
})
```

## When to NOT use this

- If roles/permissions need to be edited by non-developers at runtime (use a DB)
- If you have thousands of dynamic permission rules (use a policy engine like OPA)
- If you need per-resource ACLs (use a dedicated authz service like Zanzibar)

For most operational backends, code-defined roles are the right level of complexity.

## Outline / sections

1. The problem with 4-table RBAC
2. The alternative: one file, one array
3. How Pikku tags make it automatic
4. The implementation (with code)
5. JWT role embedding for zero-query auth
6. When to reach for something heavier
7. Link to perauset as a real-world example
