---
sidebar_position: 11
title: MCP Server
description: Build Model Context Protocol servers for AI applications
---

# MCP Server

The Model Context Protocol (MCP) is an open standard for connecting AI assistants to external systems and data sources. Pikku provides first-class support for building MCP servers with full type safety and automatic schema generation.

## Overview

MCP servers in Pikku allow you to:
- Expose tools for AI assistants to use
- Provide resources and data sources
- Create prompt templates
- Stream responses for real-time interactions
- Maintain full type safety throughout

## Creating MCP Tools

MCP tools are functions that AI assistants can call to perform actions:

```typescript
import { pikkuSessionlessFunc } from '@pikku/core'
import { addMCPTool } from '@pikku/mcp'

export const analyzeCode = pikkuSessionlessFunc<
  { code: string; language: string },
  { complexity: number; suggestions: string[] }
>(async ({ logger }, { code, language }) => {
  logger.info(`Analyzing ${language} code`)
  
  // Your analysis logic here
  const complexity = calculateComplexity(code)
  const suggestions = generateSuggestions(code, language)
  
  return {
    complexity,
    suggestions
  }
})

addMCPTool({
  name: 'analyze_code',
  description: 'Analyze code complexity and provide suggestions',
  func: analyzeCode,
  inputSchema: {
    type: 'object',
    properties: {
      code: { 
        type: 'string',
        description: 'The source code to analyze'
      },
      language: { 
        type: 'string',
        description: 'Programming language of the code'
      }
    },
    required: ['code', 'language']
  }
})
```

## MCP Resources

Resources provide read-only data that AI assistants can access:

```typescript
export const getProjectFiles = pikkuSessionlessFunc<
  { projectPath: string },
  { files: Array<{ path: string; content: string; type: string }> }
>(async ({ logger, fs }, { projectPath }) => {
  const files = await fs.readDirectory(projectPath, { recursive: true })
  
  return {
    files: await Promise.all(
      files.map(async (filePath) => ({
        path: filePath,
        content: await fs.readFile(filePath, 'utf8'),
        type: path.extname(filePath).slice(1)
      }))
    )
  }
})

addMCPResource({
  uri: 'file://projects/{projectPath}',
  name: 'Project Files',
  description: 'Access files in a project directory',
  func: getProjectFiles,
  mimeType: 'application/json'
})
```

## Prompt Templates

Create reusable prompt templates for AI assistants:

```typescript
export const createCodeReview = pikkuSessionlessFunc<
  { code: string; style: 'strict' | 'casual' },
  { prompt: string }
>(async ({ logger }, { code, style }) => {
  const stylePrompts = {
    strict: 'Provide a thorough, formal code review focusing on best practices and potential issues.',
    casual: 'Give a friendly code review with helpful suggestions and encouragement.'
  }
  
  return {
    prompt: `${stylePrompts[style]}\n\nCode to review:\n\`\`\`\n${code}\n\`\`\``
  }
})

addMCPPrompt({
  name: 'code_review',
  description: 'Generate a code review prompt',
  func: createCodeReview,
  arguments: {
    code: {
      description: 'The code to review',
      required: true
    },
    style: {
      description: 'Review style preference',
      required: false
    }
  }
})
```

## Streaming Responses

For long-running operations, use streaming responses:

```typescript
export const streamAnalysis = pikkuSessionlessFunc<
  { projectPath: string },
  AsyncGenerator<{ stage: string; progress: number; message: string }>
>(async function* ({ logger }, { projectPath }) {
  yield { stage: 'scanning', progress: 0, message: 'Starting analysis...' }
  
  const files = await scanFiles(projectPath)
  yield { stage: 'scanning', progress: 25, message: `Found ${files.length} files` }
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const analysis = await analyzeFile(file)
    
    yield {
      stage: 'analyzing',
      progress: 25 + (i / files.length) * 75,
      message: `Analyzed ${file.name}`
    }
  }
  
  yield { stage: 'complete', progress: 100, message: 'Analysis complete' }
})

addMCPTool({
  name: 'stream_analysis',
  description: 'Stream real-time analysis progress',
  func: streamAnalysis,
  streaming: true
})
```

## Server Configuration

Configure your MCP server:

```typescript
import { MCPServer } from '@pikku/mcp'
import { createSingletonServices } from './services'

const server = new MCPServer({
  name: 'My Development Tools',
  version: '1.0.0',
  singletonServices: await createSingletonServices(),
  capabilities: {
    tools: true,
    resources: true,
    prompts: true,
    logging: true
  }
})

// Start the server
await server.start()
```

## Runtime Support

MCP servers can run on various platforms:

| Runtime | Support | Notes |
|---------|---------|-------|
| Express | ✅ | Full HTTP and WebSocket support |
| Fastify | ✅ | High-performance MCP server |
| AWS Lambda | ✅ | Serverless MCP endpoints |
| Custom | ✅ | Build your own MCP transport |
| Standalone | ✅ | Dedicated MCP server process |

## AI Assistant Integration

### Claude Desktop

Configure Claude Desktop to use your MCP server:

```json
{
  "mcpServers": {
    "pikku-dev-tools": {
      "command": "node",
      "args": ["dist/mcp-server.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Custom Integration

```typescript
import { MCPClient } from '@pikku/mcp-client'

const client = new MCPClient({
  serverUrl: 'http://localhost:3000/mcp',
  capabilities: ['tools', 'resources']
})

// Call a tool
const result = await client.callTool('analyze_code', {
  code: 'console.log("Hello, world!")',
  language: 'javascript'
})

// Get a resource
const files = await client.getResource('file://projects/my-app')
```

## Security Considerations

1. **Authentication**: Implement proper auth for sensitive operations
2. **Sandboxing**: Isolate code execution and file access
3. **Rate Limiting**: Prevent abuse of computational resources
4. **Input Validation**: Validate all inputs from AI assistants
5. **Audit Logging**: Log all tool calls and resource access

## Advanced Features

### Custom Transports

```typescript
import { MCPTransport } from '@pikku/mcp'

class CustomTransport implements MCPTransport {
  async send(message: MCPMessage): Promise<void> {
    // Custom message sending logic
  }
  
  async receive(): Promise<MCPMessage> {
    // Custom message receiving logic
  }
}
```

### Error Handling

```typescript
export const robustTool = pikkuSessionlessFunc<
  { input: string },
  { result: string; warnings?: string[] }
>(async ({ logger }, { input }) => {
  const warnings: string[] = []
  
  try {
    const result = await processInput(input)
    return { result, warnings }
  } catch (error) {
    logger.error('Tool execution failed:', error)
    throw new MCPError('TOOL_EXECUTION_FAILED', error.message)
  }
})
```

MCP servers in Pikku provide a powerful way to integrate AI assistants with your development tools and workflows while maintaining type safety and performance.