# `storage` Module API Documentation

This document describes the public-facing APIs provided by the `storage` module.

## Code API

### `uploadImage` Function

```typescript
export async function uploadImage(userId: string, directory: string, prefix: string, url: string, src: Buffer): Promise<{ path: string; thumbhash: string; width: number; height: number; }>
```

**Description:** Uploads an image, processes it, and stores its metadata. It first checks if an image with the given URL already exists to avoid duplication. If it does, it returns the existing image's details. Otherwise, it processes the new image, generates a unique key, uploads it to S3, and records its metadata in the database.

**Parameters:**
- `userId`: The ID of the user uploading the image.
- `directory`: The directory within the user's S3 path where the image will be stored.
- `prefix`: A prefix for the randomly generated S3 key.
- `url`: The source URL of the image, used as a reuse key to check for existing images.
- `src`: The image data as a Buffer.

**Returns:**
A Promise that resolves to an object containing:
- `path`: The S3 path of the uploaded image.
- `thumbhash`: The thumbhash of the processed image.
- `width`: The width of the processed image.
- `height`: The height of the processed image.

### `resolveImageUrl` Function

```typescript
export function resolveImageUrl(path: string): string
```

**Description:** Constructs a full, publicly accessible URL for an image given its S3 path.

**Parameters:**
- `path`: The S3 path of the image.

**Returns:**
A string representing the full URL to the image.