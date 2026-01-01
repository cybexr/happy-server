# Presence Module

This module is responsible for managing the online presence and activity of users and machines within the Happy Server application. It includes mechanisms for detecting and handling inactive sessions and machines, as well as a caching layer to optimize activity updates.

## Components

### `timeout.ts`

This file contains the `startTimeout` function, which initiates a continuous background process to monitor and deactivate sessions and machines that have been inactive for a predefined period (currently 10 minutes). When a session or machine is timed out, an ephemeral event is emitted to inform relevant parts of the system.

### `sessionCache.ts`

This file implements the `ActivityCache` class and exports a global instance, `activityCache`. The `ActivityCache` is an in-memory cache designed to reduce the load on the database by caching session and machine validity checks and batching activity timestamp updates. It provides methods to:

*   Check if a session or machine is valid.
*   Queue updates to the `lastActiveAt` timestamp for sessions and machines, with a threshold to prevent frequent database writes.
*   Periodically flush pending updates to the database.
*   Clean up expired cache entries.
*   Gracefully shut down the caching mechanism.

## Usage

To start the session and machine timeout monitoring, simply call the `startTimeout()` function, typically during application initialization:

```typescript
import { startTimeout } from "./presence/timeout";

// ... application setup ...

startTimeout();
```

The `activityCache` instance can be used to validate sessions and machines and queue activity updates before persisting them to the database:

```typescript
import { activityCache } from "./presence/sessionCache";

// Check if a session is valid
const isValid = await activityCache.isSessionValid(sessionId, userId);

// Queue a session activity update
activityCache.queueSessionUpdate(sessionId, Date.now());
```
