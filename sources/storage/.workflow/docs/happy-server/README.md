# `storage` Module

## Overview

The `storage` module provides functionalities for handling file storage, particularly for user-uploaded images. It integrates with S3 for storing files and a database for managing metadata, including features like image processing and URL resolution.

## Features

- **Image Upload:** Uploads image files to S3, processes them for metadata (width, height, thumbhash), and stores relevant information in the database.
- **Duplicate Detection:** Prevents re-uploading of identical images by checking for existing files based on a reuse key (e.g., image URL).
- **S3 Integration:** Manages file storage and retrieval using an S3-compatible bucket.
- **Image URL Resolution:** Provides a utility to construct full public URLs for stored images.

## Usage

### Uploading an Image

To upload an image, use the `uploadImage` function. This function handles the entire workflow from processing the image to storing it in S3 and updating the database.

```typescript
import { uploadImage } from "./storage/uploadImage";

const userId = "user123";
const directory = "profile_pictures";
const prefix = "avatar";
const imageUrl = "https://example.com/new-avatar.jpg";
const imageBuffer = /* ... your image buffer here ... */;

async function uploadUserAvatar() {
    try {
        const result = await uploadImage(userId, directory, prefix, imageUrl, imageBuffer);
        console.log("Image uploaded successfully:", result);
        // result will contain { path, thumbhash, width, height }
    } catch (error) {
        console.error("Error uploading image:", error);
    }
}

uploadUserAvatar();
```

### Resolving Image URLs

Use the `resolveImageUrl` function to get the full public URL for an image stored via the `storage` module.

```typescript
import { resolveImageUrl } from "./storage/uploadImage";

const imageS3Path = "public/users/user123/profile_pictures/avatar-randomkey.jpg";
const fullUrl = resolveImageUrl(imageS3Path);

console.log("Full image URL:", fullUrl);
// Example output: https://your-s3-host/your-s3-bucket/public/users/user123/profile_pictures/avatar-randomkey.jpg
```
