---
title: OpenAPI
description: Generate OpenAPI specifications from your HTTP routes
---

# OpenAPI

Pikku generates an [OpenAPI 3.1.0](https://spec.openapis.org/oas/v3.1.0) specification from your HTTP route definitions. This gives you auto-generated API documentation, client SDK generation, and compatibility with tools like Swagger UI, Redoc, and Postman.

## Configuration

Add an `openAPI` section to `pikku.config.json`:

```json
{
  "openAPI": {
    "outputFile": "openapi.yml",
    "additionalInfo": {
      "info": {
        "title": "My API",
        "version": "1.0.0",
        "description": "API documentation for my Pikku application."
      },
      "servers": [
        {
          "url": "http://localhost:4002",
          "description": "Development server"
        },
        {
          "url": "https://api.example.com",
          "description": "Production server"
        }
      ],
      "externalDocs": {
        "url": "https://docs.example.com",
        "description": "Full documentation"
      }
    }
  }
}
```

| Property | Description |
|----------|-------------|
| `outputFile` | Output path — `.yml`/`.yaml` for YAML, `.json` for JSON |
| `additionalInfo.info` | OpenAPI info object (title, version, description) |
| `additionalInfo.servers` | Server URLs for the API |
| `additionalInfo.externalDocs` | Link to external documentation |

## Generating the Spec

Run the OpenAPI command:

```bash
npx pikku openapi
```

This reads your HTTP route registrations and produces the spec file at the configured `outputFile` path.

## What Gets Generated

Pikku maps your `wireHTTP` definitions to OpenAPI paths:

```typescript
import { wireHTTP } from '#pikku/http'

wireHTTP({
  method: 'post',
  route: '/users/:userId/todos',
  func: createTodo,
  auth: true,
  tags: ['todos'],
})
```

Becomes:

```yaml
paths:
  /users/{userId}/todos:
    post:
      description: This endpoint handles the POST request for the route /users/:userId/todos.
      tags: [todos]
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreateTodoOutput'
```

### Automatic Mapping

| Pikku Feature | OpenAPI Mapping |
|---------------|-----------------|
| Route parameters (`:id`) | Path parameters (`string`) |
| Wiring `tags` | Operation `tags` (falls back to the first path segment) |
| Wiring `query` (POST only) | Query parameters |
| Function output schema | `200` response body |

### Security Schemes

Pikku includes default security scheme definitions:

```yaml
components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: x-api-key
    BearerAuth:
      type: http
      scheme: bearer
```

These are declared globally on the document (either scheme satisfies them). You can replace them, and the document-level `security` requirement, through `additionalInfo.securitySchemes` and `additionalInfo.security`.

### Schema Conversion

Schemas defined via Standard Schema (Zod, ArkType, etc.) are compiled to JSON Schema and then converted to OpenAPI-compatible schemas using `@openapi-contrib/json-schema-to-openapi-schema`.

## Operation Metadata

Operation `tags` come from the wiring's `tags` (falling back to the first path segment). The function's own `title`, `description` and `tags` are used elsewhere in Pikku but do not change the generated spec.

## Current Limitations

The OpenAPI generation covers the core specification but has some gaps:

- **Permissions** — Permission requirements are not yet reflected in the spec
- **Descriptions** — The typed `wireHTTP` config has no `description` field, so operations fall back to a generated sentence
- **Request bodies** — Function input schemas are not yet emitted, so operations have no `requestBody`
- **Per-route security** — The default security schemes are declared document-wide; a route's `auth` does not add its own requirement
- **Detailed error codes** — Error responses are included but not exhaustive
- **Parameter types** — Path and query parameters default to `string` type
- **Example values** — Input/output examples are not yet generated

These will be addressed in future releases.

## Using the Generated Spec

### Swagger UI

Serve the spec with [Swagger UI](https://swagger.io/tools/swagger-ui/) for interactive API exploration:

```bash
npx swagger-ui-watcher openapi.yml
```

### Client Generation

Generate typed API clients using [openapi-generator](https://openapi-generator.tech/):

```bash
npx openapi-generator-cli generate -i openapi.yml -g typescript-fetch -o ./client
```

### Import into Postman

Import the `openapi.yml` file directly into Postman to create a complete collection of API requests.
