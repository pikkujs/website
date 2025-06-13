export const features = [
    {
      "title": "Just TypeScript",
      "content": "Write functions with types. No decorators or magic.",
      "icon": "🎯"
    },
    {
      "title": "Any Protocol", 
      "content": "HTTP, WebSockets, scheduled tasks, and RPCs from the same code.",
      "icon": "🔗"
    },
    {
      "title": "Auto-Generated",
      "content": "Clients, docs, validation, and auth generated from your functions.", 
      "icon": "⚡"
    },
    {
      "title": "Deploy Anywhere",
      "content": "Express, Lambda, Cloudflare, Next.js, or any runtime.",
      "icon": "🌍"
    }
  ];
  
  export const developerFeatures = [
    {
      "title": "Type-Safe Clients",
      "content": "Auto-generated TypeScript clients with full intellisense.",
      "icon": "📖"
    },
    {
      "title": "Runtime Validation",
      "content": "Schemas generated from your types ensure runtime safety.",
      "icon": "✅"
    },
    {
      "title": "Built-In Auth",
      "content": "Authentication and sessions with zero configuration.",
      "icon": "🔒"
    },
    {
      "title": "Service Layer",
      "content": "Dependency injection for databases, logging, and more.",
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
      "docs": "/docs/custom-runtimes/custom-http-runtime",
      "img": {
        dark: "custom-dark.svg",
        light: "custom-light.svg"
      }
    }
  };
  