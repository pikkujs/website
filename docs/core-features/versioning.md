---
title: Versioning & Contracts
description: Detect breaking API changes with contract hashing
ai: true
---

# Versioning & Contracts

Pikku tracks the "contract" of each function — its name and input/output schemas — and detects when contracts change between releases. This prevents accidental breaking changes when multiple clients depend on your API.

## How It Works

1. Each function's contract is hashed (function key + input schema + output schema → 16-char hex hash)
2. Hashes are stored in a **version manifest** (`versions.json`)
3. On each build, the CLI compares current contracts against the manifest
4. If a contract changed without a version bump, the build fails

## Quick Start

### Initialize the manifest

```bash
npx pikku versions-init
```

This creates `versions.json` with the current contract hashes for all your functions.

### Check for breaking changes

```bash
npx pikku versions-check
```

Compares current function contracts against the manifest. Fails if:
- A published contract was modified (input/output schema changed)
- A version bump is required but not applied

### Update the manifest

```bash
npx pikku versions-update
```

Records the current contracts into the manifest. Run this after bumping function versions.

## Version Manifest

The manifest file (`versions.json`) tracks contract history:

```json
{
  "manifestVersion": 1,
  "contracts": {
    "createTodo": {
      "latest": 1,
      "versions": {
        "1": "a1b2c3d4e5f6g7h8"
      }
    },
    "getTodos": {
      "latest": 2,
      "versions": {
        "1": "i9j0k1l2m3n4o5p6",
        "2": "q7r8s9t0u1v2w3x4"
      }
    }
  }
}
```

Each function entry contains:
- `latest` — The current version number
- `versions` — A map of version numbers to contract hashes

## Versioning Rules

The contract system enforces strict rules:

| Rule | Description |
|------|-------------|
| **Immutability** | Published version hashes cannot change |
| **Sequential versioning** | New versions must be `latest + 1` |
| **No gaps** | Cannot skip version numbers (e.g., 1 → 3) |
| **Change detection** | Modified contracts require a version bump |
| **Manifest consistency** | The `latest` field must match the highest version key |

## Contract Hashes

A contract hash is computed from:
- The function key (name)
- The input JSON schema
- The output JSON schema

If any of these change, the hash changes, indicating a potentially breaking modification.

## Error Codes

| Code | Name | Description |
|------|------|-------------|
| PKU860 | `MANIFEST_MISSING` | Version manifest not found — run `versions-init` |
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
  run: npx pikku versions-check
```

If a function's input or output schema changed, the check fails and the developer must explicitly bump the version number — making breaking changes intentional rather than accidental.

## Workflow

1. **Develop** — Change function inputs/outputs as needed
2. **Check** — `npx pikku versions-check` detects the contract change
3. **Bump** — Increment the function's version number
4. **Update** — `npx pikku versions-update` records the new contract
5. **Commit** — Check in the updated `versions.json`
