# Import Patterns

Pikku uses a consistent import pattern across your codebase using path aliases that point to generated files.

## Core Function Types

Core function types come from `#pikku`:

```typescript
import { pikkuFunc, pikkuMiddleware, pikkuPermission } from '#pikku'
```

## Wiring Functions

Wiring functions come from their specific modules:

```typescript
import { wireHTTP, addHTTPMiddleware } from '#pikku/http'
import { wireChannel } from '#pikku/channel'
import { wireCLI } from '#pikku/cli'
import { wireQueueWorker } from '#pikku/queue'
import { wireScheduler } from '#pikku/scheduler'
import { wireMCPTool, wireMCPResource, wireMCPPrompt } from '#pikku/mcp'
```

## TypeScript Configuration

Configure these aliases in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "#pikku": [".pikku/index.gen.ts"],
      "#pikku/http": [".pikku/http/index.gen.ts"],
      "#pikku/channel": [".pikku/channel/index.gen.ts"],
      "#pikku/cli": [".pikku/cli/index.gen.ts"],
      "#pikku/queue": [".pikku/queue/index.gen.ts"],
      "#pikku/scheduler": [".pikku/scheduler/index.gen.ts"],
      "#pikku/mcp": [".pikku/mcp/index.gen.ts"]
    }
  }
}
```

## Generated Files Location

The generated files live in the `.pikku/` directory:

- `.pikku/index.gen.ts` - Core types and function definitions
- `.pikku/http/index.gen.ts` - HTTP-specific wiring and middleware functions
- `.pikku/channel/index.gen.ts` - Channel-specific functions
- `.pikku/cli/index.gen.ts` - CLI-specific functions
- `.pikku/queue/index.gen.ts` - Queue-specific functions
- `.pikku/scheduler/index.gen.ts` - Scheduler-specific functions
- `.pikku/mcp/index.gen.ts` - MCP-specific functions

These files are regenerated whenever you change your functions or wirings. Don't edit them manually – they're automatically kept in sync with your source code.
