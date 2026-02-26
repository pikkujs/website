---
title: ContentService
---

The ContentService provides file storage and management capabilities. It supports signed URLs, direct uploads, downloads, and file operations across different storage backends.

:::note
Direct file uploads into Pikku functions (streaming multipart data) are not yet fully supported. The recommended pattern is to generate a signed upload URL client-side and have the client upload directly to storage.
:::

## Methods

### `getUploadURL(fileKey: string, contentType: string): Promise<{ uploadUrl: string; assetKey: string }>`

Generates a signed URL for uploading a file directly to storage.

- **Parameters:**
  - `fileKey`: The desired key/path of the uploaded file
  - `contentType`: The MIME type of the file
- **Returns:** An upload URL for the client to `PUT` to, and the finalized asset key

### `signContentKey(contentKey: string, dateLessThan: Date, dateGreaterThan?: Date): Promise<string>`

Signs a content key to produce a secure, time-limited access URL.

- **Parameters:**
  - `contentKey`: The key representing the stored object
  - `dateLessThan`: Expiration time
  - `dateGreaterThan`: Optional earliest valid time
- **Returns:** Signed URL

### `signURL(url: string, dateLessThan: Date, dateGreaterThan?: Date): Promise<string>`

Signs an arbitrary URL to produce a time-limited access URL.

### `deleteFile(fileName: string): Promise<boolean>`

Deletes a file from storage. Returns `true` on success.

### `writeFile(assetKey: string, stream: ReadStream): Promise<boolean>`

Uploads a readable stream to storage under a given key.

### `copyFile(assetKey: string, fromAbsolutePath: string): Promise<boolean>`

Copies a file from a local path into storage.

### `readFile(assetKey: string): Promise<ReadStream>`

Returns a readable stream for a stored file.

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
    const { uploadUrl, assetKey } = await services.content.getUploadURL(
      `uploads/${data.filename}`,
      data.contentType
    )

    // Generate a time-limited download URL (expires in 1 hour)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    const downloadUrl = await services.content.signContentKey(assetKey, expiresAt)

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
