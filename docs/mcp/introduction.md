# MCP Introduction

The Model Control Protocol (MCP) integration allows you to expose your Pikku functions as tools and resources that AI models can interact with directly.

## Overview

Pikku provides first-class support for MCP, allowing you to:

- **Tools**: Expose functions that AI models can call to perform actions
- **Resources**: Provide data sources that AI models can read from
- **Prompts**: Create template generators for AI interactions

## Quick Start

### 1. Define MCP Functions

Create your MCP functions using the specialized function types:

```typescript
// mcp.functions.ts
import { NotFoundError } from '@pikku/core'
import {
  pikkuMCPPromptFunc,
  pikkuMCPResourceFunc,
  pikkuMCPToolFunc,
} from '../.pikku/pikku-types.gen.js'

// Example tool, resource, and prompt functions...
```

### 2. Register MCP Endpoints

Register your functions as MCP endpoints:

```typescript
// mcp.routes.ts
import {
  addMCPTool,
  addMCPResource,
  addMCPPrompt,
} from '../.pikku/pikku-types.gen.js'

// Register your functions...
```

### 3. Run the MCP Server

```bash
npx pikku serve mcp
```

Your Pikku functions are now available as MCP tools, resources, and prompts!

## Next Steps

- [Tools](./tools.md) - Learn how to create MCP tools
- [Resources](./resources.md) - Learn how to create MCP resources  
- [Prompts](./prompts.md) - Learn how to create MCP prompts