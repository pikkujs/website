---
title: ScopeService
---

The ScopeService resolves and administers user scopes. It is registered as the `scopeService` singleton service, and it is called **when a session is being built — never by the function runner**. By the time your function runs, `session.scopes` is already a plain array of strings that core reads and never re-fetches.

That split is the whole design. Scopes are declared in code with `defineScope`, and roles composed from them with `defineSystemRole`; this service is where those declarations are written down, granted to users, and expanded back into the scope list a session carries.

Without it registered, no user can hold any scope, so every function declaring `scopes` denies everybody — `@pikku/better-auth` logs exactly that when it has to answer a scope check with no service present. See [Permission Guards](/docs/core-features/permission-guards) for how a function declares `scopes`.

## Interface

```typescript reference title="scope-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/scope-service.ts
```

Eighteen methods, none optional — an implementation has to answer all of them.

## Sync: declarations into the store

### `syncScopes(scopes: FlatScope[]): Promise<void>`

Registers the declared scope set — `{ id, description? }`, where `id` is the
colon-delimited form (`admin:invoices:create`). Every node of a scope tree is
itself grantable, so `admin` containing `invoices` containing `create` yields all
three ids.

**Additive.** Rows are upserted and anything no longer declared is *marked*
(`declared: false`), never deleted. Marking is non-destructive, so a rename, a
rollback, or a rolling deploy where an older replica is still serving cannot
silently strip a grant. `pruneScopes` is the deliberate removal path.

### `syncSystemRoles(roles: SystemRole[]): Promise<void>`

Registers the roles declared with `defineSystemRole` — `{ name, displayName?, description?, scopes }`.
Additive on the same terms as `syncScopes`: a removed declaration leaves the row
in place, marked undeclared, rather than revoking everyone's grant on deploy.

A role's **scope set is** re-synced, because that is the declaration's whole
content — editing `defineSystemRole` is how you change what a system role means,
and the deploy is when it takes effect.

Nothing in core or a runtime calls this for you. Call it yourself on startup with
the generated `SYSTEM_ROLES` list, as in [Registration](#registration) below —
until you do, `defineSystemRole` is a declaration nobody has written down, and
granting one of those roles fails on the foreign key into `pikku_scopes`.

## Reading

### `resolveScopes(userId: string): Promise<string[]>`

The union of role-derived scopes and scopes granted directly. This is the call
that runs at the session boundary.

### `listScopes(): Promise<Array<FlatScope & { declared: boolean }>>`

The whole vocabulary a role can be composed from. `declared: false` marks a
scope still in the store but no longer declared in code: inert, since no
function can require it, and awaiting `pikku scopes prune`.

### `listRoles(): Promise<Role[]>`

Every role, system and admin-composed. A `Role` is `{ name, description?, scopes, system?, declared? }`
— `system: true` means it came from `defineSystemRole` rather than from an
admin, and `declared: false` means its declaration has been removed from code
but the row survives: still held by whoever holds it, no longer offered for new
grants, awaiting `pikku roles prune`.

## Role administration

These are the calls behind an admin UI. Three of them carry contracts an
implementation **must** honour:

### `createRole(role: Role): Promise<void>`

Creates an admin-composed role. Must throw `SystemRoleShadowedError` when
`role.name` matches a declared system role. Two rows answering to one name make
"does this user hold `buyer`?" depend on which the store returns first.

### `deleteRole(name: string): Promise<void>`

Must throw `SystemRoleImmutableError` for a system role.

### `setRoleScopes(name: string, scopes: string[]): Promise<void>`

Replaces a role's scope set. Must throw `SystemRoleImmutableError` for a system
role — a system role is part of the application's surface, so it may be granted
but not renamed, re-scoped or deleted.

## Grants

### `addUserToRole(userId: string, role: string, grantedBy?: string): Promise<void>`
### `removeUserFromRole(userId: string, role: string): Promise<void>`
### `listUserRoles(userId: string): Promise<string[]>`

Role membership. `grantedBy` is the id of whoever made the grant, for audit.

### `addScopeToUser(userId: string, scope: string, grantedBy?: string): Promise<void>`
### `removeScopeFromUser(userId: string, scope: string): Promise<void>`
### `listUserScopes(userId: string): Promise<string[]>`

Grants outside of any role, additive with the user's role-derived scopes.
`listUserScopes` returns **only** the directly granted ones, not those inherited
from roles — use `resolveScopes` for the union.

## Maintenance

These four power the CLI's [`pikku scopes` and `pikku roles`](/docs/pikku-cli) commands.

### `findStaleScopes(): Promise<Array<{ scope: string; roles: string[] }>>`

Undeclared scopes with the roles that would lose them — the blast radius, shown
before anything is deleted. Powers `pikku scopes audit`.

### `pruneScopes(): Promise<string[]>`

Removes undeclared scopes, cascading them out of roles. Returns what it removed.

### `findStaleSystemRoles(): Promise<Array<{ role: string; users: number }>>`

System roles in the store whose declaration has gone, with the number of users
still holding each. Powers `pikku roles audit`.

### `pruneSystemRoles(): Promise<string[]>`

Removes undeclared system roles, cascading them out of user grants.

## Implementations

### KyselyScopeService

The only implementation that ships: [`@pikku/kysely`](/docs/storage/kysely),
backed by four `pikku_*` tables. There is no in-memory or noop default — leaving
`scopeService` unregistered is the "off" position, and it denies rather than
allows.

It requires Better Auth: `pikku_user_role.user_id` references its `user` table
with `ON DELETE CASCADE`, so deleting a user takes their grants with it.
`pikku_role_scopes` has a foreign key into `pikku_scopes`, so the database itself
refuses to grant a scope that was never declared — which is how persona
provisioning discovers a role whose declaration was never synced.

```typescript
import { KyselyScopeService } from '@pikku/kysely'

const scopeService = new KyselyScopeService(db.kysely)
await scopeService.init()
```

`init()` requires the scope schema rather than creating it — if the tables are
missing it throws, telling you to run `pikku db generate` then `pikku db migrate`.

```typescript reference title="kysely-scope-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/services/kysely/src/kysely-scope-service.ts
```

:::info
`pikku scopes audit`, `pikku scopes prune`, `pikku roles audit` and
`pikku roles prune` do **not** go through your registered singleton. They open
the project's database from your `createConfig` and construct a
`KyselyScopeService` directly, syncing the declared scopes first so the audit is
against current code. An app whose scopes live somewhere other than Kysely gets
nothing from those commands.
:::

## Registration

Declarations are inert until something writes them down, and nothing else does
it — so sync on startup, from the generated lists:

```typescript
import { KyselyScopeService } from '@pikku/kysely'
import { SCOPES } from '#pikku/scopes/pikku-scopes.gen.js'
import { SYSTEM_ROLES } from '#pikku/scopes/pikku-roles.gen.js'

const scopeService = new KyselyScopeService(db.kysely)
await scopeService.init()
await scopeService.syncScopes(SCOPES)
await scopeService.syncSystemRoles(SYSTEM_ROLES)

const singletonServices = await createSingletonServices(config, {
  scopeService,
})
```

Nothing in your own code destructures `scopeService` — the generated auth layer
is what reaches it — so the inspector adds it to your required services as soon
as a scope is declared, rather than inferring it from usage.
