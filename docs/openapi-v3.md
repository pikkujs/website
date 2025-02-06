---
title: OpenAPI V3
---

The OpenAPI documentation generation is currently a work in progress, but can be used currently to do most things.

Aspects that are still missing:
  - Permissions / Access
  - Error Codes
  - Types of Queries and Parameters (currently all string)
  - Example inputs / outputs

To generate an `openAPI.yml` spec file, specify it in the `pikku.config.json` and then run `npx @pikku/cli openapi`

```json title="Pikku config for openAPI in pikku.config.json"
{
  "openAPI": {
    // Where to save it
    "outputFile": "openapi.yml",
    // Additonal information to add in
    "additionalInfo": {
      "info": {
        "title": "Todos API",
        "version": "1.0.0",
        "description": "This is a sample server for a todo app."
      },
      "servers": [
        {
          "url": "http://localhost:4002",
          "description": "Development server"
        }
      ]
    }
  }
}
```

Each function can be provided a summary and description that will be used in the API generation:

```
```