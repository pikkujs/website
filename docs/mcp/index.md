# MCP (Model Control Protocol)

The Model Control Protocol (MCP) integration allows you to expose your Pikku functions as tools and resources that AI models can interact with directly.

:::info
The MCP integration is still experimental. We support the basics (prompts, tools and resources) but haven't yet exposed or implemented the entire protocol.
:::

## Getting Started

- [Introduction](./introduction.md) - Overview and quick start guide
- [Tools](./tools.md) - Create functions that AI models can call
- [Resources](./resources.md) - Expose data sources for AI models to read
- [Prompts](./prompts.md) - Generate structured conversation templates

## Quick Reference

### Basic Setup

1. **Define Functions**: Create `mcp.functions.ts` with your MCP functions
2. **Register Endpoints**: Create `mcp.routes.ts` to register your functions
3. **Start Server**: Run `npx pikku serve mcp`

### Function Types

- `pikkuMCPToolFunc<T>` - Create tools that perform actions
- `pikkuMCPResourceFunc<T>` - Create resources that provide data
- `pikkuMCPPromptFunc<T>` - Create prompt templates

### Registration Functions

- `addMCPTool()` - Register a tool endpoint
- `addMCPResource()` - Register a resource endpoint  
- `addMCPPrompt()` - Register a prompt endpoint