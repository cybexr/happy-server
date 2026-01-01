# KV Module

The `kv` module provides a set of functionalities for managing user-specific key-value data within the Happy Server application. It offers atomic and version-controlled operations for retrieving, listing, and mutating key-value pairs.

## Features

*   **Atomic Mutations**: All changes within a single mutation request are treated as an atomic transaction, ensuring data consistency.
*   **Version Control**: Each key-value pair maintains a version, enabling optimistic concurrency control to prevent conflicting updates.
*   **User Scoped Data**: All key-value operations are scoped to a specific user ID (`uid`), ensuring data isolation and security.
*   **Event Notifications**: Successful mutations trigger event notifications, allowing other parts of the system to react to data changes.

## Available Operations

The `kv` module exposes the following core operations:

*   **`kvGet`**: Retrieves a single key-value pair for a given user.
*   **`kvBulkGet`**: Retrieves multiple key-value pairs for a given user in a single request.
*   **`kvList`**: Lists key-value pairs for a given user, optionally with filtering and pagination.
*   **`kvMutate`**: Atomically creates, updates, or deletes multiple key-value pairs for a given user. This function supports optimistic concurrency control using versions.

## Usage

The `kv` module functions are designed to be used within the Happy Server's application logic, typically within authenticated user contexts.

### Example: Mutating a Key-Value Pair

To update or create key-value pairs, you would use the `kvMutate` function. It requires a context object containing the user's `uid` and an array of `KVMutation` objects.

```typescript
import { kvMutate } from './kvMutate';

async function updateUserPreferences(userId: string, preferences: { theme: string, notifications: boolean }) {
    try {
        const result = await kvMutate(
            { uid: userId },
            [
                { key: 'user_theme', value: Buffer.from(preferences.theme).toString('base64'), version: -1 }, // Assuming new key or initial write
                { key: 'user_notifications', value: Buffer.from(String(preferences.notifications)).toString('base64'), version: -1 }
            ]
        );

        if (result.success) {
            console.log('User preferences updated successfully:', result.results);
        } else {
            console.error('Failed to update user preferences:', result.errors);
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
}

// Example usage:
// updateUserPreferences('user123', { theme: 'dark', notifications: true });
```

*(Note: The `version: -1` in the example assumes these are new keys or that the caller doesn't have a prior version. In a real application, you would typically fetch the current version before mutating.)*

### Example: Retrieving a Key-Value Pair

To retrieve a single key-value pair, you would use the `kvGet` function:

```typescript
import { kvGet } from './kvGet';

async function getUserTheme(userId: string) {
    try {
        const result = await kvGet({ uid: userId }, 'user_theme');
        if (result.success && result.value) {
            console.log('User theme:', Buffer.from(result.value, 'base64').toString('utf8'));
        } else {
            console.log('User theme not found or an error occurred.');
        }
    }
    catch (error) {
        console.error('An unexpected error occurred:', error);
    }
}

// Example usage:
// getUserTheme('user123');
```