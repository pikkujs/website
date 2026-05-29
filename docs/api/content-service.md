---
title: ContentService
---

The ContentService provides file storage and management capabilities. It supports signed URLs, direct uploads, downloads, and file operations across different storage backends.

:::note
Direct file uploads into Pikku functions (streaming multipart data) are not yet fully supported. The recommended pattern is to generate a signed upload URL client-side and have the client upload directly to storage.
:::

Every method takes a single arguments object that includes the `bucket` to
operate on.

## Methods

### `getUploadURL(args): Promise<UploadURLResult>`

Generates a signed URL for uploading a file directly to storage.

- **`args`:** `{ bucket, fileKey, contentType, size? }`
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

```typescript
interface RequestUploadInput {
  filename: string
  contentType: string
}

interface RequestUploadOutput {
  uploadUrl: string
  downloadUrl: string
  assetKey: string
}

export const requestUpload = pikkuFunc<RequestUploadInput, RequestUploadOutput>(
  async (services, data) => {
    // Generate a signed URL so the client can upload directly to storage
    const { uploadUrl, assetKey } = await services.content.getUploadURL({
      bucket: 'uploads',
      fileKey: data.filename,
      contentType: data.contentType,
    })

    // Generate a time-limited download URL (expires in 1 hour)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    const downloadUrl = await services.content.signContentKey({
      bucket: 'uploads',
      contentKey: assetKey,
      dateLessThan: expiresAt,
    })

    return { uploadUrl, downloadUrl, assetKey }
  }
)
```

## Implementations

### Local (development)

Reads and writes from the local file system:

```typescript reference title="local-content.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/local-content.ts
```

### AWS S3

```typescript reference title="s3-content.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/services/aws-services/src/s3-content.ts
```

## Interface

```typescript reference title="content-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/content-service.ts
```
