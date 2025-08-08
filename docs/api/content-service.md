---
title: ContentService
---

The ContentService interface provides file storage and management capabilities in Pikku applications. It supports signed URLs, file uploads, downloads, and operations across different storage backends.

## Methods

### `signContentKey(contentKey: string, dateLessThan: Date, dateGreaterThan?: Date): Promise<string>`

Signs a content key to generate a secure, time-limited access URL.

- **Parameters:**
  - `contentKey`: The key representing the content object
  - `dateLessThan`: The expiration time for the signed URL
  - `dateGreaterThan`: Optional start time before which access is denied
- **Returns:** Promise resolving to the signed URL

### `signURL(url: string, dateLessThan: Date, dateGreaterThan?: Date): Promise<string>`

Signs an arbitrary URL to generate a secure, time-limited access URL.

- **Parameters:**
  - `url`: The full URL that needs signing
  - `dateLessThan`: The expiration time for the signed URL
  - `dateGreaterThan`: Optional start time before which access is denied
- **Returns:** Promise resolving to the signed URL

### `getUploadURL(fileKey: string, contentType: string): Promise<{ uploadUrl: string; assetKey: string }>`

Generates a signed URL for uploading a file directly to storage.

- **Parameters:**
  - `fileKey`: The desired key/location of the uploaded file
  - `contentType`: The MIME type of the file
- **Returns:** Promise resolving to an object with upload URL and finalized asset key

### `deleteFile(fileName: string): Promise<boolean>`

Deletes a file from the storage backend.

- **Parameters:**
  - `fileName`: The name or key of the file to delete
- **Returns:** Promise resolving to boolean indicating success

### `writeFile(assetKey: string, stream: ReadStream): Promise<boolean>`

Uploads a file stream to storage under a specified asset key.

- **Parameters:**
  - `assetKey`: The key where the file will be saved
  - `stream`: A readable stream of the file contents
- **Returns:** Promise resolving to boolean indicating success

### `copyFile(assetKey: string, fromAbsolutePath: string): Promise<boolean>`

Copies a file from a local absolute path into storage under a new asset key.

- **Parameters:**
  - `assetKey`: The destination key
  - `fromAbsolutePath`: The local absolute file path
- **Returns:** Promise resolving to boolean indicating success

### `readFile(assetKey: string): Promise<ReadStream>`

Reads a file from storage as a readable stream.

- **Parameters:**
  - `assetKey`: The key of the file to read
- **Returns:** Promise resolving to a readable file stream

## Usage Example

```typescript
// Upload and manage files
const fileHandler: CorePikkuFunction<
  { fileData: string },
  { uploadUrl: string; downloadUrl: string }
> = async (services, data) => {
  // Get signed upload URL
  const { uploadUrl, assetKey } = await services.content.getUploadURL(
    'uploads/document.pdf',
    'application/pdf'
  )
  
  // Generate signed download URL (expires in 1 hour)
  const expirationTime = new Date(Date.now() + 60 * 60 * 1000)
  const downloadUrl = await services.content.signContentKey(
    assetKey,
    expirationTime
  )
  
  return { uploadUrl, downloadUrl }
}
```

## Implementation

Pikku provides a local file system implementation for development:

```typescript reference title="local-content.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/local-content.ts
```

For production, you can use cloud storage implementations like S3:

```typescript reference title="s3-content.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/services/aws-services/src/s3-content.ts
```

## Interface

```typescript reference title="content-service.ts"
https://raw.githubusercontent.com/pikkujs/pikku/blob/main/packages/core/src/services/content-service.ts
```
