# MCP Prompts

MCP prompts are template generators that help AI models create structured conversations and interactions. They can be static or dynamic with parameters.

## Creating Static Prompts

Use `pikkuMCPPromptFunc` to create static prompts:

```typescript @snippet wa-mcp-prompt-static
```

## Dynamic Prompts with Parameters

Prompts can accept parameters to generate customized content:

```typescript @snippet wa-mcp-prompt-dynamic
```

## Registering Prompts

Register your prompts in the routes file:

```typescript @snippet wa-mcp-prompt-register
```

## Prompt Structure

Prompts return an array of messages with specific roles and content:

A prompt returns an array of messages. Each message has a `role` (`'user'`, `'assistant'` or `'system'`) and a `content` object with a `type` (`'text'` or `'image'`) and the `text` itself.

## Multi-Message Prompts

Prompts can return multiple messages to create conversation flows:

```typescript @snippet wa-mcp-prompt-multi
```

## Use Cases

- **Template Generation**: Create consistent conversation starters
- **Context Setting**: Provide system-level instructions
- **Educational Content**: Generate structured learning materials
- **Content Customization**: Adapt content based on user preferences