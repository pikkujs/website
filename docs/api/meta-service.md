---
title: MetaService
---

The MetaService is the runtime's read access to everything `pikku` generates into the `.pikku` directory — the wiring metadata, the JSON schemas, the declared scopes and roles, the email templates. It is registered as the `metaService` singleton service.

Nothing in a normal request path needs it. It exists for the things that reason *about* your application rather than serving it: the [Console](/docs/console), the graph addon, agent preparation (which reads function descriptions to build a tool catalogue), scenario and virtual-user runs (which derive a persona's reachable surface from the generated meta). Leave it out and those features have nothing to read; they degrade rather than crash, but they degrade to empty.

Every `relativePath` argument is relative to the `.pikku` root directory, except where noted.

## Interface

```typescript reference title="meta-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/meta-service.ts
```

Thirty-three members. Three are optional: `basePath`, `readPackageFile` and `readPackageDir`.

## Files

### `readonly basePath?: string`

*Optional.* The absolute path of the `.pikku` directory. **Undefined for
remote/non-local implementations** — a service reading its metadata over the
network has no local directory to name. Callers that need a real path on disk
(the scenario coverage instrumentation, for one) check it and do nothing when it
is absent.

### `readFile(relativePath: string): Promise<string | null>`

Reads a file out of `.pikku`. `null` for anything unreadable — missing file,
unreadable path — not a throw.

### `readDir(relativePath: string): Promise<string[]>`

Lists a directory under `.pikku`.

### `readProjectFile(relativePath: string): Promise<string | null>`

Reads relative to the **project root**, one level above `.pikku`.

### `readPackageFile?(packageName: string, relativePath: string): Promise<string | null>`

*Optional.* Reads an **installed addon package's own** `.pikku`, not the app's,
with `relativePath` rooted there — so `../README.md` reaches the package root.
Optional because only local/Node implementations can resolve packages; remote
ones omit it, and callers guard with `?.` rather than assuming it exists.

### `readPackageDir?(packageName: string, relativePath: string): Promise<string[]>`

*Optional.* The directory listing counterpart, absent on the same
implementations for the same reason.

## Metadata readers

Each returns the parsed contents of one generated file, and each returns an
empty value — `{}`, or the empty shape for that record — rather than throwing
when the file has not been generated.

| Method | Returns |
|--------|---------|
| `getHttpMeta()` | `HTTPWiringsMeta` — routes keyed by method |
| `getChannelsMeta()` | `ChannelsMeta` |
| `getSchedulerMeta()` | `ScheduledTasksMeta` |
| `getQueueMeta()` | `QueueWorkersMeta` |
| `getCliMeta()` | `CLIMeta` — `programs` and `renderers` |
| `getMcpMeta()` | `MCPMeta` — `resources`, `tools`, `prompts` |
| `getGatewayMeta()` | `GatewaysMeta` |
| `getRpcMeta()` | `RPCMetaRecord` — a `Record<string, string>` |
| `getWorkflowMeta()` | `WorkflowsMeta` — workflows *and* scenarios, merged |
| `getPersonasMeta()` | `Record<string, ResolvedPersona>` |
| `getSystemRolesMeta()` | `SystemRoleDefinitionsMeta` |
| `getFeaturesMeta()` | `FeaturesMeta` — scenario features |
| `getTriggerMeta()` | `TriggerMeta` |
| `getTriggerSourceMeta()` | `TriggerSourceMeta` |
| `getFunctionsMeta()` | `FunctionsMeta` — app functions plus scenario functions |
| `getMiddlewareGroupsMeta()` | `MiddlewareGroupsMeta` — definitions, instances, HTTP groups, tag groups |
| `getPermissionsGroupsMeta()` | `PermissionsGroupsMeta` |
| `getAgentsMeta()` | `AgentsMeta` |
| `getSecretsMeta()` | `SecretDefinitionsMeta` |
| `getCredentialsMeta()` | `CredentialDefinitionsMeta` |
| `getVariablesMeta()` | `VariableDefinitionsMeta` |
| `getServicesMeta()` | `ServicesMetaRecord` — one entry per documented service |

### `getSystemRolesMeta(): Promise<SystemRoleDefinitionsMeta>`

The roles declared with `defineSystemRole`, keyed by name.

Worth singling out for *why* it is here: a persona declares roles; a function
checks scopes. Anything showing what a persona can reach — the Console's persona
page, a run's catalogue — needs this to get from one to the other, and needs it
to be the **same** expansion the seed granted from rather than a second one.

## Email

### `getEmailMeta(): Promise<EmailsMeta>`

The generated email manifest: the template source directory, a theme hash, and
per-template variable lists, hashes and locales.

### `getEmailTemplateAssets(templateName: string, locale: string): Promise<EmailTemplateAssets>`

One template resolved for one locale — theme, locale strings, layout, partials,
and the html/subject/text bodies, plus a `missing` array naming whichever of
those could not be found. The pieces come back individually rather than
pre-rendered, so a preview can show a partially-authored template instead of
failing.

## Schemas

### `getSchema(schemaName: string): Promise<JSONSchema7 | null>`

One generated JSON schema by name, or `null` if there is none.

### `getSchemas(schemaNames: string[]): Promise<Record<string, JSONSchema7 | null>>`

Several at once. Every requested name appears in the result, mapped to `null`
where the schema is missing — so a caller can tell "asked for and absent" from
"never asked for".

## Cache

### `clearCache(): void`

Drops every cached read. Synchronous, and the only non-`Promise` method on the
interface. Implementations cache aggressively because generated metadata does
not change during a run — except during `pikku dev`, where it does, which is
what this is for.

## Implementations

### LocalMetaService (built-in)

The one implementation that ships. Reads the `.pikku` directory off disk, caching
every parsed file after the first read.

```typescript
import { LocalMetaService } from '@pikku/core/services/local-meta'

const metaService = new LocalMetaService('/path/to/.pikku')
```

Notes on its behaviour, since it is what most apps run:

- **Verbose beats minimal.** Where codegen writes both a `-verbose.gen.json` and
  a `.gen.json`, it prefers the verbose one and falls back to the minimal.
- **Email metadata is read uncached**, every call, because codegen rewrites it
  mid-session.
- `getEmailTemplateAssets` throws if no email metadata has been generated,
  telling you to run `pikku emails generate` — the one reader here that throws
  rather than returning an empty shape.
- `getSchema` rejects any name that is not alphanumeric plus `_`, `-` and `.`,
  returning `null` — the name reaches a file path, so it cannot be allowed to
  traverse.
- Addon package roots are resolved by walking Node's module search paths from
  the project root, and cached per package name.

```typescript reference title="meta-service.ts"
https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/meta-service.ts
```

## Registration

You do not normally construct this yourself. `pikku` generates
`.pikku/services/pikku-meta-service.gen.ts`, a `PikkuMetaService` subclass with
your output directory baked into its constructor:

```typescript
import { PikkuMetaService } from '#pikku/services/pikku-meta-service.gen.js'

const singletonServices = await createSingletonServices(config, {
  metaService: new PikkuMetaService(),
})
```

`pikku dev` and `pikku serve` register a `LocalMetaService` pointed at the same
directory, so the Console works in development with no wiring of your own.
