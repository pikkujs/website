# MCP Tools

MCP tools are functions that AI models can call to perform actions. They receive typed parameters and return structured content.

## Creating Tools

Use `pikkuMCPToolFunc` to create MCP tools:

```typescript
import { pikkuMCPToolFunc } from '../.pikku/pikku-types.gen.js'

export const sayHello = pikkuMCPToolFunc<{ name?: string }>(
  async (services, { name = 'World' }) => {
    services.logger.info(`Saying hello to: ${name}`)

    return [
      {
        type: 'text',
        text: `Hello, ${name}! This is a Pikku MCP tool.`,
      },
    ]
  }
)
```

## Tool with Complex Parameters

Tools can have complex typed parameters with validation:

```typescript
export const calculate = pikkuMCPToolFunc<{
  operation: 'add' | 'subtract' | 'multiply' | 'divide'
  a: number
  b: number
}>(async ({ logger }, { operation, a, b }) => {
  logger.info(`Calculating: ${a} ${operation} ${b}`)

  let result: number

  switch (operation) {
    case 'add':
      result = a + b
      break
    case 'subtract':
      result = a - b
      break
    case 'multiply':
      result = a * b
      break
    case 'divide':
      if (b === 0) {
        throw new Error('Division by zero is not allowed')
      }
      result = a / b
      break
    default:
      throw new Error(`Unknown operation: ${operation}`)
  }

  return [
    {
      type: 'text',
      text: `The result of ${a} ${operation} ${b} is ${result}.`,
    },
  ]
})
```

## Tool Management

Tools can manage other tools dynamically:

```typescript
export const disableTool = pikkuMCPToolFunc<{ name: string }>(
  async (services, { name }) => {
    const changed = await services.mcp.enableTools({ [name]: false })
    if (changed) {
      return [
        {
          type: 'text',
          text: `Tool '${name}' has been disabled.`,
        },
      ]
    } else {
      return [
        {
          type: 'text',
          text: `Tool '${name}' is not enabled or does not exist.`,
        },
      ]
    }
  }
)
```

## Registering Tools

Register your tools in the routes file:

```typescript
// mcp.routes.ts
import { addMCPTool } from '../.pikku/pikku-types.gen.js'
import { sayHello, calculate, disableTool } from './mcp.functions.js'

addMCPTool({
  name: 'sayHello',
  description: 'Greet someone with a friendly hello message',
  func: sayHello,
  tags: ['greeting', 'hello', 'demo'],
})

addMCPTool({
  name: 'calculate',
  description:
    'Perform basic mathematical operations (add, subtract, multiply, divide)',
  func: calculate,
  tags: ['math', 'calculator', 'arithmetic'],
})

addMCPTool({
  name: 'disableTool',
  description: 'Disable a tool by name',
  func: disableTool,
  tags: [],
})
```

## Return Types

Tools return an array of content blocks. Each block has a `type` and corresponding content:

- `text`: Plain text content
- `image`: Image content (if supported)
- `resource`: Reference to a resource

```typescript
return [
  {
    type: 'text',
    text: 'This is the response text',
  },
]
```