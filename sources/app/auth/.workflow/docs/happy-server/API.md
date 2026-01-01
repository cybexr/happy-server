# Auth Module API Documentation

The `AuthModule` is responsible for generating, verifying, and managing persistent and ephemeral tokens within the application. It utilizes `privacy-kit` for cryptographic operations and maintains an in-memory cache for token verification.

## Classes

### `AuthModule`

Manages the lifecycle of user authentication tokens, including creation, verification, and invalidation.

#### Methods

---

### `init()`

Initializes the authentication module by setting up token generators and verifiers. This method must be called once before any token operations.

```typescript
async init(): Promise<void>
```

**Returns:** `Promise<void>`

---

### `createToken(userId: string, extras?: any)`

Generates a new persistent token for a given user ID with optional extra payload data.

```typescript
async createToken(userId: string, extras?: any): Promise<string>
```

**Parameters:**
- `userId`: `string` - The ID of the user for whom the token is being created.
- `extras`: `any` (Optional) - Additional data to embed within the token payload.

**Returns:** `Promise<string>` - The newly generated persistent token.

---

### `verifyToken(token: string)`

Verifies a persistent token and returns the associated user ID and any extra payload data.
Leverages an in-memory cache for faster verification of frequently used tokens.

```typescript
async verifyToken(token: string): Promise<{ userId: string; extras?: any } | null>
```

**Parameters:**
- `token`: `string` - The persistent token to verify.

**Returns:** `Promise<{ userId: string; extras?: any } | null>` - An object containing `userId` and `extras` if the token is valid, otherwise `null`.

---

### `invalidateUserTokens(userId: string)`

Removes all cached persistent tokens associated with a specific user ID.
Note: This operation can be expensive for large caches.

```typescript
invalidateUserTokens(userId: string): void
```

**Parameters:**
- `userId`: `string` - The ID of the user whose tokens should be invalidated.

**Returns:** `void`

---

### `invalidateToken(token: string)`

Removes a specific persistent token from the cache, effectively invalidating it for future verification attempts.

```typescript
invalidateToken(token: string): void
```

**Parameters:**
- `token`: `string` - The token string to invalidate.

**Returns:** `void`

---

### `getCacheStats()`

Retrieves statistics about the internal token cache.

```typescript
getCacheStats(): { size: number; oldestEntry: number | null }
```

**Returns:** `{ size: number; oldestEntry: number | null }` - An object containing:
- `size`: `number` - The current number of entries in the token cache.
- `oldestEntry`: `number | null` - The timestamp of the oldest cached entry, or `null` if the cache is empty.

---

### `createGithubToken(userId: string)`

Generates a new ephemeral token specifically for GitHub OAuth purposes, with a default TTL of 5 minutes.

```typescript
async createGithubToken(userId: string): Promise<string>
```

**Parameters:**
- `userId`: `string` - The ID of the user for whom the GitHub token is being created.

**Returns:** `Promise<string>` - The newly generated ephemeral GitHub token.

---

### `verifyGithubToken(token: string)`

Verifies an ephemeral GitHub token and returns the associated user ID.

```typescript
async verifyGithubToken(token: string): Promise<{ userId: string } | null>
```

**Parameters:**
- `token`: `string` - The ephemeral GitHub token to verify.

**Returns:** `Promise<{ userId: string } | null>` - An object containing `userId` if the token is valid, otherwise `null`.

---

### `cleanup()`

A placeholder method for future cache cleanup logic. Currently, it logs the cache size but does not perform automatic token expiration or removal as persistent tokens are cached indefinitely.

```typescript
cleanup(): void
```

**Returns:** `void`

---

## Global Instance

### `auth`

The globally exported instance of `AuthModule` for convenient access throughout the application.

```typescript
export const auth: AuthModule;
```
