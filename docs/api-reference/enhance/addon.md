---
title: '#pikku/addon'
sidebar_label: '#pikku/addon'
sidebar_position: 1
description: 'Installs an addon into this application, on its own or over rpc against a remote one.'
---

# `#pikku/addon`

Installs an addon into this application, on its own or over rpc against a remote one.

```typescript
import { wireAddon, wireRemoteAddon } from '#pikku/addon'
```

## Exports

| Export | Kind | Summary |
| --- | --- | --- |
| [`wireAddon`](#wireaddon) | function | Installs an addon into this project: its functions, wirings and scopes become part of the app, under the namespace and options given here. |
| [`wireRemoteAddon`](#wireremoteaddon) | function | Installs an addon that runs as its own deployed service: the contract is local, the calls go over the wire to the addon's own host. |

## Reference

### `wireAddon` {#wireaddon}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/addon`</span>

Installs an addon into this project: its functions, wirings and scopes become
part of the app, under the namespace and options given here.

```typescript
wireAddon: (config: WireAddonConfig) => void
```

<details>
<summary>Config keys (14)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `auth` | `boolean` | Requires a session for every function in the addon, whatever each one declares. Gates an addon whose functions are individually open. |
| `credentialGrants` | `string[]` | Credentials this instance may read on top of the ones it declared. |
| `credentialOverrides` | `Record<string, string>` | Points a credential the addon reads at a different key in this deployment. |
| `globalCredentials` | `string` | Hands this instance the whole `CredentialService` instead of one narrowed to the credentials it declared. The value is the reason, recorded in the deploy manifest, and only the consuming app can grant it. |
| `globalSecrets` | `string` | Hands over the whole `SecretService` unscoped. The value is the reason, recorded in the deploy manifest. |
| `mcp` | `boolean` | Offers the addon's functions to MCP clients as tools, without wiring each one. |
| `name` <sup>required</sup> | `string` | How this instance is addressed. One package may be wired more than once, and the name is what tells the instances apart. |
| `package` <sup>required</sup> | `string` | The npm package the addon ships in. |
| `rpcEndpoint` | `string` | Where to reach the addon when it runs as its own service rather than in-process. |
| `scopes` | `string[]` | Required of every function in the addon, on top of the function's own. |
| `secretGrants` | `string[]` | Extra secrets this instance may read, named as the addon reads them — the scope check runs before `secretOverrides` renames them. |
| `secretOverrides` | `Record<string, string>` | Points a secret the addon reads at a different key in this deployment, so two instances can hold different credentials. |
| `tags` | `string[]` | Filters this addon in and out of a build — see the `tags` option on `pikku all`. It has no effect at runtime. |
| `variableOverrides` | `Record<string, string>` | Points a variable the addon reads at a different key in this deployment. |

</details>

```typescript
wireAddon({
  name: 'stripe',
  package: '@pikku/addon-stripe',
  scopes: ['payments:charge'],
})
```

### `wireRemoteAddon` {#wireremoteaddon}

<span className="api-symbol-meta">function · re-exported from `@pikku/core/addon`</span>

Installs an addon that runs as its own deployed service: the contract is
local, the calls go over the wire to the addon's own host.

```typescript
wireRemoteAddon: (config: WireRemoteAddonConfig) => void
```

<details>
<summary>Config keys (6)</summary>

| Key | Type | What it does |
| --- | --- | --- |
| `auth` | `RemoteAddonAuth` | Omit when the addon declares its remote surface public. |
| `name` <sup>required</sup> | `string` | Consumer-facing namespace, e.g. `registry` → `rpc('registry:getOpenApi')` |
| `package` <sup>required</sup> | `string` | Must be installed as a devDependency — `pikku verify` enforces this. |
| `remoteName` | `((fn: string) => string)` | Map a consumer-facing fn name → the remote fn name, when they differ (rare). |
| `serverUrl` <sup>required</sup> | `string \| ((services: CoreServices) => string \| Promise<string>)` |  |
| `tags` | `string[]` |  |

</details>

## Inside an addon

This door is application-only. Installing an addon is something an application does; an addon that installed other addons would be reaching into a registry it does not own. See [the addon surface](/docs/api-reference/addons) for the doors an addon does get.

---

Run `npx pikku doc addon` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
