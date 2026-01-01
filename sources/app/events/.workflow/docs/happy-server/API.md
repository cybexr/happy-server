# Event Router API Documentation

This document provides a comprehensive overview of the `EventRouter` module, detailing its types, classes, and functions for managing client connections and emitting real-time updates within the Happy Server application.

## Table of Contents
- [Connection Types](#connection-types)
- [Recipient Filter Types](#recipient-filter-types)
- [Update Event Types (Persistent)](#update-event-types-persistent)
- [Ephemeral Event Types (Transient)](#ephemeral-event-types-transient)
- [Event Payload Types](#event-payload-types)
- [EventRouter Class](#eventrouter-class)
  - [Methods](#methods)
- [Event Builder Functions](#event-builder-functions)

---

## Connection Types

These interfaces define the structure of different types of client connections managed by the `EventRouter`.

### SessionScopedConnection
Represents a connection tied to a specific user session.
```typescript
export interface SessionScopedConnection {
    connectionType: 'session-scoped';
    socket: Socket;
    userId: string;
    sessionId: string;
}
```

### UserScopedConnection
Represents a connection tied to a specific user, independent of a session.
```typescript
export interface UserScopedConnection {
    connectionType: 'user-scoped';
    socket: Socket;
    userId: string;
}
```

### MachineScopedConnection
Represents a connection tied to a specific user's machine.
```typescript
export interface MachineScopedConnection {
    connectionType: 'machine-scoped';
    socket: Socket;
    userId: string;
    machineId: string;
}
```

### ClientConnection
A union type representing any of the possible client connection types.
```typescript
export type ClientConnection = SessionScopedConnection | UserScopedConnection | MachineScopedConnection;
```

---

## Recipient Filter Types

These types define how events are filtered to be sent to specific subsets of connected clients.

### RecipientFilter
A union type describing the various criteria for filtering event recipients.
```typescript
export type RecipientFilter =
    | { type: 'all-interested-in-session'; sessionId: string }
    | { type: 'user-scoped-only' }
    | { type: 'machine-scoped-only'; machineId: string }
    | { type: 'all-user-authenticated-connections' };
```

---

## Update Event Types (Persistent)

These types represent events that describe persistent changes in the system, such as new messages, session updates, or account changes.

### UpdateEvent
A union type encompassing all persistent update event types.
```typescript
export type UpdateEvent = {
    type: 'new-message';
    sessionId: string;
    message: {
        id: string;
        seq: number;
        content: any;
        localId: string | null;
        createdAt: number;
        updatedAt: number;
    }
} | {
    type: 'new-session';
    sessionId: string;
    seq: number;
    metadata: string;
    metadataVersion: number;
    agentState: string | null;
    agentStateVersion: number;
    dataEncryptionKey: string | null;
    active: boolean;
    activeAt: number;
    createdAt: number;
    updatedAt: number;
} | {
    type: 'update-session';
    sessionId: string;
    metadata?: {
        value: string | null;
        version: number;
    } | null | undefined;
    agentState?: {
        value: string | null;
        version: number;
    } | null | undefined;
} | {
    type: 'update-account';
    userId: string;
    settings?: {
        value: string | null;
        version: number;
    } | null | undefined;
    github?: GitHubProfile | null | undefined;
} | {
    type: 'new-machine';
    machineId: string;
    seq: number;
    metadata: string;
    metadataVersion: number;
    daemonState: string | null;
    daemonStateVersion: number;
    dataEncryptionKey: string | null;
    active: boolean;
    activeAt: number;
    createdAt: number;
    updatedAt: number;
} | {
    type: 'update-machine';
    machineId: string;
    metadata?: {
        value: string;
        version: number;
    };
    daemonState?: {
        value: string;
        version: number;
    };
    activeAt?: number;
} | {
    type: 'new-artifact';
    artifactId: string;
    seq: number;
    header: string;
    headerVersion: number;
    body: string;
    bodyVersion: number;
    dataEncryptionKey: string | null;
    createdAt: number;
    updatedAt: number;
} | {
    type: 'update-artifact';
    artifactId: string;
    header?: {
        value: string;
        version: number;
    };
    body?: {
        value: string;
        version: number;
    };
} | {
    type: 'delete-artifact';
    artifactId: string;
} | {
    type: 'delete-session';
    sessionId: string;
} | {
    type: 'relationship-updated';
    uid: string;
    status: 'none' | 'requested' | 'pending' | 'friend' | 'rejected';
    timestamp: number;
} | {
    type: 'new-feed-post';
    id: string;
    body: any;
    cursor: string;
    createdAt: number;
} | {
    type: 'kv-batch-update';
    changes: Array<{
        key: string;
        value: string | null;
        version: number;
    }>;
};
```

---

## Ephemeral Event Types (Transient)

These types represent transient, non-persistent events, such as activity indicators or usage metrics.

### EphemeralEvent
A union type encompassing all ephemeral event types.
```typescript
export type EphemeralEvent = {
    type: 'activity';
    id: string;
    active: boolean;
    activeAt: number;
    thinking?: boolean;
} | {
    type: 'machine-activity';
    id: string;
    active: boolean;
    activeAt: number;
} | {
    type: 'usage';
    id: string;
    key: string;
    tokens: Record<string, number>;
    cost: Record<string, number>;
    timestamp: number;
} | {
    type: 'machine-status';
    machineId: string;
    online: boolean;
    timestamp: number;
};
```

---

## Event Payload Types

These interfaces define the structure of the data payloads for update and ephemeral events.

### UpdatePayload
Interface for the payload of persistent update events.
```typescript
export interface UpdatePayload {
    id: string;
    seq: number;
    body: {
        t: UpdateEvent['type'];
        [key: string]: any;
    };
    createdAt: number;
}
```

### EphemeralPayload
Interface for the payload of transient ephemeral events.
```typescript
export interface EphemeralPayload {
    type: EphemeralEvent['type'];
    [key: string]: any;
}
```

---

## EventRouter Class

The `EventRouter` class manages client connections and routes events to appropriate recipients based on defined filters.

```typescript
class EventRouter {
    private userConnections: Map<string, Set<ClientConnection>>;

    // ... (private members not documented)
}
```

### Methods

#### `addConnection(userId: string, connection: ClientConnection): void`
Adds a new client connection for a specified user.

##### Parameters:
- `userId`: The ID of the user.
- `connection`: The `ClientConnection` object to add.

#### `removeConnection(userId: string, connection: ClientConnection): void`
Removes an existing client connection for a specified user.

##### Parameters:
- `userId`: The ID of the user.
- `connection`: The `ClientConnection` object to remove.

#### `getConnections(userId: string): Set<ClientConnection> | undefined`
Retrieves all active connections for a given user.

##### Parameters:
- `userId`: The ID of the user.

##### Returns:
A `Set` of `ClientConnection` objects, or `undefined` if no connections are found for the user.

#### `emitUpdate(params: { userId: string; payload: UpdatePayload; recipientFilter?: RecipientFilter; skipSenderConnection?: ClientConnection; }): void`
Emits a persistent `UpdatePayload` event to relevant clients.

##### Parameters:
- `params`: An object containing:
    - `userId`: The ID of the user associated with the event.
    - `payload`: The `UpdatePayload` to emit.
    - `recipientFilter`: (Optional) A `RecipientFilter` to narrow down the recipients. Defaults to `'all-user-authenticated-connections'`.
    - `skipSenderConnection`: (Optional) A `ClientConnection` to skip sending the event to (e.g., to prevent echoing to the sender).

#### `emitEphemeral(params: { userId: string; payload: EphemeralPayload; recipientFilter?: RecipientFilter; skipSenderConnection?: ClientConnection; }): void`
Emits a transient `EphemeralPayload` event to relevant clients.

##### Parameters:
- `params`: An object containing:
    - `userId`: The ID of the user associated with the event.
    - `payload`: The `EphemeralPayload` to emit.
    - `recipientFilter`: (Optional) A `RecipientFilter` to narrow down the recipients. Defaults to `'all-user-authenticated-connections'`.
    - `skipSenderConnection`: (Optional) A `ClientConnection` to skip sending the event to.

### `eventRouter`
The singleton instance of the `EventRouter` class.
```typescript
export const eventRouter: EventRouter;
```

---

## Event Builder Functions

These functions are utilities to construct `UpdatePayload` and `EphemeralPayload` objects for various event types.

#### `buildNewSessionUpdate(session: { id: string; seq: number; metadata: string; metadataVersion: number; agentState: string | null; agentStateVersion: number; dataEncryptionKey: Uint8Array | null; active: boolean; lastActiveAt: Date; createdAt: Date; updatedAt: Date; }, updateSeq: number, updateId: string): UpdatePayload`
Constructs an `UpdatePayload` for a new session event.

#### `buildNewMessageUpdate(message: { id: string; seq: number; content: any; localId: string | null; createdAt: Date; updatedAt: Date; }, sessionId: string, updateSeq: number, updateId: string): UpdatePayload`
Constructs an `UpdatePayload` for a new message event.

#### `buildUpdateSessionUpdate(sessionId: string, updateSeq: number, updateId: string, metadata?: { value: string; version: number }, agentState?: { value: string; version: number }): UpdatePayload`
Constructs an `UpdatePayload` for an update session event.

#### `buildDeleteSessionUpdate(sessionId: string, updateSeq: number, updateId: string): UpdatePayload`
Constructs an `UpdatePayload` for a delete session event.

#### `buildUpdateAccountUpdate(userId: string, profile: Partial<AccountProfile>, updateSeq: number, updateId: string): UpdatePayload`
Constructs an `UpdatePayload` for an update account event.

#### `buildNewMachineUpdate(machine: { id: string; seq: number; metadata: string; metadataVersion: number; daemonState: string | null; daemonStateVersion: number; dataEncryptionKey: Uint8Array | null; active: boolean; lastActiveAt: Date; createdAt: Date; updatedAt: Date; }, updateSeq: number, updateId: string): UpdatePayload`
Constructs an `UpdatePayload` for a new machine event.

#### `buildUpdateMachineUpdate(machineId: string, updateSeq: number, updateId: string, metadata?: { value: string; version: number }, daemonState?: { value: string; version: number }): UpdatePayload`
Constructs an `UpdatePayload` for an update machine event.

#### `buildSessionActivityEphemeral(sessionId: string, active: boolean, activeAt: number, thinking?: boolean): EphemeralPayload`
Constructs an `EphemeralPayload` for a session activity event.

#### `buildMachineActivityEphemeral(machineId: string, active: boolean, activeAt: number): EphemeralPayload`
Constructs an `EphemeralPayload` for a machine activity event.

#### `buildUsageEphemeral(sessionId: string, key: string, tokens: Record<string, number>, cost: Record<string, number>): EphemeralPayload`
Constructs an `EphemeralPayload` for a usage event.

#### `buildMachineStatusEphemeral(machineId: string, online: boolean): EphemeralPayload`
Constructs an `EphemeralPayload` for a machine status event.

#### `buildNewArtifactUpdate(artifact: { id: string; seq: number; header: Uint8Array; headerVersion: number; body: Uint8Array; bodyVersion: number; dataEncryptionKey: Uint8Array; createdAt: Date; updatedAt: Date; }, updateSeq: number, updateId: string): UpdatePayload`
Constructs an `UpdatePayload` for a new artifact event.

#### `buildUpdateArtifactUpdate(artifactId: string, updateSeq: number, updateId: string, header?: { value: string; version: number }, body?: { value: string; version: number }): UpdatePayload`
Constructs an `UpdatePayload` for an update artifact event.

#### `buildDeleteArtifactUpdate(artifactId: string, updateSeq: number, updateId: string): UpdatePayload`
Constructs an `UpdatePayload` for a delete artifact event.

#### `buildRelationshipUpdatedEvent(data: { uid: string; status: 'none' | 'requested' | 'pending' | 'friend' | 'rejected'; timestamp: number; }, updateSeq: number, updateId: string): UpdatePayload`
Constructs an `UpdatePayload` for a relationship updated event.

#### `buildNewFeedPostUpdate(feedItem: { id: string; body: any; cursor: string; createdAt: number; }, updateSeq: number, updateId: string): UpdatePayload`
Constructs an `UpdatePayload` for a new feed post event.

#### `buildKVBatchUpdateUpdate(changes: Array<{ key: string; value: string | null; version: number }>, updateSeq: number, updateId: string): UpdatePayload`
Constructs an `UpdatePayload` for a KV batch update event.
