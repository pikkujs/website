---
title: Versioning & Contracts
description: Version your functions and detect breaking API changes automatically
ai: true
---

# Versioning & Contracts

Pikku has built-in function versioning. You add `version: N` to a function, and the CLI handles the rest — generating versioned IDs, tracking contract hashes, and catching breaking changes before they hit production.

## Versioning Functions

Add `version` to any function definition:

```typescript
import { pikkuFunc } from '#pikku/function'

// v1 — original implementation
export const createUser = pikkuFunc<CreateUserInput_v1, CreateUserOutput_v1>({
  version: 1,
  func: async (services, data) => {
    // original logic
  }
})

// v2 — new input/output types
export const createUserV2 = pikkuFunc<CreateUserInput_v2, CreateUserOutput_v2>({
  version: 2,
  func: async (services, data) => {
    // updated logic
  }
})
```

The trailing `V2` is stripped because it matches the version, so the second export registers as `createUser@v2` rather than `createUserV2@v2`.

The CLI inspector reads the `version` property and generates versioned function IDs using the `@v` separator — so `createUser` with `version: 2` becomes `createUser@v2` internally.

### How Versions Resolve

- **Base name** (`createUser`) always points to the **latest** version
- **Versioned name** (`createUser@v1`) points to that exact version
- If you have an unversioned function alongside versioned ones, the unversioned one automatically becomes `latest + 1`

So with `createUserV1` pinned as `version: 1` and a plain `createUser` without a version, the plain one becomes `createUser@v2`.

The ID comes from the exported name with a matching `V<n>` suffix removed, so `getBookV1` with `version: 1` becomes `getBook@v1`. Use `override: 'getBook'` when the export cannot follow that convention (for example `legacyGetBook`).

### Calling Versioned Functions

From RPC clients, you just use the name:

```typescript
// Calls the latest version
await rpc.invoke('createUser', { name: 'Alice' })

// Calls a specific version
await rpc.invoke('createUser@v1', { name: 'Alice' })
```

The same applies to exposed RPCs — external clients can target a specific version or let it resolve to the latest.

## Contract Tracking

Pikku tracks the "contract" of each function — its name and input/output schemas — and detects when contracts change between releases. This prevents accidental breaking changes when multiple clients depend on your API.

### How It Works

1. Each function's contract is hashed (function key + input schema + output schema → hex hash)
2. Hashes are stored in a **version manifest** (`versions.pikku.json`)
3. `npx pikku versions check` compares current contracts against the manifest
4. If a contract changed without a version bump, the check fails

### Initialize the Manifest

```bash
npx pikku versions init
```

This creates an empty `versions.pikku.json` (`{ "manifestVersion": 1, "contracts": {} }`). It does not record any hashes — run `npx pikku versions update` straight after, or `check` has nothing to compare against.

### Check for Breaking Changes

```bash
npx pikku versions check
```

Compares current function contracts against the manifest. Fails if:
- A published contract was modified (input/output schema changed)
- A version bump is required but not applied

### Update the Manifest

```bash
npx pikku versions update
```

Records the current contracts into the manifest. Run this after bumping function versions. The `pikku all` command also calls this automatically at the end of every build; it refuses to overwrite a published version's hash, but a contract that changed without a bump is reported as a diagnostic rather than crashing the build — `npx pikku versions check` is the hard gate.

## Version Manifest

The manifest file (`versions.pikku.json`) tracks contract history:

```json
{
  "manifestVersion": 1,
  "contracts": {
    "createUser": {
      "latest": 2,
      "versions": {
        "1": { "inputHash": "a1b2c3d4", "outputHash": "e5f6g7h8" },
        "2": { "inputHash": "i9j0k1l2", "outputHash": "m3n4o5p6" }
      }
    }
  }
}
```

Each function entry contains:
- `latest` — the current version number
- `versions` — a map of version numbers to input/output hash pairs

## Versioning Rules

The contract system enforces strict rules:

| Rule | Description |
|------|-------------|
| **Immutability** | Published version hashes cannot change |
| **Sequential versioning** | New versions must be `latest + 1` |
| **No gaps** | Cannot skip version numbers (e.g., 1 → 3) |
| **Change detection** | Modified contracts require a version bump |
| **Manifest consistency** | The `latest` field must match the highest version key |

## Error Codes

| Code | Name | Description |
|------|------|-------------|
| PKU850 | `DUPLICATE_FUNCTION_VERSION` | Two exports declare the same version of one function |
| PKU851 | `DUPLICATE_FUNCTION_NAME` | Two exports resolve to the same function name |
| PKU860 | `MANIFEST_MISSING` | Version manifest not found — run `versions init` |
| PKU861 | `FUNCTION_VERSION_MODIFIED` | Contract hash changed for an existing version (immutable) |
| PKU862 | `CONTRACT_CHANGED_REQUIRES_BUMP` | Latest contract changed without a version bump |
| PKU863 | `VERSION_REGRESSION_OR_CONFLICT` | New version is ≤ latest but not in the manifest |
| PKU864 | `VERSION_GAP_NOT_ALLOWED` | Version skips a number (e.g., 1 → 3) |
| PKU865 | `MANIFEST_INTEGRITY_ERROR` | `latest` field doesn't match the highest version key |

## CI Integration

Add contract checking to your CI pipeline to catch breaking changes before they're deployed:

```yaml
# GitHub Actions example
- name: Check API contracts
  run: npx pikku versions check
```

If a function's input or output schema changed, the check fails and the developer must explicitly bump the version — making breaking changes intentional rather than accidental.

## Typical Workflow

1. **Develop** — Change function inputs/outputs as needed
2. **Check** — `npx pikku versions check` detects the contract change
3. **Bump** — Add or increment `version` on the function
4. **Update** — `npx pikku versions update` records the new contract
5. **Commit** — Check in the updated `versions.pikku.json`
