---
title: Introducing Inspector Vramework
description: Extracting vramework inspection into its own package
---

Happy New Year everyone!

This release is pretty small, and completely backward-compatible.

## @vramework/inspector

The biggest change is that we extracted the code that inspects the codebase into a separate package. The goal of this package is to produce a JSON file from the codebase it inspects, which will make testing much more robust and open up new avenues for integration.

This also lays the foundation for vramework’s upcoming dependency management system. Combined with ES6, it will provide a simple approach for loading/tree-shaking only the services needed for the subset of desired functions. Super excited about this (also the last large feature on the current roadmap!)

## Support for Duplicate Names

Another feature is that the inspector has been redesigned to treat all imports as unique, and only at the end does it attempt to resolve any duplicates.

This approach means we don’t have to worry about duplicate types during development. While this wasn’t high on my radar initially, I encountered name clashes in my current projects—leading to manual renaming across the codebase, which turned out to be more effort than necessary. Now, the inspector’s approach makes it much more convenient to work with similarly named imports.

---

Enjoy the new version and keep an eye out for more updates soon!