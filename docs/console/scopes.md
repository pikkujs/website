---
sidebar_position: 3
title: Scopes
description: The capabilities the Console declares, and how to grant less than all of them
---

# Console Scopes

The Console is an addon like any other, and its functions gate themselves on
[scopes](/docs/core-features/scopes) it declares. Wiring
`@pikku/addon-console` merges those scopes into your app's `ScopeId` union, so
your own roles can grant them.

Every Console capability lives under `pikku:console`, one area per page-group:

| Scope | Grants |
|---|---|
| `pikku:console:secrets:read` | Read secret values, check whether one is set |
| `pikku:console:secrets:write` | Set and overwrite secret values |
| `pikku:console:variables:read` | Read variable values |
| `pikku:console:variables:write` | Set and overwrite variable values |
| `pikku:console:addons:read` | Browse the catalogue and what is installed, including readiness |
| `pikku:console:addons:install` | Install an addon and write its wiring file |
| `pikku:console:credentials:read` | Read credential values and who holds them |
| `pikku:console:credentials:manage` | Set and delete credentials |
| `pikku:console:scopes:read` | View declared scopes, roles, and who holds them |
| `pikku:console:scopes:manage` | Create and delete roles, change their scopes, grant roles to users |
| `pikku:console:audit:read` | Read the audit trail — every recorded action and who took it |
| `pikku:console:wirings:read` | Read routes, channels, schemas, webhook deliveries, function source |
| `pikku:console:security:read` | Read the last security audit |
| `pikku:console:security:run` | Run the security audit |
| `pikku:console:workflows:read` | Read workflow runs and their steps |
| `pikku:console:workflows:manage` | Delete workflow runs |
| `pikku:console:agents:read` | Read agent threads, runs, and source |
| `pikku:console:agents:manage` | Delete threads and change agent configuration |
| `pikku:console:db:read` | Read the schema the application runs on |
| `pikku:console:knowledge:read` | Read the knowledge notes |
| `pikku:console:emails:read` | Render a template preview |
| `pikku:console:emails:write` | Edit email templates |
| `pikku:console:code:write` | Rewrite function bodies and configuration, and change dependencies |

Because [a grant covers everything beneath
it](/docs/core-features/scopes#parent-grants-child), `pikku:console` grants the
whole table and `pikku:console:secrets` grants both secret leaves.

An externally hosted Console cannot carry the session cookie, so it
authenticates with `Authorization: Bearer <PIKKU_CONSOLE_TOKEN>` instead. The
session that bearer token mints holds the two roots — `admin` and `pikku` —
rather than a `*` wildcard, so it reaches every Console capability and none of
the scopes your own app declares. Nothing needs configuring for that path
beyond setting the secret.

## Granting less than everything

The areas exist so you can hand out a slice. A role that lets support staff look
around without touching anything:

| Role | Scopes |
|---|---|
| Console reader | `pikku:console:wirings:read`, `pikku:console:workflows:read`, `pikku:console:db:read` |
| Secret operator | `pikku:console:secrets:read`, `pikku:console:secrets:write` |
| Auditor | `pikku:console:audit:read`, `pikku:console:scopes:read` |

Three areas are worth withholding deliberately, because each one can be used to
acquire the others:

- **`pikku:console:code:write`** rewrites function bodies. Anyone holding it can
  write a function that does anything the server can do.
- **`pikku:console:addons:install`** runs code from the registry inside your
  application.
- **`pikku:console:scopes:manage`** grants roles, so it can grant the other two.

## `admin` does not reach the Console

`admin` is a different tree. It belongs to the user directory — `admin:users:*`,
`admin:impersonate`, `admin:credentials:link` — and holding it says nothing
about the Console.

That separation is on purpose. `admin` is the scope apps hand to their own
administrators, and it should not silently confer the ability to read every
secret and rewrite the source. To restore an administrator's previous access,
grant `pikku:console` alongside `admin`; to hand out less, grant the areas.

:::warning Migrating from a single `admin` grant
Earlier versions gated the entire Console on one `admin` scope declared on
`wireAddon`, and the generated secret and variable brokers carried no scope at
all. If you are upgrading:

- Add `pikku:console` to whichever role previously held `admin` for Console
  access, or grant individual areas instead.
- `pikku:scopes:read` and `pikku:scopes:manage` are now
  `pikku:console:scopes:read` / `pikku:console:scopes:manage`.
- `pikku:audit:read` is now `pikku:console:audit:read`.

The old ids are no longer declared, so `npx pikku scopes audit` lists them and
`npx pikku scopes prune` removes them once every role naming them has been
updated.
:::

## Why `pikku:console` and not `admin:console`

Scope roots merge by name, and [an addon's root loses to a root the host app
already declares](/docs/core-features/scopes#scopes-and-addons). Nearly every
app declares `admin`, so an `admin:console:*` tree shipped by the Console addon
would be dropped in exactly the apps that need it — silently, with the functions
still requiring scopes nobody can be granted. A root the Console owns outright
does not have that failure mode.
