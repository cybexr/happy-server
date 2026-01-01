# GitHub Module API Documentation

This document describes the public API of the `github` module.

## Functions

### `initGithub()`

Initializes the GitHub App and webhook handlers. This function should be called during application startup. It relies on several environment variables: `GITHUB_APP_ID`, `GITHUB_PRIVATE_KEY`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_REDIRECT_URI`, and `GITHUB_WEBHOOK_SECRET`.

```typescript
export async function initGithub(): Promise<void>
```

### `getWebhooks()`

Retrieves the initialized Octokit Webhooks instance. This can be used to register additional webhook event handlers or access existing ones.

```typescript
export function getWebhooks(): Webhooks | null
```

### `getApp()`

Retrieves the initialized Octokit App instance. This provides access to the GitHub App's functionalities, such as creating installation access tokens.

```typescript
export function getApp(): App | null
```
