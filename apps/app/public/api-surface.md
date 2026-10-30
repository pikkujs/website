# Pikku API surface (pikku 0.12.191)

Every door you import from in an app, and what each exports. Generated from the installed CLI (`pikku doc`). Run `pikku doc <name>` for one export in full.

#pikku/function — create a function

  The function definers every wiring eventually points at, and the types they
  are written against. A function is handed services, then its input, then the
  wire — and the wire is where the request lives: `session`, `setSession`,
  `clearSession`, `http`, `channel`, `rpc`. None of those are exports, so they
  are not listed here; destructure them from the third argument.

  InferSchemaOutput  (type)
      Helper type to infer the output type from a Standard Schema
      InferSchemaOutput<T>

  NodeConfig  (type)
      Inline node configuration for function definitions.

  pikkuApprovalDescription  (function)
      Factory function for creating approval description functions with
      tree-shaking support.
      example — pikku doc pikkuApprovalDescription

  PikkuApprovalDescription  (type)
      A function that generates a human-readable description of a pending
      approval action. Used by AI agents to show meaningful approval prompts
      instead of raw tool arguments.
      PikkuApprovalDescription<In, RequiredServices>

  pikkuFunc  (function)
      Creates a Pikku function that can be either session-aware or sessionless.
      This is the main function wrapper for creating API endpoints.
      27 keys — pikku doc pikkuFunc

  PikkuFunction  (type)
      A session-aware API function that requires user authentication. Use this
      for protected endpoints that need access to user session data.
      PikkuFunction<In, Out, RequiredWires, RequiredServices>

  PikkuFunctionConfig  (type)
      Configuration object for Pikku functions with optional middleware,
      permissions, tags, and documentation. This type wraps
      CorePikkuFunctionConfig with the user's custom types.
      32 keys — pikku doc PikkuFunctionConfig

  PikkuFunctionSessionless  (type)
      A sessionless API function that doesn't require user authentication. Use
      this for public endpoints, health checks, or operations that don't need
      user context.
      PikkuFunctionSessionless<In, Out, RequiredWires, RequiredServices, ScenarioOut>

  pikkuListFunc  (function)
      A `pikkuFunc` whose input and output are already the shared list shape —
      filters, sort, paging in; rows and a total out — so a listing endpoint
      pages the same way everywhere.
      32 keys — pikku doc pikkuListFunc

  pikkuRemoteChannelFunc  (function)
      Declares a capability the connected client answers, reachable from any
      `wireChannel` function as `channel.remote(name, input)`.
      26 keys — pikku doc pikkuRemoteChannelFunc

  pikkuSessionlessFunc  (function)
      Creates a sessionless Pikku function that doesn't require user
      authentication. Use this for public endpoints, webhooks, or background
      tasks.
      26 keys — pikku doc pikkuSessionlessFunc

  pikkuVoidFunc  (function)
      Creates a function that takes no input and returns no output. Useful for
      health checks, triggers, or cleanup operations.
      example — pikku doc pikkuVoidFunc

  ref  (function)
      References a registered function by name for use in any wiring. Works for
      both local and addon functions — resolves via RPC at runtime.
      example — pikku doc ref

  refChannel  (function)
      Names a channel an installed addon wires, for connecting to it without
      hardcoding its name.
      <Name extends keyof typeof __addonChannel>(name: Name) => (typeof __addonChannel)[Name]

  refCLI  (function)
      Names a CLI command an installed addon wires, for invoking it without
      hardcoding its name.
      <Name extends keyof typeof __addonCli>(name: Name) => (typeof __addonCli)[Name]

  refHTTP  (function)
      Names an HTTP route an installed addon wires, so you can link or redirect
      to it without hardcoding a path the addon may move.
      pikku doc refHTTP

  Services  (interface)
      Everything a function is handed as its first argument: the singleton
      services plus whatever is built per request. This is the type to widen
      when you add a service.
      29 keys — pikku doc Services

  Session  (type)
      The signed-in user as this project defines it. Reached on the wire as
      `session`, and replaced with `setSession`.
      4 keys — pikku doc Session

  SingletonServices  (interface)
      The services that live for the process — the ones built once in
      `createConfig`/ `createSingletonServices` and shared by every request.
      29 keys — pikku doc SingletonServices

  WiredServices  (type)
      The services a wired function actually receives. The inspector records
      which services each wired `func`, `permissions` and `middleware`
      destructures and emits them as `RequiredSingletonServices`; intersecting
      that here makes those services **non-optional** at every call site. A
      service is optional only when nothing destructures it — in which case it
      is never created either. This is why an `if (!service)` guard inside a
      function body is always dead code.
      28 keys — pikku doc WiredServices

  Load the pikku-concepts skill before writing this if you need how rather than what.

#pikku/setup — create a function

  The factories a project declares exactly once — its config, its singleton
  services and its per-wire services — and, for an application, the server
  lifecycle that runs work before and after the server starts and stops. An
  addon declares the first three in its own flavour, handed the logger,
  variables and secrets the host application already built, and has no
  lifecycle: it does not own a server. Everything else on this page is imported
  by features; these are imported by bootstrap and then left alone.

  Config  (interface)
      This project's own config — whatever `createConfig` returns. Every
      singleton service is built from it.
      5 keys — pikku doc Config

  pikkuConfig  (function)
      Creates a Pikku config factory. Use this to define your application's
      configuration factory.
      example — pikku doc pikkuConfig

  pikkuServerLifecycle  (function)
      Declares the work to run around the server's life: `beforeStart`,
      `afterStart`, `beforeStop` and `afterStop`. Each is optional and receives
      the singleton services, already created and already set, so startup work
      that needs a service — migrations, seeding, starting a queue consumer —
      belongs here rather than in the services factory.
      4 keys — pikku doc pikkuServerLifecycle

  pikkuServices  (function)
      Creates a Pikku singleton services factory. Use this to define services
      that are created once and shared across all requests.
      example — pikku doc pikkuServices

  pikkuWireServices  (function)
      Creates a Pikku wire services factory. Use this to define services that
      are created per-request/session.
      example — pikku doc pikkuWireServices

  Load the pikku-services skill before writing this if you need how rather than what.

#pikku/addon — enhance it

  Installs an addon into this application, on its own or over rpc against a
  remote one.

  wireAddon  (function)
      Installs an addon into this project: its functions, wirings and scopes
      become part of the app, under the namespace and options given here.
      18 keys — pikku doc wireAddon

  wireRemoteAddon  (function)
      Installs an addon that runs as its own deployed service: the contract is
      local, the calls go over the wire to the addon's own host.
      6 keys — pikku doc wireRemoteAddon

  Load the pikku-addon skill before writing this if you need how rather than what.

#pikku/analytics — enhance it

  The events a project can measure, declared by name so the generated ingest
  knows what to accept. Where they go is an AnalyticsService on singleton
  services; what a function records into is the analytics service on the
  invocation.

  AnalyticsClientContext  (interface)
      Its presence, not `at`, is what marks a record as relayed from a browser —
      a beacon is free to omit `at`.
      1 keys — pikku doc AnalyticsClientContext

  AnalyticsEventBase  (type)
      The constraint a project's declared event union is checked against.
      1 keys — pikku doc AnalyticsEventBase

  AnalyticsEventDefinitions  (type)
      Events keyed by name; each value is the schema for that event's props.

  AnalyticsEventPropsSchema  (type)
      The schema for one event's props. The generated ingest rebuilds each
      member of the union as `z.object(schema.shape)` so it can attach the event
      name, so a schema with no `shape` — a union, a primitive, a schema from a
      library that does not expose one — is not something an event can be
      declared with, and saying so here fails at the declaration rather than in
      generated code.
      2 keys — pikku doc AnalyticsEventPropsSchema

  AnalyticsIdentity  (interface)
      Stamped server-side from the session and never read from the request body,
      which is what makes an unauthenticated ingest safe to expose.
      6 keys — pikku doc AnalyticsIdentity

  AnalyticsIdentityResolver  (type)
      Resolves the half of the identity pikku cannot know, from the wire.

  AnalyticsLog  (interface)
      `services.analytics`: buffered for the invocation, flushed when it ends,
      always best-effort. `record` is a method rather than a property so an app
      can narrow `Events` in its own `SingletonServices`.
      3 keys — pikku doc AnalyticsLog

  AnalyticsRecord  (interface)
      What an event becomes once pikku has accepted it, and the only shape an
      {@link AnalyticsService} is ever handed.
      9 keys — pikku doc AnalyticsRecord

  AnalyticsService  (interface)
      Where accepted events go. Pikku validates, identifies and batches them; it
      does not store them.
      1 keys — pikku doc AnalyticsService

  AnalyticsSink  (interface)
      One destination in a fan-out, with the events it is allowed to receive.
      2 keys — pikku doc AnalyticsSink

  anonymousAnalyticsIdentity  (function)
      Mints a device-scoped id for visitors who have no session yet.
      example — pikku doc anonymousAnalyticsIdentity

  composeAnalyticsIdentity  (function)
      Runs resolvers in order, each seeing what the ones before it produced.
      example — pikku doc composeAnalyticsIdentity

  cookieAnalyticsIdentity  (function)
      Reads the browser-originated half of the identity off first-party cookies.
      2 keys — pikku doc cookieAnalyticsIdentity

  defineAnalyticsEvents  (function)
      Declare what a module can measure. Call it as often as suits the project;
      the CLI unions every declaration into the ingest schema.
      example — pikku doc defineAnalyticsEvents

  fanOutAnalytics  (function)
      One `AnalyticsService` over several destinations.
      example — pikku doc fanOutAnalytics

  LoggerAnalyticsService  (class)
      What an app gets before it has chosen a store. There is deliberately no
      noop: a validated wire with nowhere for the events to go is
      indistinguishable from a broken one.
      2 keys — pikku doc LoggerAnalyticsService

  mintCookie  (function)
      Reads a first-party cookie, creating and setting it when absent.
      34 keys — pikku doc mintCookie

  randomDigits  (function)
      Cryptographically random digits, the shape both vendor formats use.
      example — pikku doc randomDigits

  No skill teaches this door — what is above is the whole of it.

#pikku/error — enhance it

  The errors your functions throw and the HTTP status each one maps to, so a
  thrown error is part of the contract rather than a stack trace.

  addError  (function)
      Registers one of your own error classes with the HTTP status and message
      it should produce, so throwing it maps to a real response instead of a
      500.
      3 keys — pikku doc addError

  ErrorDetails  (interface)
      Types the exports above mention but do not themselves export. Without them
      a consumer's declaration emit has no name for the type it infers, and
      fails with TS2883 rather than reaching for the original entry point.
      3 keys — pikku doc ErrorDetails

  isExpectedError  (function)
      A `PikkuError`, or any error carrying `expected: true` — the marker that
      survives serialization across a workflow step boundary and rehydration as
      a plain `Error`. Callers log the message alone for these, the full stack
      for everything else.
      example — pikku doc isExpectedError

  PikkuError  (class)
      new PikkuError(message?: string)

  SerializedError  (interface)
      4 keys — pikku doc SerializedError

  46 error classes, each thrown to produce its HTTP status:
    AIProviderAuthError 401               AIProviderNotConfiguredError 503      BadGatewayError 502
    BadRequestError 400                   ConflictError 409                     CredentialRejectedError 403
    ExpectationFailedError 417            FeatureUnavailableError 503           ForbiddenError 403
    GatewayTimeoutError 504               GoneError 410                         HTTPVersionNotSupportedError 505
    InternalServerError 500               InvalidMiddlewareWireError 500        InvalidOriginError 403
    InvalidSessionError 401               LengthRequiredError 411               LocalEnvironmentOnlyError 403
    LockedError 423                       MaxComputeTimeReachedError 524        MethodNotAllowedError 405
    MissingCredentialError 403            MissingSchemaError 500                MissingScopeError 403
    MissingServiceError 500               MissingSessionError 401               NotAcceptableError 406
    NotFoundError 404                     NotImplementedError 501               PayloadTooLargeError 413
    PaymentRequiredError 402              PikkuMissingMetaError 500             PreconditionFailedError 412
    ProxyAuthenticationRequiredError 407  RangeNotSatisfiableError 416          ReadonlySessionError 403
    RequestTimeoutError 408               ServiceUnavailableError 503           SystemRoleImmutableError 409
    SystemRoleShadowedError 409           TooManyRequestsError 429              UnauthorizedError 401
    UnprocessableContentError 422         UnsupportedMediaTypeError 415         URITooLongError 414
    WeakKeyMaterialError 500

  No skill teaches this door — what is above is the whole of it.

#pikku/middleware — enhance it

  Middleware is one concept regardless of what it ends up attached to, so it is
  one import: define it here, then register it globally, against a tag, or
  against an HTTP route or channel.

  addChannelMiddleware  (function)
      Attaches channel middleware to every channel carrying the given tag, so
      the channels themselves stay free of the wiring.
      example — pikku doc addChannelMiddleware

  addGlobalMiddleware  (function)
      Wire-agnostic global middleware. Runs at the top of every wiring's
      middleware chain — before wire-, tag-, and function-level entries.
      example — pikku doc addGlobalMiddleware

  addHTTPMiddleware  (function)
      Registers HTTP middleware either globally or for a specific route pattern.
      example — pikku doc addHTTPMiddleware

  addTagMiddleware  (function)
      Tag-scoped middleware. Applies to any wiring that carries the matching
      tag.
      example — pikku doc addTagMiddleware

  authAPIKey  (function)
      Reads an API key from the request and JWT-decodes it into a session.
      Leaves an existing session alone, so it composes with other auth
      middleware.
      1 keys — pikku doc authAPIKey

  authBearer  (function)
      Validates a bearer token: JWT-decoded by default, or compared in constant
      time against a static `value` or a `secretId` resolved through the secrets
      service per request.
      1 keys — pikku doc authBearer

  authCookie  (function)
      Reads a JWT session from a cookie, and re-issues the cookie after the
      request whenever the session changed (e.g. after login).
      3 keys — pikku doc authCookie

  cors  (function)
      Sets CORS headers on every response and short-circuits OPTIONS preflight
      with a 204. `origin: true` reflects the request origin; an array reflects
      a matching origin and otherwise sends no `Access-Control-Allow-Origin` at
      all, so the browser reports "origin not allowed" rather than an origin
      mismatch against whichever entry happened to be first.
      6 keys — pikku doc cors

  MiddlewarePriority  (type)
      Execution order: `highest` runs first (outermost in the onion), `lowest`
      runs last, closest to the function.

  pikkuAgentMiddleware  (function)
      Declares middleware for an agent run — hooks around the model call, its
      tool calls and the run's state.
      7 keys — pikku doc pikkuAgentMiddleware

  pikkuChannelMiddleware  (function)
      Declares middleware for a channel — it runs around the connection and its
      messages rather than around a single request.
      example — pikku doc pikkuChannelMiddleware

  PikkuChannelMiddleware  (type)
      The shape of channel middleware — it runs around the connection and its
      messages rather than around a single request.
      PikkuChannelMiddleware<RequiredServices, Event>

  pikkuChannelMiddlewareFactory  (function)
      Declares channel middleware that takes options, so one definition can be
      wired several times with different configuration.
      example — pikku doc pikkuChannelMiddlewareFactory

  pikkuMiddleware  (function)
      Factory function for creating middleware with tree-shaking support.
      Supports both direct function and configuration object syntax.
      example — pikku doc pikkuMiddleware

  PikkuMiddleware  (type)
      Type-safe middleware definition that can access your application's
      services and session. Use this to define reusable middleware that can be
      applied to multiple wirings.
      PikkuMiddleware<RequiredServices>

  pikkuMiddlewareFactory  (function)
      Factory function for creating middleware factories Use this when your
      middleware needs configuration/input parameters
      example — pikku doc pikkuMiddlewareFactory

  requireOrigin  (function)
      Rejects a request with a 403 unless its `Origin` is this app's own or
      explicitly allowed.
      1 keys — pikku doc requireOrigin

  Load the pikku-middleware skill before writing this if you need how rather than what.

#pikku/secrets — enhance it

  Secrets a function can use without ever holding, declared here and resolved by
  the secrets service at runtime.

  CredentialsMap  (type)
      Every secret this project declares with `defineSecret`, keyed by name. It
      is what gives `secrets.getSecret('NAME')` a real type.

  defineSecret  (function)
      Declares a secret this project needs, with the shape of its value. The CLI
      collects every declaration into `CredentialsMap`, which is what makes
      `secrets.getSecret('NAME')` return the right type instead of `unknown`.
      9 keys — pikku doc defineSecret

  TypedSecretService  (class)
      The `secrets` service as this project sees it: `getSecret('NAME')`
      resolves the value's type from `CredentialsMap` instead of returning
      `unknown`.
      11 keys — pikku doc TypedSecretService

  Load the pikku-services skill before writing this if you need how rather than what.

#pikku/utils — enhance it

  Small helpers a function body reaches for, such as `parseJson`, which turns
  text or bytes into JSON or refuses with a 400.

  parseJson  (function)
      `JSON.parse` of text or UTF-8 bytes, refusing anything that is not JSON
      with a 400 rather than a 500.
      example — pikku doc parseJson

  No skill teaches this door — what is above is the whole of it.

#pikku/variables — enhance it

  Configuration a function reads through the variables service, declared once so
  a deployment can be checked for what it is missing.

  defineVariable  (function)
      Declares an environment variable this project needs, with the shape of its
      value. The CLI collects every declaration into `VariablesMap`, which is
      what makes `variables.get('NAME')` return the right type instead of
      `unknown`.
      7 keys — pikku doc defineVariable

  TypedVariablesService  (class)
      The `variables` service as this project sees it: `get('NAME')` resolves
      the value's type from `VariablesMap` instead of returning `unknown`.
      12 keys — pikku doc TypedVariablesService

  VariablesMap  (interface)
      Every variable this project declares with `defineVariable`, keyed by name.
      It is what gives `variables.get('NAME')` a real type.

  Load the pikku-services skill before writing this if you need how rather than what.

#pikku/channel — wire it up

  Wires a function to a websocket channel, its message routes and its pub/sub
  topics.

  defineChannelRoutes  (function)
      Type-safe helper for defining channel message routes that can be composed.
      Returns the routes record as-is for use with wireChannel's
      onMessageWiring.
      example — pikku doc defineChannelRoutes

  pikkuChannelConnectionFunc  (function)
      Creates a function that handles WebSocket channel connections. Called when
      a client connects to a channel.
      example — pikku doc pikkuChannelConnectionFunc

  pikkuChannelDisconnectionFunc  (function)
      Creates a function that handles WebSocket channel disconnections. Called
      when a client disconnects from a channel.
      example — pikku doc pikkuChannelDisconnectionFunc

  pikkuChannelFunc  (function)
      Creates a function that handles WebSocket channel messages. Called when a
      message is received on a channel.
      example — pikku doc pikkuChannelFunc

  wireChannel  (function)
      Registers a WebSocket channel with the Pikku framework.
      12 keys — pikku doc wireChannel

  Load the pikku-wiring skill before writing this if you need how rather than what.

#pikku/cli — wire it up

  Wires a function as a command, with its flags and arguments derived from the
  function input.

  defineCLICommands  (function)
      Type-safe helper for defining CLI commands that can be composed and spread
      into wireCLI.
      example — pikku doc defineCLICommands

  pikkuCLICommand  (function)
      Creates a CLI command definition with automatic option inference from the
      function's input type. This allows TypeScript to automatically derive CLI
      options from the function signature.
      11 keys — pikku doc pikkuCLICommand

  pikkuCLIRender  (function)
      Creates a type-safe CLI renderer with access to your application's
      singleton services. The renderer receives the full singleton services and
      output data to format and display results.
      example — pikku doc pikkuCLIRender

  wireCLI  (function)
      Registers a CLI application with the Pikku framework. Creates command-line
      interfaces with type-safe commands and options.
      10 keys — pikku doc wireCLI

  Load the pikku-wiring skill before writing this if you need how rather than what.

#pikku/gateway — wire it up

  Wires a function behind a gateway that receives requests on behalf of another
  system.

  GatewayAdapter  (interface)
      What a gateway integration implements: parse an incoming event into a
      message, send one back, and open and close the connection.
      6 keys — pikku doc GatewayAdapter

  GatewayInboundMessage  (interface)
      One message arriving from a gateway, normalised: who sent it, in which
      conversation, and what they said.
      5 keys — pikku doc GatewayInboundMessage

  GatewayOutboundMessage  (interface)
      One message to send back through a gateway — plain text, or the provider's
      own rich content.
      3 keys — pikku doc GatewayOutboundMessage

  GatewayTransportType  (type)
      'webhook' the platform POSTs to us, 'websocket' the client connects to us,
      'listener' no route at all.

  GatewayWiring  (type)
      Type definition for gateway wirings. Declares a gateway name, its
      transport and its target pikku function.
      13 keys — pikku doc GatewayWiring

  PikkuGatewayAdapterFactory  (type)
      Builds a {@link GatewayAdapter} from your application's services. The core
      factory type is handed `CoreSingletonServices`; this one receives the
      services your project actually registered.

  WebhookVerificationResult  (type)
      What a gateway's `verifyWebhook` returns — verified, with the response the
      provider expects back, or not.
      1 keys — pikku doc WebhookVerificationResult

  wireGateway  (function)
      Registers a gateway with the Pikku framework. Runs everywhere — inspector
      extracts at build time.
      13 keys — pikku doc wireGateway

  Load the pikku-wiring skill before writing this if you need how rather than what.

#pikku/http — wire it up

  Wires a function to an HTTP route, with the path parameters checked against
  the function input.

  defineHTTPRoutes  (function)
      Type-safe helper for defining route contracts that can be composed.
      example — pikku doc defineHTTPRoutes

  wireHTTP  (function)
      Registers an HTTP wiring with the Pikku framework.
      11 keys — pikku doc wireHTTP

  wireHTTPRoutes  (function)
      Wires multiple HTTP routes from a nested map or array configuration.
      example — pikku doc wireHTTPRoutes

  Load the pikku-wiring skill before writing this if you need how rather than what.

#pikku/mcp — wire it up

  Wires a function as an MCP tool, resource or prompt for a model to call.

  pikkuMCPPromptFunc  (function)
      Creates a function for handling MCP prompt requests. These functions
      generate prompt templates for AI models.
      example — pikku doc pikkuMCPPromptFunc

  pikkuMCPResourceFunc  (function)
      Creates a function for handling MCP resource requests. These functions
      provide data that AI models can access.
      example — pikku doc pikkuMCPResourceFunc

  pikkuMCPToolFunc  (function)
      Creates a function for handling MCP tool invocations. These functions
      perform actions that AI models can request.
      example — pikku doc pikkuMCPToolFunc

  wireMCPPrompt  (function)
      Registers an MCP prompt with the Pikku framework. Prompts provide
      templates that AI models can use.
      7 keys — pikku doc wireMCPPrompt

  wireMCPResource  (function)
      Registers an MCP resource with the Pikku framework. Resources provide data
      that AI models can access.
      11 keys — pikku doc wireMCPResource

  Load the pikku-wiring skill before writing this if you need how rather than what.

#pikku/queue — wire it up

  Wires a function as a queue worker, so a job on the queue runs the same
  handler an HTTP route would.

  wireQueueWorker  (function)
      Registers a queue worker with the Pikku framework. Workers process
      background jobs from queues.
      6 keys — pikku doc wireQueueWorker

  Load the pikku-wiring skill before writing this if you need how rather than what.

#pikku/scheduler — wire it up

  Wires a function to a cron expression to run it on a schedule.

  wireScheduler  (function)
      Registers a scheduled task with the Pikku framework. Tasks run based on
      cron expressions and are sessionless.
      5 keys — pikku doc wireScheduler

  Load the pikku-wiring skill before writing this if you need how rather than what.

#pikku/trigger — wire it up

  Wires a function to an event a source emits, rather than to a caller that asks
  for it.

  pikkuTriggerFunc  (function)
      Creates a trigger function configuration. Use this to define trigger
      functions that set up subscriptions.
      example — pikku doc pikkuTriggerFunc

  pikkuWebhookReceive  (function)
      A webhook source's `receive`: reads the request into events, or answers a
      handshake through `http.response`. It is public (`auth: false`) and only
      its source's route runs it, so it is never callable as an RPC. Signatures
      are the source's `verify`.
      example — pikku doc pikkuWebhookReceive

  wireTrigger  (function)
      Registers a trigger with the Pikku framework. Declares a trigger name and
      its target pikku function. Runs everywhere — inspector extracts at build
      time.
      4 keys — pikku doc wireTrigger

  wireTriggerSource  (function)
      Registers a trigger source with the Pikku framework. Provides the
      subscription function and input data. Only imported in the trigger worker
      process.
      example — pikku doc wireTriggerSource

  wireTriggerWebhookSource  (function)
      Receives a provider's webhooks as trigger events. Pikku mounts an open
      route at `route` (default `/webhooks/<name>`) that runs `receive`,
      validates each event against `events`, and queues it for the trigger named
      `<name>:<event>`. `check`, `setup` and `teardown` register the route with
      the provider at deploy, via `pikku webhooks`.
      6 keys — pikku doc wireTriggerWebhookSource

  Load the pikku-wiring skill before writing this if you need how rather than what.

#pikku/auth — guard it

  Who may call a function, and what the call is made with: permissions that see
  the request, auth gates that run before it, and the credentials a function
  borrows rather than holds.

  addGlobalPermission  (function)
      Wire-agnostic global permissions. Runs at the top of every wiring's
      permission resolution — before wire-, tag-, and function-level entries.
      example — pikku doc addGlobalPermission

  defineCredential  (function)
      Declares a credential. The body is a no-op that tree-shakes away — the CLI
      reads the call by AST, so the declaration must be a top-level literal.
      `type: 'wire'` is per-user, `type: 'singleton'` is platform-wide.
      7 keys — pikku doc defineCredential

  pikkuAuth  (function)
      Factory function for creating auth-only permissions with tree-shaking
      support. Auth permissions only receive services and session (no request
      data), making them evaluable before request data is available.
      example — pikku doc pikkuAuth

  pikkuBetterAuth  (function)
      Builds this project's Better Auth instance. The factory is handed the
      singleton services, with typed `secrets` and `variables`, and is called
      lazily so config and secrets are resolved before auth is constructed.
      example — pikku doc pikkuBetterAuth

  pikkuPermission  (function)
      Factory function for creating permissions with tree-shaking support.
      Supports both direct function and configuration object syntax.
      example — pikku doc pikkuPermission

  PikkuPermission  (type)
      Type-safe API permission definition that integrates with your
      application's session type. Use this to define authorization logic for
      your API endpoints.
      PikkuPermission<In, RequiredServices>

  pikkuPermissionFactory  (function)
      Factory function for creating permission factories Use this when your
      permission needs configuration/input parameters
      example — pikku doc pikkuPermissionFactory

  Load the pikku-auth skill before writing this if you need how rather than what.

#pikku/scopes — guard it

  The scopes a caller can hold and the roles that grant them, gating a call
  outside the permission pool.

  defineFeatureFlags  (function)
      No-op function for declaring feature flags. This exists purely for
      TypeScript type checking and will be tree-shaken. The CLI extracts
      metadata via AST parsing and generates a `FeatureFlagName` union, so
      `flags.calList` is a compile error rather than a silent `false`.
      example — pikku doc defineFeatureFlags

  defineScope  (function)
      Declares scopes. The body is a no-op that tree-shakes away — the CLI reads
      the call by AST and generates a `ScopeId` union, so a function referencing
      an undeclared scope fails the build.
      example — pikku doc defineScope

  defineSystemRole  (function)
      No-op function for declaring system roles. This exists purely for
      TypeScript type checking and will be tree-shaken. The CLI extracts
      metadata via AST parsing and generates a `SystemRoleName` union, so a
      virtual user naming an undeclared role fails the build.
      example — pikku doc defineSystemRole

  FeatureFlagName  (type)
      Every feature flag declared in this application.
      never

  Load the pikku-auth skill before writing this if you need how rather than what.

#pikku/agent — orchestrate it

  Defines an AI agent, the tools it may call and the scorers that judge what it
  did.

  agent  (function)
      A ready-made function that runs the named agent once and returns its
      result — wire it straight to a route when you need no logic around the
      run.
      example — pikku doc agent

  agentApprove  (function)
      A ready-made function that answers every pending approval for a run at
      once.
      example — pikku doc agentApprove

  agentResume  (function)
      A ready-made function that answers one pending tool approval, letting a
      run that paused for a human carry on.
      example — pikku doc agentResume

  agentStream  (function)
      The streaming counterpart of `agent`: wire it to a channel to send tokens
      and tool calls as they happen instead of waiting for the run to finish.
      example — pikku doc agentStream

  pikkuAgent  (function)
      Declares an agent: the model, the prompt, the tools it may call and the
      shape of what it returns. Wire it like any other function.
      23 keys — pikku doc pikkuAgent

  pikkuAgentJudge  (function)
      Declares a scorer that grades an agent run with another model, for the
      qualities a programmatic check cannot express.
      8 keys — pikku doc pikkuAgentJudge

  pikkuAgentScorer  (function)
      Declares a scorer that grades an agent run programmatically — a function
      over the run's input and output returning a score.
      5 keys — pikku doc pikkuAgentScorer

  Load the pikku-agent skill before writing this if you need how rather than what.

#pikku/workflow — orchestrate it

  Composes functions into a durable workflow whose steps survive a restart and
  retry on their own.

  PikkuFunctionWorkflow  (type)
      The shape of a workflow's body — services, input, and the workflow wire.
      PikkuFunctionWorkflow<In, Out>

  pikkuWorkflowComplexFunc  (function)
      Declares a workflow whose control flow the DSL cannot express - a loop
      whose bound is only known at runtime, or branching that rejoins. An escape
      hatch: reach for `pikkuWorkflowFunc` unless the shape genuinely needs
      this.
      example — pikku doc pikkuWorkflowComplexFunc

  pikkuWorkflowFunc  (function)
      Declares a workflow: the DSL form, where each step is awaited in order and
      the runner persists progress between them so a restart resumes rather than
      replays. The default choice for a workflow.
      example — pikku doc pikkuWorkflowFunc

  pikkuWorkflowGraph  (function)
      Declares a workflow as an explicit node graph, for a genuine cyclic
      dependency or a Node-only import the DSL cannot carry. The last resort of
      the three.
      7 keys — pikku doc pikkuWorkflowGraph

  TypedWorkflow  (interface)
      The wire a workflow step is handed: `step` to run one durably, plus
      sleeping, waiting for a signal and asking for approval.
      9 keys — pikku doc TypedWorkflow

  WorkflowCancelledException  (class)
      Thrown inside a workflow step when the run has been cancelled, so the step
      stops rather than finishing work nobody wants.
      2 keys — pikku doc WorkflowCancelledException

  Load the pikku-workflow skill before writing this if you need how rather than what.

#pikku/scenarios — test it

  Drives features and scenarios against a real running server, in the vocabulary
  a user would use.

  createCookieJar  (function)
      A cookie store for a scenario run, so a step that signs in leaves the
      session cookie behind for the steps after it.
      example — pikku doc createCookieJar

  pikkuAddonScenarioStep  (function)
      A step in which a third-party system acts — "Given Stripe's webhook
      arrives", "When Mailgun bounces it".
      example — pikku doc pikkuAddonScenarioStep

  PikkuBrowserWire  (interface)
      One virtual user's browser session, handed to a step as `wire.browser`.
      3 keys — pikku doc PikkuBrowserWire

  pikkuFeature  (function)
      A feature: an ordered group of scenarios, mirroring gherkin's Feature ↔
      Scenario structure. Scenarios are referenced by imported identifier, so a
      renamed or deleted scenario is a compile error rather than a silent skip.
      example — pikku doc pikkuFeature

  PikkuFeatureEntry  (type)
      One entry in a feature's `scenarios` list, validated against itself: a
      bare scenario, or a scenario paired with the input to run it with. The
      paired form is gherkin's `Examples:` written as an ordinary loop.
      PikkuFeatureEntry<Entry>

  PikkuFunctionScenario  (type)
      `Ctx` types `scenario.context`, defaulting to the body's own output. A
      hook returns void but shares the scenario's context, so it passes that
      scenario's output here instead.
      PikkuFunctionScenario<In, Out, Ctx>

  PikkuFunctionScenarioStep  (type)
      One surface's implementation of a step.
      PikkuFunctionScenarioStep<In, Out, Surface, HasVirtualUser>

  pikkuPlatformScenarioStep  (function)
      A step in which the app acts on itself — "Given the platform has expired
      the trial".
      example — pikku doc pikkuPlatformScenarioStep

  pikkuScenario  (function)
      A scenario: a complex workflow that drives the app the way users do. Steps
      run as virtual users over the REAL transport — `scenario.do(step, rpc,
      data, { virtualUser: virtualUsers.yasser })` — so flows double as e2e
      tests and staged/production health checks (no state reset; scope what you
      create).
      example — pikku doc pikkuScenario

  pikkuScenarioHook  (function)
      Declares a scenario hook. Returns the function verbatim — a hook is never
      registered, so this exists purely to give an inline hook a call site to be
      contextually typed from, the way every other pikku primitive is.
      example — pikku doc pikkuScenarioHook

  PikkuScenarioHook  (type)
      A scenario lifecycle hook: the scenario's own `(services, data, wire)`
      signature with its result discarded. `OutputSchema` types
      `scenario.context` while the return type stays `void`.
      PikkuScenarioHook<InputSchema, OutputSchema>

  PikkuScenarioRef  (type)
      A scenario as a feature references it. Any `pikkuScenario` export is
      assignable; `In` is recovered from it so the paired form's `data` is
      checked against that scenario's own input.
      32 keys — pikku doc PikkuScenarioRef

  pikkuScenarioStep  (function)
      A named, reusable scenario step, declaring one implementation per surface
      an virtual user can drive it through.
      example — pikku doc pikkuScenarioStep

  pollUntil  (function)
      Retries an assertion until it passes or the timeout runs out — for the
      eventually-consistent parts of a scenario (a queued job, a projection).
      example — pikku doc pollUntil

  postScenarioJson  (function)
      POST JSON somewhere and report what came back, without throwing on a
      4xx/5xx.
      example — pikku doc postScenarioJson

  readScenarioHttpResponse  (function)
      Drain a response into the shape a step can carry: the parsed body (an
      empty one counting as no body at all) alongside the text it was parsed
      from.
      example — pikku doc readScenarioHttpResponse

  requireScenarioEnv  (function)
      The environment the current scenario run targets, or a throw explaining
      that the run carries none. Use it in a step that needs the target's URLs.
      example — pikku doc requireScenarioEnv

  ScenarioHttpResponse  (interface)
      What the transport answered, for a step that treats the status as data.
      4 keys — pikku doc ScenarioHttpResponse

  ScenarioSurface  (type)
      How a virtual user drives the system for one step.

  TestIdSelector  (interface)
      How a browser step names an element.
      5 keys — pikku doc TestIdSelector

  TypedScenario  (type)
      `Out` types `scenario.context`.
      15 keys — pikku doc TypedScenario

  TypedScenarioSteps  (interface)
      The typed half of a scenario wire: `given`/`when`/`then`, narrowed to the
      names declared by `pikkuScenarioStep` in this project. `given` and `when`
      differ only in the prose the reporter renders; `then` additionally makes
      the step's bindings witnesses rather than alternatives.

  TypedVirtualUsers  (type)
      The virtual users this project declares, keyed by name — the `virtual
      users` a scenario step runs as.

  Load the pikku-scenario skill before writing this if you need how rather than what.
