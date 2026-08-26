---
sidebar_position: 45
title: Scopes
description: Declaring capabilities, granting them through roles, and gating functions on them
---

# Scopes

A scope is a **capability the caller holds** — "may refund an order", "may read
the audit trail". It is a fact about the *caller*, not about the row being
touched, which is what separates it from a [permission
guard](./permission-guards.md): permissions ask about the data, scopes ask about
the session.

If you have ever written `session.role === 'admin'` inside a function, that is
the check scopes replace. A role comparison cannot be checked at build time,
cannot be granted from the Console, and says nothing about *which* capability
the function actually needed.

## Declaring scopes

Scopes are declared as trees with `defineScope`. Every node gets a description,
and nesting produces the id: `catalogue` with a child `read` is
`catalogue:read`.

```typescript @snippet defineScopes
```

The declarations are extracted statically by the CLI, so the tree must be an
inline object literal — a constant imported from another module, or a tree built
by a helper, is invisible to the inspector and never reaches the generated
`ScopeId` union.

Declared scopes are generated into `.pikku/scopes/`: the `ScopeId` union your
functions and roles are type-checked against, and
`pikku-scopes-meta.gen.json` for the Console and for scope sync.

## Gating a function

Put the capability on the function itself, next to the code it protects:

```typescript @snippet scopedFunction
```

The wiring stays about transport. `auth: true` is the baseline — no session, no
call — and the scope is what decides *which* session:

```typescript @snippet shopAuthScope
```

### How the check composes

- **Scopes AND.** Every scope listed must be satisfied. Adding one can only
  narrow access.
- **Permissions OR.** Any permission group passing is enough. Adding one can
  only widen access.

The two are separate gates and run in that order — scopes first, then
permissions. A passing permission never satisfies a scope. This is why "is an
admin" belongs in `scopes` and "is on the owning team" belongs in `permissions`.

The scope check fails closed: no session, or a session carrying no `scopes`
field, satisfies nothing. Only an empty `scopes: []` is satisfied by everyone.

### Parent grants child

Satisfaction is hierarchical. A grant matches when it is the scope itself, an
ancestor of it, or a wildcard at or above it:

| Grant held | Satisfies `orders:refund`? |
|---|---|
| `orders:refund` | yes — exact |
| `orders` | yes — ancestor |
| `orders:*` | yes — wildcard at the node |
| `*` | yes |
| `orders:read` | no — a sibling |
| `orders:refund:partial` | no — narrower never satisfies broader |

So a role can name `catalogue` instead of enumerating `catalogue:read` and
`catalogue:write`, and stays correct as the tree grows.

## Granting scopes through roles

Users hold roles; roles hold scopes. Declare the roles your app ships with
`defineSystemRole`:

```typescript @snippet defineRoles
```

Roles declared this way are system roles — they exist in code, so a persona or a
seed may name one and it cannot be deleted out from under them. Roles created at
runtime in the Console are the other half of the same model.

### You need a ScopeService

Nothing above reaches a request until a `ScopeService` is wired into your
singleton services. It is what turns a user id into roles into scopes, and
without it **no user holds any scope, so every scoped function denies
everybody**. `KyselyScopeService` from `@pikku/kysely` is the usual choice; its
`init()` creates the `pikku_*` tables it reads.

Resolution happens at the **session boundary** — better-auth's `mapSession`, for
instance — and never inside the function runner, which does no I/O of its own.
The session is rebuilt per request, so a granted or revoked scope takes effect on
the next call; there is no cache to invalidate.

## Sync, audit and prune

Scope sync is **additive and never deletes**. Removing a `defineScope`
declaration in a deploy does not revoke the grants people are holding — the row
stays and goes inert, reported as `declared: false`, and no function can require
it. Removal is an explicit act:

```bash
npx pikku scopes audit    # scopes in the database no longer declared in code, and who holds them
npx pikku scopes prune    # remove them, cascading out of every role
```

A deploy must never be able to revoke a grant as a side effect, which is the
whole reason these are two commands and not one boot-time reconciliation.

## Scopes and addons

An addon declares its own scopes with `defineScope` exactly as an app does, and
they are merged into the host's `ScopeId` union when the addon is wired — that
is what lets one of your roles grant a scope an addon defined.

Two rules govern the merge, and both bite at the **root** level:

1. **A root the host already declares wins.** Addon scope trees are merged by
   root name, first declaration wins, and the host's own declarations are
   already loaded. An addon that declares an `admin` tree in an app that also
   declares `admin` contributes *nothing* — not even the children the host never
   declared — and the drop is silent.
2. **A co-declared root must be identical.** Where the same root legitimately
   comes from both sides, the declarations must match, and codegen errors naming
   both source files if they do not.

The practical advice for addon authors is in [Creating
Addons](/docs/addon/creating#declaring-scopes): pick a root nobody else will
declare — your package or vendor name — and put everything under it. This is why
the Console's own capabilities live under `pikku:console:*` rather than under
`admin`; see [Console Scopes](/docs/console/scopes).

## Next Steps

- [Permission Guards](./permission-guards.md) — the other gate, and when to use it instead
- [User Sessions](./user-sessions.md) — where `session.scopes` comes from
- [Console Scopes](/docs/console/scopes) — the capabilities the Console itself declares
