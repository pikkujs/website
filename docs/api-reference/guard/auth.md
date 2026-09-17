---
title: '#pikku/auth'
sidebar_label: '#pikku/auth'
sidebar_position: 1
description: 'Who may call a function, and what the call is made with: permissions that see the request, auth gates that run before it, and the credentials a function b…'
paper: true
---

# `#pikku/auth`

Who may call a function, and what the call is made with: permissions that see the request, auth gates that run before it, and the credentials a function borrows rather than holds.

```typescript
import { addGlobalPermission, defineCredential, pikkuAuth } from '#pikku/auth'
```

## Exports

<ApiExports items={[{"name":"addGlobalPermission","kind":"function","anchor":"addglobalpermission","summary":"Wire-agnostic global permissions. Runs at the top of every wiring's permission resolution — before wire-, tag-, and function-level entries."},{"name":"defineCredential","kind":"function","anchor":"definecredential","summary":"Declares a credential. The body is a no-op that tree-shakes away — the CLI reads the call by AST, so the declaration must be a top-level literal. type: 'wire' is per-user, type: 'singleton' is platform-wide."},{"name":"pikkuAuth","kind":"function","anchor":"pikkuauth","summary":"Factory function for creating auth-only permissions with tree-shaking support. Auth permissions only receive services and session (no request data), making them evaluable before request data is available."},{"name":"pikkuBetterAuth","kind":"function","anchor":"pikkubetterauth","summary":"Builds this project's Better Auth instance. The factory is handed the singleton services, with typed secrets and variables, and is called lazily so config and secrets are resolved before auth is constructed."},{"name":"pikkuPermission","kind":"function","anchor":"pikkupermission","summary":"Factory function for creating permissions with tree-shaking support. Supports both direct function and configuration object syntax."},{"name":"PikkuPermission","kind":"type","anchor":"pikkupermission-2","summary":"Type-safe API permission definition that integrates with your application's session type. Use this to define authorization logic for your API endpoints."},{"name":"pikkuPermissionFactory","kind":"function","anchor":"pikkupermissionfactory","summary":"Factory function for creating permission factories Use this when your permission needs configuration/input parameters"}]} />

## Reference

<ApiSymbol>

### `addGlobalPermission` {#addglobalpermission}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Wire-agnostic global permissions. Runs at the top of every wiring's
permission resolution — before wire-, tag-, and function-level entries.

Resolution order: global -&gt; wire -&gt; tag -&gt; function.

</ApiSection>

<ApiSection label="Signature">

```typescript
addGlobalPermission: <In = unknown>(permissions: CorePermissionGroup<PikkuPermission<In>> | PikkuPermission<In>[]) => void
```

</ApiSection>

<ApiSection label="Example">

```typescript
addGlobalPermission([signedInUser])
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `defineCredential` {#definecredential}

<ApiMeta kind="function" origin="re-exported from @pikku/core/credential" />

<ApiSection label="Description">

Declares a credential. The body is a no-op that tree-shakes away — the CLI
reads the call by AST, so the declaration must be a top-level literal.
`type: 'wire'` is per-user, `type: 'singleton'` is platform-wide.

</ApiSection>

<ApiSection label="Signature">

```typescript
defineCredential: <T>(_config: CoreCredential<T>) => void
```

</ApiSection>

<ApiSection label="Config keys (7)">

| Key | Type | What it does |
| --- | --- | --- |
| `description` | `string` | What the credential is for and where to obtain one. |
| `displayName` <sup>required</sup> | `string` | The name shown to whoever has to supply the value, who is often not the person who wrote this. |
| `docsUrl` | `string` | Where to go to create one, shown next to the field asking for it. |
| `name` <sup>required</sup> | `string` | How the credential is asked for in code. Generated into `CredentialsMap`, so it is what `credentials.get` autocompletes. |
| `oauth2` | `(OAuth2CredentialConfig & { appCredentialSecretId: string; })` | Makes this an OAuth connection rather than a value pasted in: the user is sent to the provider and the tokens are stored for them. |
| `schema` <sup>required</sup> | `T` | The shape of the value, validated when it is supplied rather than when it is first used. |
| `type` <sup>required</sup> | `"singleton" \| "wire"` | `singleton` is one value for the whole deployment; `wire` is one per user, supplied by them and stored against their account. |

</ApiSection>

<ApiSection label="Example">

```typescript
// Per-user API key
defineCredential({
  name: 'stripe',
  displayName: 'Stripe API Key',
  type: 'wire',
  schema: z.object({ apiKey: z.string() }),
})

// Per-user OAuth
defineCredential({
  name: 'google-sheets',
  displayName: 'Google Sheets',
  type: 'wire',
  schema: z.object({ accessToken: z.string(), refreshToken: z.string() }),
  oauth2: {
    appCredentialSecretId: 'GOOGLE_OAUTH_APP',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    tokenSecretId: 'GOOGLE_OAUTH_TOKENS',
  }
})

// Platform-level OAuth (singleton)
defineCredential({
  name: 'slack',
  displayName: 'Slack',
  type: 'singleton',
  schema: z.object({ accessToken: z.string(), refreshToken: z.string() }),
  oauth2: {
    appCredentialSecretId: 'SLACK_OAUTH_APP',
    authorizationUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    scopes: ['chat:write', 'channels:read'],
    tokenSecretId: 'SLACK_OAUTH_TOKENS',
  }
})
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `pikkuAuth` {#pikkuauth}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Factory function for creating auth-only permissions with tree-shaking support.
Auth permissions only receive services and session (no request data),
making them evaluable before request data is available.

</ApiSection>

<ApiSection label="Signature">

```typescript
pikkuAuth: <RequiredServices extends SecretlessServices<SingletonServices> = WiredAuthServices>(auth: PikkuAuth<RequiredServices> | PikkuAuthConfig<RequiredServices>) => PikkuPermission<any, any>
```

</ApiSection>

<ApiSection label="Example">

```typescript
\`\`\`typescript
const isAuthenticated = pikkuAuth(async ({ logger }, session) => {
  return !!session
})

const isAdmin = pikkuAuth({
  name: 'Admin Auth',
  description: 'Checks if user is an admin',
  func: async ({ logger }, session) => {
    return session?.role === 'admin'
  }
})
\`\`\`
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `pikkuBetterAuth` {#pikkubetterauth}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Builds this project's Better Auth instance. The factory is handed the
singleton services, with typed `secrets` and `variables`, and is called
lazily so config and secrets are resolved before auth is constructed.

</ApiSection>

<ApiSection label="Signature">

```typescript
pikkuBetterAuth: <I extends BetterAuthInstance>(factory: (services: AuthSingletonServices) => I | Promise<I>) => PikkuBetterAuthFactory<I>
```

</ApiSection>

<ApiSection label="Example">

```typescript
export const auth = pikkuBetterAuth(
  async ({
    kysely,
    secrets,
    variables,
    emailService,
    scopeService,
    logger,
  }) => {
    // `.reveal()` at the sink, not earlier: getSecret hands back a nominal
    // SecretValue that no concretely-typed parameter accepts, so every disclosure
    // is one greppable call. Better Auth wants the raw string, and this is where
    // it stops being a secret in the type system.
    const BETTER_AUTH_SECRET = (
      await secrets.getSecret('BETTER_AUTH_SECRET')
    ).reveal()
    // Genuinely optional: unset simply disables /api/auth/sign-in/actor (scenarios
    // off for this deployment) — the actor plugin refuses all sign-ins
    // without it.
    const SCENARIO_ACTOR_SECRET = await secrets
      .getSecret('SCENARIO_ACTOR_SECRET')
      .then((value) => value?.reveal())
      .catch(() => undefined)
    // Fabric operator admin: the RSA public key the control plane's token is
    // verified against. The Fabric deployer pushes FABRIC_AUTH_PUBLIC_KEY onto
    // every stage; locally it's simply absent, which disables /sign-in/fabric.
    // Asymmetric — the app verifies, it can never forge an operator login.
    const FABRIC_AUTH_PUBLIC_KEY = await variables.get('FABRIC_AUTH_PUBLIC_KEY')
    // The opt-in that lets a deployed stage run scenarios. Read through
    // `variables` rather than left to `process.env`, because a Worker receives
    // it as a binding and has no populated environment to find it in.
    const ALLOW_ACTOR_SIGN_IN = await variables.get(ACTOR_SIGN_IN_OPT_IN_ENV)

    return betterAuth({
      secret: BETTER_AUTH_SECRET,
      database: { db: kysely, type: 'sqlite' },
      emailAndPassword: {
        enabled: true,
        // Without this, `requestPasswordReset` succeeds on the client and silently
        // sends nothing — the "Forgot password?" flow looks wired and dead-ends.
        // Better Auth builds `url` from its baseURL + the client's redirectTo, so
        // the app only supplies the message. Errors are logged, never swallowed:
        // a reset the user never receives must be visible in the logs.
        sendResetPassword: async ({ user, url }) => {
          await emailService.send({
            to: user.email,
            template: {
              name: 'reset-password',
              data: { email: user.email, resetUrl: url },
            },
          })
        },
      },
      // Stateless session: CLI splits out betterAuthStatelessSession so non-auth
      // units verify the signed cookie instead of bundling better-auth. pikku #737.
      session: { cookieCache: { enabled: true } },
      advanced: { database: { generateId: 'uuid' } },
      // Scenario actors: synthetic users (user.actor = true, see
      // db/sqlite/0002-user-actor.sql) signed in by pikkuScenario via
      // POST /api/auth/sign-in/actor { email, secret }. Never signs in real users.
      //
      // pikkuBan(): adds the banned/banExpires/banReason columns (see
      // db/sqlite/0003-admin.sql) and the session hook that refuses a banned
      // user a session. better-auth's own admin() is refused by the inspector:
      // it authorizes on a `user.role` column while pikku authorizes on scopes,
      // and everything else it offered — list, create, ban, remove, revoke
      // sessions, set password — is scoped RPCs in @pikku/addon-admin.
      //
      // pikkuFabric(): exposes /api/auth/sign-in/fabric — the Fabric control plane
      // mints a short-lived RS256 token and signs in as a synthetic `fabric: true`
      // admin operator (db/sqlite/0004-fabric.sql), so the console Users tab can
      // list/impersonate real users without the operator being one of them. It
      // verifies against FABRIC_AUTH_PUBLIC_KEY; a missing key disables the
      // endpoint.
      //
      // `personas` is what provisions the scenario actors. The plugin creates a
      // declared persona's account the first time an operator asks to act as an
      // address the stage has no row for, so a deploy carries its actors with it
      // without a bootstrap step. This does NOT belong in `pikkuServerLifecycle`'s
      // afterStart: that hook only ever runs under `pikku dev` and `pikku serve`,
      // so a deployed stage would provision nobody.
      plugins: [
        pikkuActor({
          secret: SCENARIO_ACTOR_SECRET,
          allowSignIn: ALLOW_ACTOR_SIGN_IN,
        }),
        pikkuBan(),
        pikkuFabric({
          publicKey: FABRIC_AUTH_PUBLIC_KEY,
          scopeService,
          logger,
          personas: {
            personas: personaConfigs,
            environments: personaEnvironments,
          },
        }),
      ],
    })
  }
)
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `pikkuPermission` {#pikkupermission}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Factory function for creating permissions with tree-shaking support.
Supports both direct function and configuration object syntax.

</ApiSection>

<ApiSection label="Signature">

```typescript
pikkuPermission: <In>(permission: PikkuPermission<In> | PikkuPermissionConfig<In>) => PikkuPermission<In>
```

</ApiSection>

<ApiSection label="Example">

```typescript
export const isOrderOwner = pikkuPermission(
  async ({ kysely }, { orderId }: { orderId: string }, { session }) => {
    const order = await kysely
      .selectFrom('order')
      .select('userId')
      .where('orderId', '=', orderId)
      .executeTakeFirst()
    return order?.userId === session?.userId
  }
)
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `PikkuPermission` {#pikkupermission-2}

<ApiMeta kind="type" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Type-safe API permission definition that integrates with your application's session type.
Use this to define authorization logic for your API endpoints.

</ApiSection>

<ApiSection label="Signature">

```typescript
PikkuPermission: PikkuPermission<In, RequiredServices>
```

</ApiSection>

</ApiSymbol>

<ApiSymbol>

### `pikkuPermissionFactory` {#pikkupermissionfactory}

<ApiMeta kind="function" origin="generated into .pikku by the CLI" />

<ApiSection label="Description">

Factory function for creating permission factories
Use this when your permission needs configuration/input parameters

</ApiSection>

<ApiSection label="Signature">

```typescript
pikkuPermissionFactory: <In = any>(factory: (input: In) => PikkuPermission<any>) => ((input: In) => PikkuPermission<any>)
```

</ApiSection>

<ApiSection label="Example">

```typescript
export const requireRole = pikkuPermissionFactory<{ role: string }>(({
  role
}) => {
  return pikkuPermission(async ({ logger }, data, { session }) => {
    if (!session || session.role !== role) {
      logger.warn(`Permission denied: required role '${role}'`)
      return false
    }
    return true
  })
})
```

</ApiSection>

</ApiSymbol>

## Inside an addon

Addon authors import this door as `#pikku/addon/auth`, with one difference:

- Not available: `pikkuBetterAuth` — an addon ships functions, it does not wire them. The application that installs the addon does that.

---

Run `npx pikku doc auth` to print this door in the terminal, or `npx pikku doc <export>` for any one export above.
