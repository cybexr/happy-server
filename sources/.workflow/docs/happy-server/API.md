# Happy Server - Core API

This document describes the public API interfaces and types exposed by the core `sources` module of the Happy Server application.

## Code API Documentation

### Class: `Context`

Provides a scoped context for operations, typically containing user identification.

#### Static Methods

- `static create(uid: string): Context`
  Creates a new `Context` instance for the given user ID.

#### Properties

- `readonly uid: string`
  The unique identifier of the user associated with this context.

### Type: `AccountProfile`

Represents a user's account profile information.

```typescript
type AccountProfile = {
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    avatar: ImageRef | null;
    github: GitHubProfile | null;
    settings: {
        value: string | null;
        version: number;
    } | null;
    connectedServices: string[];
}
```

### Type: `ArtifactInfo`

Basic information about an artifact.

```typescript
type ArtifactInfo = {
    id: string;
    header: string;
    headerVersion: number;
    dataEncryptionKey: string;
    seq: number;
    createdAt: number;
    updatedAt: number;
}
```

### Type: `Artifact`

A complete artifact, extending `ArtifactInfo` with body content.

```typescript
type Artifact = ArtifactInfo & {
    body: string;
    bodyVersion: number;
}
```

### Constants

- `IOS_UP_TO_DATE: string`
  Minimum iOS client version considered up-to-date (e.g., `">=1.4.1"`).

- `ANDROID_UP_TO_DATE: string`
  Minimum Android client version considered up-to-date (e.g., `">=1.4.1"`).
