---
title: ContentService
---

The ContentService provides file storage and management capabilities. It supports signed URLs, direct uploads, downloads, and file operations across different storage backends.

:::note
Direct file uploads into Pikku functions (streaming multipart data) are not yet fully supported. The recommended pattern is to generate a signed upload URL client-side and have the client upload directly to storage.
:::

Every method takes a single arguments object. The storage methods include the
`bucket` to operate on; `signURL` is the exception, taking the URL itself.

## Methods

### `getUploadURL(args): Promise<UploadURLResult>`

Generates a signed URL for uploading a file directly to storage.

- **`args`:** `{ bucket, fileKey, contentType, size?, visibility? }`
- **Returns:** `UploadURLResult` — `{ uploadUrl, assetKey, uploadHeaders?, uploadMethod? }`. The client `PUT`s (or `POST`s) the file to `uploadUrl`; `assetKey` is the finalized storage key.

### `signContentKey(args): Promise<string>`

Signs a content key to produce a secure, time-limited access URL.

- **`args`:** `{ bucket, contentKey, dateLessThan, dateGreaterThan? }`
  - `dateLessThan`: Expiration time
  - `dateGreaterThan`: Optional earliest valid time
- **Returns:** Signed URL

### `signURL(args): Promise<string>`

Signs an arbitrary URL to produce a time-limited access URL.

- **`args`:** `{ url, dateLessThan, dateGreaterThan? }`

### `deleteFile(args): Promise<boolean>`

Deletes a file from storage. Returns `true` on success.

- **`args`:** `{ bucket, key }`

### `writeFile(args): Promise<boolean>`

Uploads a readable stream to storage under a given key.

- **`args`:** `{ bucket, key, stream }`

### `copyFile(args): Promise<boolean>`

Copies a file from a local absolute path into storage.

- **`args`:** `{ bucket, key, fromAbsolutePath }`

### `readFile(args): Promise<ReadableStream | NodeJS.ReadableStream>`

Returns a readable stream for a stored file.

- **`args`:** `{ bucket, key }`

### `readFileAsBuffer(args): Promise<Buffer>`

Reads an entire file from storage into a `Buffer`.

- **`args`:** `{ bucket, key }`

## Usage Example

A typical upload function takes a `filename` and `contentType` and returns `{ uploadUrl, downloadUrl, assetKey }`:

1. Call `content.getUploadURL({ bucket, fileKey, contentType })` to get a signed URL the client uploads to directly, along with the `assetKey`.
2. Call `content.signContentKey({ bucket, contentKey: assetKey, dateLessThan })` with an expiry (for example one hour from now) to get a time-limited download URL.
3. Return the three values.

## Implementations

### Local (development)

Reads and writes from the local file system:

Source: [`local-content.ts`](https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/local-content.ts)

### AWS S3

Source: [`s3-content.ts`](https://github.com/pikkujs/pikku/blob/main/packages/services/aws-services/src/s3-content.ts)

### Backblaze B2

```bash npm2yarn
npm install @pikku/backblaze
```

`B2Content` talks to the Backblaze B2 native API. It uses a single underlying B2 bucket — logical buckets passed via the ContentService API are stored as path prefixes within it.

Construct `B2Content` from `@pikku/backblaze` with an object holding `applicationKeyId`, `applicationKey` and `bucketId`, plus your logger. Read the two keys through the secret service and call `reveal()` on each.

Source: [`b2-content.ts`](https://github.com/pikkujs/pikku/blob/main/packages/services/backblaze/src/b2-content.ts)

## Interface

Source: [`content-service.ts`](https://github.com/pikkujs/pikku/blob/main/packages/core/src/services/content-service.ts)
