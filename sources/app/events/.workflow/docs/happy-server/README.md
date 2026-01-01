# Event Router Module

The `eventRouter` module is a core component of the Happy Server's real-time communication infrastructure. It is responsible for managing WebSocket connections for various client types (sessions, users, machines) and routing events to the appropriate connected clients based on sophisticated filtering logic.

## Overview

This module provides:

-   **Connection Management**: Functions to add and remove client WebSocket connections, categorized by their scope (session, user, machine).
-   **Event Emission**: Methods to emit two primary types of events: `UpdatePayload` (for persistent state changes) and `EphemeralPayload` (for transient, real-time activities).
-   **Recipient Filtering**: Advanced filtering capabilities to ensure that events are only sent to clients genuinely interested in or authorized to receive specific updates.
-   **Event Builders**: A set of utility functions to easily construct various event payloads, ensuring consistency and correctness when creating new events.

## How it Works

The `EventRouter` maintains a map of user IDs to their active connections. When an event needs to be emitted, it is passed to the router along with a `RecipientFilter`. The router then iterates through the connections associated with the `userId` and applies the filter to determine which connections should receive the event.

Events are categorized into:

-   **Update Events**: Represent significant, persistent changes (e.g., new messages, session updates, account changes). These are typically stored and can be replayed or synchronized.
-   **Ephemeral Events**: Represent transient, real-time activities (e.g., typing indicators, machine status, usage statistics). These are not persisted and are relevant only at the moment of emission.

## Usage

### Importing the Event Router

To use the event router, import the `eventRouter` instance and relevant types:

```typescript
import { eventRouter, buildNewSessionUpdate, ClientConnection, UpdatePayload } from '@/app/events/eventRouter';
```

### Adding and Removing Connections

When a new WebSocket connection is established, it should be added to the router. Similarly, when a connection closes, it should be removed.

```typescript
// Example: Adding a session-scoped connection
const newConnection: ClientConnection = {
    connectionType: 'session-scoped',
    socket: /* your socket.io socket object */,
    userId: 'user123',
    sessionId: 'session456',
};
eventRouter.addConnection('user123', newConnection);

// Example: Removing a connection
eventRouter.removeConnection('user123', newConnection);
```

### Emitting Update Events

To notify clients about persistent state changes, use `emitUpdate` along with an appropriate event builder.

```typescript
// Example: Emitting a new session update
const sessionData = { /* ... session object ... */ };
const updateSeq = 1;
const updateId = 'update-id-123';
const newSessionUpdatePayload = buildNewSessionUpdate(sessionData, updateSeq, updateId);

eventRouter.emitUpdate({
    userId: 'user123',
    payload: newSessionUpdatePayload,
    recipientFilter: { type: 'all-interested-in-session', sessionId: 'session456' },
    // skipSenderConnection: senderConnection, // Optional: if you don't want to echo to the sender
});
```

### Emitting Ephemeral Events

For transient real-time information, use `emitEphemeral`.

```typescript
// Example: Emitting a session activity event
const sessionId = 'session456';
const active = true;
const activeAt = Date.now();
const thinking = true;
const sessionActivityPayload = buildSessionActivityEphemeral(sessionId, active, activeAt, thinking);

eventRouter.emitEphemeral({
    userId: 'user123',
    payload: sessionActivityPayload,
    recipientFilter: { type: 'all-user-authenticated-connections' },
});
```

### Recipient Filtering

Choose the `recipientFilter` type that best suits the event's intended audience:

-   `{ type: 'all-interested-in-session'; sessionId: string }`: Sends to all session-scoped connections for the given `sessionId` and all user-scoped connections.
-   `{ type: 'user-scoped-only' }`: Sends only to user-scoped connections.
-   `{ type: 'machine-scoped-only'; machineId: string }`: Sends to all user-scoped connections and the specific machine-scoped connection.
-   `{ type: 'all-user-authenticated-connections' }`: Sends to all session-scoped, user-scoped, and machine-scoped connections for the user (default).
