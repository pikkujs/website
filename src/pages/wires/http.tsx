import { FeaturePage } from '../../components/FeaturePage';
import type { PageData } from '../../components/FeaturePage/types';
import snippets from '../../data/snippets.json';

const basicsFunction = `const getBook = pikkuFunc({
  title: 'Get Book',
  description: 'Retrieve a book by ID',
  func: async ({ db }, { bookId }) => {
    return await db.getBook(bookId)
  },
  permissions: { user: isAuthenticated }
})`;

const basicsWiring = `wireHTTP({
  method: 'get',
  route: '/books/:bookId',
  func: getBook
})`;

const dataFlowCode = `wireHTTP({
  method: 'post',
  route: '/books/:bookId',
  func: updateBook
})

// POST /books/42?format=pdf
// Body: { title: "New Title" }
//
// → updateBook receives:
//   { bookId: "42", format: "pdf", title: "New Title" }`;

const authCode = `// Public route — no auth required
wireHTTP({
  method: 'get',
  route: '/books',
  func: listBooks,
  auth: false
})

// Protected with permissions
wireHTTP({
  method: 'delete',
  route: '/books/:bookId',
  func: deleteBook,
  permissions: {
    admin: isAdmin
  }
})

// Global route-level permission
addHTTPPermission(
  '/admin/*',
  { admin: isAdmin }
)`;

const middlewareCode = `import { cors, authBearer } from '@pikku/core/middleware'

// Global: CORS + bearer auth on every route
addHTTPMiddleware('*', [
  cors({ origin: 'https://app.example.com', credentials: true }),
  authBearer()
])

// Prefix: rate limiting on API routes only
addHTTPMiddleware('/api/*', [
  rateLimit({ maxRequests: 100, windowMs: 60_000 })
])

// Per-route: audit logging on a single wire
wireHTTP({
  method: 'delete',
  route: '/books/:bookId',
  func: deleteBook,
  middleware: [auditLog]
})`;

const routeGroupsCode = snippets.shopRoutes;

const fetchClientCode = `import { pikkuFetch } from '.pikku/pikku-fetch.gen.js'

pikkuFetch.setServerUrl('http://localhost:4002')

// Fully typed — route, input, and output are inferred
const books = await pikkuFetch.get('/api/v1/books', {})

const book = await pikkuFetch.get('/api/v1/books/:bookId', {
  bookId: '42'
})

const created = await pikkuFetch.post('/api/v1/books', {
  title: 'The Pikku Guide',
  author: 'You'
})

// Auth: set a JWT and all subsequent requests include it
pikkuFetch.setAuthorizationJWT(token)`;

const sseWiringCode = `wireHTTP({
  method: 'get',
  route: '/todos',
  func: getTodos,
  sse: true      // ← that's it
})`;

const sseFunctionCode = `const getTodos = pikkuFunc({
  title: 'Get Todos',
  func: async ({ db, channel }, {}) => {
    const todos = await db.getTodos()

    // If client supports SSE, stream them
    if (channel) {
      for (const todo of todos) {
        channel.send({ todo })
        await sleep(100)
      }
      return
    }

    // Otherwise, return the full list
    return { todos }
  }
})`;

const page: PageData = {
  meta: {
    title: 'HTTP Wire — Pikku',
    description: 'Turn your Pikku functions into type-safe REST endpoints with automatic input merging, OpenAPI generation, and optional SSE streaming.',
  },
  sections: [
    {
      component: 'hero',
      badge: 'Wire Type: HTTP',
      h1: 'Your functions, now\n_REST endpoints._',
      lead: 'wireHTTP maps your Pikku functions to type-safe HTTP routes — with automatic input merging, OpenAPI generation, and optional SSE streaming.',
      cta: [
        { label: 'Get Started', to: '/docs/wiring/http', primary: true },
        { label: 'See the Code', to: '#basics', primary: false },
      ],
      right: { type: 'wire-icon', name: 'http' },
    },

    {
      component: 'two-col',
      id: 'basics',
      eyebrow: 'The Basics',
      h2: 'Function to endpoint in _two lines_',
      lead: 'Define your function once, wire it to a route. Pikku handles the rest.',
      variant: 'default',
      left: {
        type: 'code',
        code: { filename: 'getBook.func.ts', badge: 'func.ts', code: basicsFunction },
      },
      right: {
        type: 'code',
        code: { filename: 'books.wiring.ts', badge: 'wiring.ts', icon: 'http', code: basicsWiring },
      },
      below: {
        type: 'check-list',
        items: [
          { title: 'Path params extracted', body: ':bookId becomes a typed input field automatically.' },
          { title: 'Errors mapped to status codes', body: 'Throw NotFoundError → 404, UnauthorizedError → 401.' },
          { title: 'OpenAPI generated', body: 'Every wired route appears in your OpenAPI spec for free.' },
        ],
      },
    },

    {
      component: 'wide-code',
      eyebrow: 'Data Flow',
      h2: 'Everything merges into _one typed input_',
      lead: 'Path params, query strings, and request bodies combine into a single object your function receives.',
      variant: 'alt',
      code: { filename: 'books.wiring.ts', icon: 'http', code: dataFlowCode },
      below: {
        type: 'note',
        icon: 'alert-triangle',
        title: 'Same key in multiple sources with different values?',
        body: 'Pikku throws a validation error — no silent overwrites.',
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Auth & Permissions',
      h2: 'Auth and permissions, _everywhere_',
      lead: 'Every HTTP route inherits Pikku\'s auth system. Override per-route or apply globally.',
      variant: 'default',
      left: {
        type: 'cards',
        cards: [
          { icon: 'globe', title: 'Per-route auth control', body: 'Set auth: false on public routes. Everything else requires a valid session by default.' },
          { icon: 'shield-check', title: 'Permission guards', body: 'Attach permission checks to individual routes. Pikku rejects unauthorized requests before your function runs.' },
          { icon: 'lock', title: 'Global policies', body: 'Use addHTTPPermission to apply rules to entire path prefixes — every route under /admin requires admin access.' },
        ],
      },
      right: {
        type: 'code',
        code: { filename: 'books.wiring.ts', icon: 'http', code: authCode },
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Middleware',
      h2: 'Hooks at _every level_',
      lead: 'Apply middleware globally, by path prefix, or on individual routes. They run in onion order — outer middleware wraps inner.',
      variant: 'alt',
      left: {
        type: 'cards',
        cards: [
          { icon: 'globe', title: 'Global', body: "addHTTPMiddleware('*', [...]) — runs on every HTTP request. CORS, logging, auth.", mono: true },
          { icon: 'folder-tree', title: 'Prefix-based', body: "addHTTPMiddleware('/api/*', [...]) — scoped to a path prefix. Rate limiting, admin guards.", mono: true },
          { icon: 'layers', title: 'Per-route', body: 'middleware: [...] on a single wireHTTP call. Audit trails, special validation.', mono: true },
        ],
      },
      right: {
        type: 'code',
        code: { filename: 'middleware.ts', icon: 'http', code: middlewareCode },
      },
    },

    {
      component: 'wide-code',
      eyebrow: 'Route Groups',
      h2: 'Organize routes with _defineHTTPRoutes_',
      lead: 'Group related routes into contracts. Compose them with shared base paths, middleware, and auth settings — then wire them all at once.',
      variant: 'default',
      code: { filename: 'shop.http.ts', badge: 'wiring.ts', icon: 'http', code: routeGroupsCode },
      below: {
        type: 'check-list',
        items: [
          { title: 'Config cascades down', body: 'basePath, tags, and middleware from the group apply to every route inside it.' },
          { title: 'Routes can override', body: 'Set auth: false on a single route even if the group requires auth.' },
          { title: 'Compose contracts', body: 'Define route groups in separate files, import and compose them in one wireHTTPRoutes call.' },
        ],
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Type-Safe Client',
      h2: 'Call your API with _full IntelliSense_',
      lead: 'Pikku generates a typed fetch client from your HTTP wirings. Every route, every input, every return type — autocompleted.',
      variant: 'alt',
      columns: '3fr 2fr',
      left: {
        type: 'code',
        code: { filename: 'client.ts', badge: 'auto-generated types', code: fetchClientCode },
      },
      right: {
        type: 'cards',
        cards: [
          { icon: 'link-2', title: 'Generated from your wirings', body: 'Run npx @pikku/cli fetch and get a PikkuFetch class with typed overloads for every HTTP route you\'ve wired.' },
          { icon: 'shield-check', title: 'Auth built in', body: 'setAuthorizationJWT(), setAPIKey() — set once, included on every request.' },
          { icon: 'globe', title: 'Works everywhere', body: 'Built on the Fetch API — works in the browser, Node, Deno, Next.js server components, or anywhere that has fetch.' },
        ],
      },
    },

    {
      component: 'two-col',
      eyebrow: 'Server-Sent Events',
      h2: 'When you need streaming, just add _sse: true_',
      lead: 'The same route serves both regular HTTP clients and SSE clients. Non-SSE clients get a JSON response, SSE clients get a stream.',
      variant: 'default',
      left: {
        type: 'code',
        code: { filename: 'todos.wiring.ts', badge: 'sse: true', icon: 'sse', code: sseWiringCode },
      },
      right: {
        type: 'code',
        code: { filename: 'getTodos.func.ts', badge: 'func.ts', code: sseFunctionCode },
      },
      below: {
        type: 'note',
        icon: 'zap',
        title: 'Dual response mode.',
        body: 'Your function checks if channel is available. SSE clients get a progressive stream; regular clients get the full JSON response.',
      },
    },

    {
      component: 'cta',
      h2: 'Start wiring HTTP in 5 minutes',
      lead: 'One command to scaffold a project with HTTP wiring already configured.',
      cmd: 'npm create pikku@latest',
      buttons: [
        { label: 'Read the HTTP Docs', to: '/docs/wiring/http', primary: true },
        { label: 'View on GitHub', to: 'https://github.com/pikkujs/pikku', primary: false },
      ],
      footnote: 'MIT Licensed · Works with Express, Fastify, Lambda & Cloudflare',
    },
  ],
};

export default function HTTPWirePage() {
  return <FeaturePage data={page} />;
}
