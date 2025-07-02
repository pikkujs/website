export const features = [
    {
      "title": "Fully Typed Runtime",
      "content": "Think tRPC but purely using types and interfaces.",
      "icon": "🎯"
    },
    {
      "title": "Session & Middleware", 
      "content": "Think Express but simpler permissions and auth.",
      "icon": "🔐"
    },
    {
      "title": "Service Injection",
      "content": "Think NestJS without decorators or magic.", 
      "icon": "⚙️"
    },
    {
      "title": "Deploy Anywhere",
      "content": "Think Hono but much more powerful.",
      "icon": "🌍"
    }
  ];
  
  export const developerFeatures = [
    {
      "title": "HTTP",
      "content": "Handle REST APIs and HTTP requests with full type safety.",
      "icon": "📡"
    },
    {
      "title": "WebSocket",
      "content": "Real-time bidirectional communication with typed messages.",
      "icon": "🔌"
    },
    {
      "title": "Server-Side Events",
      "content": "Stream data to clients with automatic reconnection.",
      "icon": "📺"
    },
    {
      "title": "Scheduled Tasks",
      "content": "Cron-like scheduling that works anywhere you deploy.",
      "icon": "⏰"
    },
    {
      "title": "Queues",
      "content": "Background job processing with reliable message delivery.",
      "icon": "📦"
    },
    {
      "title": "RPC",
      "content": "Call server functions like local functions with complete type safety.",
      "icon": "🎯"
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
  