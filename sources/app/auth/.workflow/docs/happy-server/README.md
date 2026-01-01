# Auth Module

The `auth` module provides robust authentication token management for the application. It handles the creation, verification, and invalidation of both persistent user tokens and ephemeral GitHub-specific tokens. The module leverages `privacy-kit` for secure token generation and verification, incorporating an in-memory cache to optimize performance for frequently accessed tokens.

## Features

-   **Persistent Token Management:** Create and verify long-lived authentication tokens for application users.
-   **Ephemeral GitHub Tokens:** Generate and validate short-lived tokens specifically for GitHub OAuth flows.
-   **In-Memory Caching:** Caches verified tokens to reduce the overhead of repeated cryptographic verification.
-   **Token Invalidation:** Provides mechanisms to invalidate individual tokens or all tokens associated with a specific user.
-   **Cache Statistics:** Offers insights into the current state and performance of the token cache.

## Installation

This module is part of the Happy Server project and is imported directly within the application.

## Usage

### Initialization

Before using any token-related functionality, the `auth` module must be initialized. This typically happens once during application startup.

```typescript
import { auth } from '@/app/auth/auth';

async function bootstrap() {
    // Ensure environment variables HANDY_MASTER_SECRET are set
    await auth.init();
    console.log('Auth module initialized successfully.');
}

bootstrap();
```

### Creating and Verifying Persistent Tokens

```typescript
import { auth } from '@/app/auth/auth';

async function demonstratePersistentTokens() {
    // Assuming auth.init() has been called

    const userId = 'user-123';
    const extras = { role: 'admin', organizationId: 'org-abc' };

    // Create a token
    const token = await auth.createToken(userId, extras);
    console.log('Generated Persistent Token:', token);

    // Verify the token
    const verifiedPayload = await auth.verifyToken(token);
    if (verifiedPayload) {
        console.log('Verified Persistent Token for User:', verifiedPayload.userId);
        console.log('Extras:', verifiedPayload.extras);
    } else {
        console.log('Persistent Token verification failed.');
    }
}

demonstratePersistentTokens();
```

### Creating and Verifying GitHub Tokens

```typescript
import { auth } from '@/app/auth/auth';

async function demonstrateGithubTokens() {
    // Assuming auth.init() has been called

    const userId = 'github-user-456';

    // Create a GitHub ephemeral token
    const githubToken = await auth.createGithubToken(userId);
    console.log('Generated GitHub Token:', githubToken);

    // Verify the GitHub token
    const verifiedGithubPayload = await auth.verifyGithubToken(githubToken);
    if (verifiedGithubPayload) {
        console.log('Verified GitHub Token for User:', verifiedGithubPayload.userId);
    } else {
        console.log('GitHub Token verification failed.');
    }
}

demonstrateGithubTokens();
```

### Token Invalidation

```typescript
import { auth } from '@/app/auth/auth';

async function demonstrateInvalidation() {
    // Assuming auth.init() has been called and tokens exist

    const userIdToInvalidate = 'user-123';
    const tokenToInvalidate = 'some-specific-token-string'; // Replace with an actual token

    // Invalidate all tokens for a user
    auth.invalidateUserTokens(userIdToInvalidate);
    console.log(`All tokens for user ${userIdToInvalidate} invalidated.`);

    // Invalidate a specific token
    auth.invalidateToken(tokenToInvalidate);
    console.log(`Specific token ${tokenToInvalidate} invalidated.`);
}

demonstrateInvalidation();
```

### Cache Statistics

```typescript
import { auth } from '@/app/auth/auth';

function showCacheStats() {
    const stats = auth.getCacheStats();
    console.log(`Token Cache Size: ${stats.size} entries`);
    if (stats.oldestEntry) {
        console.log(`Oldest Cache Entry Age: ${new Date(stats.oldestEntry).toLocaleString()}`);
    }
}

showCacheStats();
```
