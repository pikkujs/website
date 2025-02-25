
export const features = [
    {
      "title": "Vanilla TypeScript",
      "content": "Write functions and services using vanilla TypeScript — just user logic and types.",
      "icon": "🍦"
    },
    {
      "title": "Transport Agnostic",
      "content": "Wire functions to HTTP, WebSockets, Cron jobs and more. Pikku adapts to any event-driven architecture.",
      "icon": "🚦"
    },
    {
      "title": "Batteries Included",
      "content": "Auth, validation, and services built-in — everything you need without extra dependencies.",
      "icon": "🔋"
    },
    {
      "title": "Deploy Anywhere",
      "content": "Works on cloud, server, edge, or serverless with minimal config—no runtime lock-in.",
      "icon": "🌍"
    }
  ];
  
  export const developerFeatures = [
    {
      "title": "OpenAPI & Typed Clients",
      "content": "Automatcically generates OpenAPI documentation and tiny fully-typed Fetch/WebSocket clients automatically.",
      "icon": "📖"
    },
    {
      "title": "Generated Type Safety & Validation",
      "content": "Pikku generates schemas from your function types, ensuring full type safety and runtime validation without additional code.",
      "icon": "✅"
    },
    {
      "title": "Built-In Auth & Session Management",
      "content": "Secure APIs with built-in authentication, permissions, and user session management—no middleware required.",
      "icon": "🔒"
    },
    {
      "title": "Singleton & Session-Based Services",
      "content": "Define services that persist across function calls, whether singleton instances or session-scoped state.",
      "icon": "⚙️"
    }
  ];
  
  export const runtimes = {
    "cloud": [
      {
        "name": "AWS",
        "docs": "/docs/runtimes/aws-lambda",
        "supported": true,
        "img": {
          dark: "aws-dark.svg",
          light: "aws-light.svg"
        } 
      },
      // {
      //   "name": "Azure",
      //   "docs": "/docs/runtimes/azure-functions",
      //   "supported": true,
      //   "img": "logos/azure-light.svg"
      // },
      // {
      //   "name": "Vercel",
      //   "docs": "/docs/runtimes/vercel",
      //   "supported": true,
      //   "img": "logos/vercel-light.svg"
      // },
      {
        "name": "Cloudflare",
        "docs": "/docs/runtimes/cloudflare-functions",
        "supported": true,
        "img": {
          dark: "cloudflare-dark.svg",
          light: "cloudflare-light.svg"
        }
      },
      // {
      //   "name": "Google Cloud",
      //   "docs": "/docs/runtimes/google-cloud",
      //   "supported": false,
      //   "img": "logos/google-cloud-light.svg"
      // },
      // {
      //   "name": "Deno Deploy",
      //   "docs": "/docs/runtimes/deno-deploy",
      //   "supported": false,
      //   "img": "logos/deno.svg"
      // }
    ],
    "middleware": [
      {
        "name": "Express",
        "docs": "/docs/runtimes/express-middleware",
        "supported": true,
        "img": {
          dark: "express-dark.svg",
          light: "express-light.svg"
        }
      },
      {
        "name": "Fastify",
        "docs": "/docs/runtimes/fastify-plugin",
        "supported": true,
        "img": {
          dark: "fastify-dark.svg",
          light: "fastify-light.svg"
        }
      },
      {
        "name": "uWS",
        "docs": "/docs/runtimes/uws-handler",
        "supported": true,
       "img": {
          dark: "uws-dark.svg",
          light: "uws-light.svg"
        }
      },
      {
        "name": "ws",
        "docs": "/docs/runtimes/ws-handler",
        "supported": true,
       "img": {
          dark: "websocket-dark.svg",
          light: "websocket-light.svg"
        }
      },
      {
        "name": "nextJS",
        "docs": "/docs/runtimes/nextjs-app",
        "supported": true,
        "img": {
          dark: "nextjs-dark.svg",
          light: "nextjs-light.png"
        }
      },
      // {
      //   "name": "Koa",
      //   "docs": "/docs/runtimes/koa",
      //   "supported": true,
      //   "img": "logos/koda.svg"
      // },
      // {
      //   "name": "Hono",
      //   "docs": "/docs/runtimes/hono",
      //   "supported": true
      // },
      // {
      //   "name": "Bun",
      //   "docs": "/docs/runtimes/bun",
      //   "supported": false
      // }
    ],
    "custom": {
      "name": "Custom",
      "docs": "/docs/runtimes/custom",
      "img": {
        dark: "custom-dark.svg",
        light: "custom-light.svg"
      }
    }
  };
  