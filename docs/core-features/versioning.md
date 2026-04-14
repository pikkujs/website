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
// v1 — original implementation
export const createUser = pikkuFunc<CreateUserInput_v1, CreateUserOutput_v1>({
  version: 1,
  func: async (services, data) => {
    // original logic
  }
})

// v2 — new input/output types
export const createUser_v2 = pikkuFunc<CreateUserInput_v2, CreateUserOutput_v2>({
  version: 2,
  func: async (services, data) => {
    // updated logic
  }
})
```

The CLI inspector reads the `version` property and generates versioned function IDs using the `@v` separator — so `createUser` with `version: 2` becomes `createUser@v2` internally.

### How Versions Resolve

- **Base name** (`createUser`) always points to the **latest** version
- **Versioned name** (`createUser@v1`) points to that exact version
- If you have an unversioned function alongside versioned ones, the unversioned one automatically becomes `latest + 1`

So if you have `createUser` with `version: 1` and a plain `createUser` without a version, the unversioned one becomes `createUser@v2`.

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
3. On each build, the CLI compares current contracts against the manifest
4. If a contract changed without a version bump, the build fails

### Initialize the Manifest

```bash
npx pikku versions init
```

This creates `versions.pikku.json` with the current contract hashes for all your functions.

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

Records the current contracts into the manifest. Run this after bumping function versions. The `pikku all` command also calls this automatically at the end of every build.

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
