---
title: Custom MCP Server
image: /img/logos/custom-light.svg
hide_title: true
---

<DocHeaderHero title={frontMatter.title} image={frontMatter.image} />

## Current Status

Custom MCP (Model Context Protocol) server implementations aren't currently documented. While Pikku's architecture supports custom MCP servers, we don't have more than one implementation to demonstrate the pattern.

## Why Not Documented?

- **New Protocol**: MCP is a very new protocol format
- **Limited Ecosystem**: No alternative implementations exist yet
- **Official SDK**: The `@modelcontextprotocol/sdk` is the only available option
- **Single Implementation**: We only have one MCP server to reference

## Current Recommendation

Use the built-in MCP server runtime which provides:

- Full MCP protocol compliance
- Automatic schema generation
- Type-safe endpoint definitions
- Built-in error handling
- Standard stdio transport

See the [MCP Server Runtime](../runtimes/mcp-server.md) documentation for usage details.

## Want Custom MCP Support?

If you have a specific use case for a custom MCP server implementation, please [raise a GitHub issue](https://github.com/pikkujs/pikku/issues) with details about:

- Your custom MCP server implementation
- Specific integration requirements
- Use case and benefits

We'll consider adding support based on community demand and available implementations.