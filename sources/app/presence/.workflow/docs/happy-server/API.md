# API Documentation

## `presence/timeout.ts`

### `startTimeout()`

```typescript
export function startTimeout(): void
```

This function initializes a background process that periodically checks for and deactivates user sessions and machines that have exceeded their activity timeout. Upon deactivation, it emits ephemeral events to notify relevant users.

## `presence/sessionCache.ts`

### `activityCache`

```typescript
export const activityCache: ActivityCache
```

A globally accessible instance of the `ActivityCache` class, used for managing and validating user session and machine activity.

### `ActivityCache` Class

Manages caching and persistence for session and machine activity, reducing direct database load and batching updates.

#### `isSessionValid(sessionId: string, userId: string): Promise<boolean>`

```typescript
isSessionValid(sessionId: string, userId: string): Promise<boolean>
```

Checks the validity of a user session. It first consults an in-memory cache and falls back to a database lookup if the session is not cached or has expired.

#### `isMachineValid(machineId: string, userId: string): Promise<boolean>`

```typescript
isMachineValid(machineId: string, userId: string): Promise<boolean>
```

Checks the validity of a machine. It first consults an in-memory cache and falls back to a database lookup if the machine is not cached or has expired.

#### `queueSessionUpdate(sessionId: string, timestamp: number): boolean`

```typescript
queueSessionUpdate(sessionId: string, timestamp: number): boolean
```

Queues an update for a session's last active timestamp. The update is only queued if the provided timestamp is significantly different from the last recorded update, to prevent excessive database writes. Returns `true` if the update was queued, `false` otherwise.

#### `queueMachineUpdate(machineId: string, timestamp: number): boolean`

```typescript
queueMachineUpdate(machineId: string, timestamp: number): boolean
```

Queues an update for a machine's last active timestamp. The update is only queued if the provided timestamp is significantly different from the last recorded update, to prevent excessive database writes. Returns `true` if the update was queued, `false` otherwise.

#### `shutdown(): void`

```typescript
shutdown(): void
```

Gracefully shuts down the activity cache, clearing any pending batch updates and stopping the internal batch timer.
