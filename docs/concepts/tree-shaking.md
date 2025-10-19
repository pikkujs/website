---
sidebar_position: 6
---

# Tree-Shaking: One Codebase, Any Architecture

**The Problem**: Traditional frameworks force you to choose your architecture upfront. Monolith? Microservices? Functions? Each requires different patterns, different codebases, different deployment pipelines.

**Pikku's Solution**: Write your code once. Deploy it as a 2.8MB monolith, 180KB microservices, or 50KB serverless functions. No code changes. Just different filters.

**No other framework can do this.**

## Why This Matters

Most frameworks lock you in:

- **Express/Fastify**: Great for monoliths, terrible for serverless (bundle entire framework)
- **Serverless Framework**: Great for functions, forces code duplication across services
- **NestJS**: Heavy runtime that can't be tree-shaken effectively

**Pikku is different**: Architecture becomes a *deployment decision*, not a *coding decision*.

Start as a monolith for simplicity. Split into microservices when you need scale. Optimize to functions for cost. **Same codebase. Zero refactoring.**
