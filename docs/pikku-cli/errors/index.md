# Pikku CLI Error Codes

This directory contains documentation for all Pikku CLI error codes. Each error has a unique code and detailed troubleshooting guide.

## Error Categories

Error codes use random 3-digit numbers to avoid implying a sequential order. Each code links to detailed documentation and troubleshooting steps.

## Validation Errors

Errors related to missing required properties or invalid types in your Pikku configuration.

| Code   | Description                  | Link                 |
| ------ | ---------------------------- | -------------------- |
| PKU111 | Missing Name Property        | [View](./pku111.md)  |
| PKU118 | Non-Literal Wire Name        | [View](./pku118.md) |
| PKU123 | Missing Description Property | [View](./pku123.md)  |
| PKU124 | Invalid Value                | [View](./pku124.md) |
| PKU220 | Missing URI Property         | [View](./pku220.md)  |
| PKU236 | Missing Function Property    | [View](./pku236.md)  |
| PKU247 | Invalid Tags Type            | [View](./pku247.md)  |
| PKU300 | Invalid Handler              | [View](./pku300.md)  |
| PKU370 | Missing Title Property       | [View](./pku370.md)  |
| PKU384 | Missing Queue Name           | [View](./pku384.md)  |
| PKU400 | Missing Channel Name         | [View](./pku400.md)  |
| PKU672 | CLI Client-Side Renderer Has Services | [View](./pku672.md) |
| PKU673 | Scenario Has Services        | [View](./pku673.md) |
| PKU675 | expectEventually Is Scenario-Only | [View](./pku675.md) |

## Configuration Errors

Errors related to Pikku configuration and schema generation.

| Code   | Description             | Link                 |
| ------ | ----------------------- | -------------------- |
| PKU426 | Config Type Not Found   | [View](./pku426.md)  |
| PKU427 | Config Type Undefined   | [View](./pku427.md)  |
| PKU431 | Schema Has No Root      | [View](./pku431.md)  |
| PKU456 | Schema Generation Error | [View](./pku456.md)  |
| PKU488 | Schema Load Error       | [View](./pku488.md)  |
| PKU489 | Inline Schema           | [View](./pku489.md) |
| PKU490 | Schema and Wiring Colocated | [View](./pku490.md) |

## HTTP Route & Auth Errors

Errors related to HTTP route definitions and auth wiring.

| Code   | Description                          | Link        |
| ------ | ------------------------------------ | ----------- |
| PKU571 | Route Param Mismatch                 | [View](./pku571.md) |
| PKU572 | Route Query Mismatch                 | [View](./pku572.md) |
| PKU573 | Auth Disabled Requires Sessionless   | [View](./pku573.md) |
| PKU581 | Duplicate Auth Definition            | [View](./pku581.md) |
| PKU582 | Auth Not Exported                    | [View](./pku582.md) |

## Workflow Errors

Errors related to DSL workflow definitions and orchestration.

| Code   | Description                       | Link                 |
| ------ | --------------------------------- | -------------------- |
| PKU529 | Dynamic Step Name                 | [View](./pku529.md)  |
| PKU600 | Workflow Orchestrator Not Configured | [View](./pku600.md) |
| PKU641 | Invalid DSL Workflow              | [View](./pku641.md)  |

## Function Errors

Errors related to Pikku function definitions and metadata.

| Code   | Description                 | Link                 |
| ------ | --------------------------- | -------------------- |
| PKU559 | Function Metadata Not Found | [View](./pku559.md)  |
| PKU568 | Handler Not Resolved        | [View](./pku568.md)  |

## Middleware & Permission Errors

Errors related to middleware and permission configuration.

| Code   | Description                | Link                 |
| ------ | -------------------------- | -------------------- |
| PKU685 | Middleware Handler Invalid | [View](./pku685.md)  |
| PKU715 | Middleware Tag Invalid     | [View](./pku715.md)  |
| PKU736 | Middleware Empty Array     | [View](./pku736.md)  |
| PKU787 | Middleware Pattern Invalid | [View](./pku787.md)  |
| PKU835 | Permission Handler Invalid | [View](./pku835.md)  |

## Database Schema Errors

Warnings from `pikku db migrate` / `pikku db reset` when generating Kysely types. Fix these by editing `db/annotations.ts` and re-running migrate — never hand-edit the generated `db/schema.d.ts`.

| Code   | Description                    | Link                 |
| ------ | ------------------------------ | -------------------- |
| PKU480 | Column Name / Type Contradiction | [View](./pku480.md) |
| PKU481 | JSON/JSONB Column Untyped      | [View](./pku481.md)  |
| PKU482 | Format on Non-String Column    | [View](./pku482.md)  |

## Versioning & Contract Errors

Errors from `pikku versions` contract checking.

| Code   | Description                        | Link        |
| ------ | ---------------------------------- | ----------- |
| PKU850 | Duplicate Function Version         | [View](./pku850.md) |
| PKU851 | Duplicate Function Name            | [View](./pku851.md) |
| PKU860 | Manifest Missing                   | [View](./pku860.md) |
| PKU861 | Function Version Modified          | [View](./pku861.md) |
| PKU862 | Contract Changed, Requires Bump    | [View](./pku862.md) |
| PKU863 | Version Regression or Conflict     | [View](./pku863.md) |
| PKU864 | Version Gap Not Allowed            | [View](./pku864.md) |
| PKU865 | Manifest Integrity Error           | [View](./pku865.md) |

## Other Diagnostics

| Code   | Description                                   | Link        |
| ------ | --------------------------------------------- | ----------- |
| PKU145 | Missing Model (AI agent)                      | [View](./pku145.md) |
| PKU146 | Invalid Model (AI agent)                      | [View](./pku146.md) |
| PKU410 | Services Not Destructured (lint)              | [View](./pku410.md) |
| PKU411 | Wires Not Destructured (lint)                 | [View](./pku411.md) |
| PKU498 | Dynamic Import in Function Body (lint)         | [View](./pku498.md) |
| PKU717 | Duplicate @pikku/core Version                 | [View](./pku717.md) |
| PKU901 | Workflow Multi-Queue Not Supported            | [View](./pku901.md) |
| PKU910 | PII in Output (data classification)           | [View](./pku910.md) |
| PKU920 | Addon Wiring Not Allowed                      | [View](./pku920.md) |
| PKU921 | Addon Contract Handlers Not Allowed           | [View](./pku921.md) |
| PKU940 | RPC Invocation Type Cast                      | [View](./pku940.md) |

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
  → https://pikku.dev/docs/pikku-cli/errors/pku236
```

This tells you:

- The error code is **PKU236**
- The issue is a missing or invalid `func` property
- The route affected is `/api/users`
- Documentation is available at the provided URL

## Contributing

If you encounter an error that isn't documented or have suggestions for improving these guides, please open an issue on GitHub describing the problem and include the full error message and context.
