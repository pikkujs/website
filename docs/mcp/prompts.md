# MCP Prompts

MCP prompts are template generators that help AI models create structured conversations and interactions. They can be static or dynamic with parameters.

## Creating Static Prompts

Use `pikkuMCPPromptFunc` to create static prompts:

```typescript
import { pikkuMCPPromptFunc } from '../.pikku/pikku-types.gen.js'

export const staticPromptGenerator = pikkuMCPPromptFunc<unknown>(async () => {
  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `This is a static prompt example. It does not take any arguments and simply returns a predefined message.`,
      },
    },
  ]
})
```

## Dynamic Prompts with Parameters

Prompts can accept parameters to generate customized content:

```typescript
export const dynamicPromptGenerator = pikkuMCPPromptFunc<{
  topic: string
  complexity: 'beginner' | 'intermediate' | 'advanced'
  includeExamples?: boolean
}>(async (services, { topic, complexity, includeExamples = false }) => {
  services.logger.info(
    `Generating progressive enhancement content for: ${topic} (${complexity})`
  )

  let content = `# Progressive Enhancement for ${topic}\n\n`

  switch (complexity) {
    case 'beginner':
      content += `This is a beginner-friendly introduction to ${topic}.\n\n`
      content += `Start with the basics and build up your understanding gradually.\n`
      break
    case 'intermediate':
      content += `This is an intermediate guide to ${topic}.\n\n`
      content += `Assumes some familiarity with related concepts.\n`
      break
    case 'advanced':
      content += `This is an advanced discussion of ${topic}.\n\n`
      content += `Deep dive into complex scenarios and edge cases.\n`
      break
  }

  if (includeExamples) {
    content += `\n## Examples\n\n`
    content += `Here are some practical examples for ${topic}:\n`
    content += `- Example 1: Basic implementation\n`
    content += `- Example 2: Advanced use case\n`
    content += `- Example 3: Common pitfalls to avoid\n`
  }

  return [
    {
      role: 'user' as const,
      content: {
        type: 'text' as const,
        text: content,
      },
    },
  ]
})
```

## Registering Prompts

Register your prompts in the routes file:

```typescript
// mcp.routes.ts
import { wireMCPPrompt } from '../.pikku/pikku-types.gen.js'
import { staticPromptGenerator, dynamicPromptGenerator } from './mcp.functions.js'

wireMCPPrompt({
  name: 'getStaticResource',
  description: 'A static prompt that returns a predefined message',
  func: staticPromptGenerator,
})

wireMCPPrompt({
  name: 'dynamicPromptGenerator',
  description:
    'Generate educational content with progressive complexity and optional examples',
  func: dynamicPromptGenerator,
  tags: ['education', 'content', 'progressive', 'examples'],
})
```

## Prompt Structure

Prompts return an array of messages with specific roles and content:

```typescript
return [
  {
    role: 'user',        // 'user', 'assistant', or 'system'
    content: {
      type: 'text',      // 'text' or 'image'
      text: 'Your prompt content here',
    },
  },
]
```

## Multi-Message Prompts

Prompts can return multiple messages to create conversation flows:

```typescript
return [
  {
    role: 'system',
    content: {
      type: 'text',
      text: 'You are a helpful assistant specialized in web development.',
    },
  },
  {
    role: 'user',
    content: {
      type: 'text',
      text: `Please explain ${topic} in a ${complexity} way.`,
    },
  },
]
```

## Use Cases

- **Template Generation**: Create consistent conversation starters
- **Context Setting**: Provide system-level instructions
- **Educational Content**: Generate structured learning materials
- **Content Customization**: Adapt content based on user preferences