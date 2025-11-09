# Pikku CLI Error Codes

This directory contains documentation for all Pikku CLI error codes. Each error has a unique code and detailed troubleshooting guide.

## Error Categories

Error codes use random 3-digit numbers to avoid implying a sequential order. Each code links to detailed documentation and troubleshooting steps.

## Validation Errors

Errors related to missing required properties or invalid types in your Pikku configuration.

| Code   | Description                  | Link                 |
| ------ | ---------------------------- | -------------------- |
| PKU111 | Missing Name Property        | [View](./pku111.md)  |
| PKU123 | Missing Description Property | [View](./pku123.md)  |
| PKU220 | Missing URI Property         | [View](./pku220.md)  |
| PKU236 | Missing Function Property    | [View](./pku236.md)  |
| PKU247 | Invalid Tags Type            | [View](./pku247.md)  |
| PKU300 | Invalid Handler              | Coming soon          |
| PKU370 | Missing Title Property       | [View](./pku370.md)  |
| PKU384 | Missing Queue Name           | [View](./pku384.md)  |
| PKU400 | Missing Channel Name         | [View](./pku400.md)  |

## Configuration Errors

Errors related to Pikku configuration and schema generation.

| Code   | Description             | Link                 |
| ------ | ----------------------- | -------------------- |
| PKU426 | Config Type Not Found   | [View](./pku426.md)  |
| PKU427 | Config Type Undefined   | Coming soon          |
| PKU431 | Schema Has No Root      | [View](./pku431.md)  |
| PKU456 | Schema Generation Error | [View](./pku456.md)  |
| PKU488 | Schema Load Error       | Coming soon          |

## Function Errors

Errors related to Pikku function definitions and metadata.

| Code   | Description                 | Link                 |
| ------ | --------------------------- | -------------------- |
| PKU559 | Function Metadata Not Found | [View](./pku559.md)  |
| PKU568 | Handler Not Resolved        | Coming soon          |

## Middleware & Permission Errors

Errors related to middleware and permission configuration.

| Code   | Description                | Link                 |
| ------ | -------------------------- | -------------------- |
| PKU685 | Middleware Handler Invalid | [View](./pku685.md)  |
| PKU715 | Middleware Tag Invalid     | Coming soon          |
| PKU736 | Middleware Empty Array     | Coming soon          |
| PKU787 | Middleware Pattern Invalid | Coming soon          |
| PKU835 | Permission Handler Invalid | [View](./pku835.md)  |
| PKU836 | Permission Tag Invalid     | Coming soon          |
| PKU937 | Permission Empty Array     | Coming soon          |
| PKU975 | Permission Pattern Invalid | Coming soon          |

## How to Use This Documentation

When you encounter an error:

1. **Find the error code** - Look for `[PKU###]` in the error message
2. **Open the corresponding guide** - Click the link in the table above
3. **Follow the fix instructions** - Each guide includes:
   - What went wrong
   - How to fix it
   - Common mistakes
   - Related errors

## Example Error Message

```
[PKU236] No valid 'func' property for route '/api/users'.
  → https://pikku.dev/docs/errors/pku236
```

This tells you:

- The error code is **PKU236**
- The issue is a missing or invalid `func` property
- The route affected is `/api/users`
- Documentation is available at the provided URL

## Contributing

If you encounter an error that isn't documented or have suggestions for improving these guides, please open an issue on GitHub describing the problem and include the full error message and context.
