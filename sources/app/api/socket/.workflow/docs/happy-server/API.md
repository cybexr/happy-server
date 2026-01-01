# Socket API Documentation

This document describes the Socket.IO event handlers implemented in the `happy-server`'s API socket module. These handlers facilitate real-time communication between clients and the server for various functionalities including access key management, artifact updates, machine state tracking, RPC calls, session management, and usage reporting.

## Handlers Overview

### `accessKeyHandler(userId: string, socket: Socket)`
Handles events related to access key management for a specific user.

#### Events
- **`access-key-get`**
  - **Description:** Retrieves an access key associated with a session and machine for the authenticated user.
  - **Parameters (data):**
    - `sessionId: string`: The ID of the session.
    - `machineId: string`: The ID of the machine.
  - **Callback Response:**
    ```typescript
    interface AccessKeyGetResponse {
        ok: boolean;
        error?: string;
        accessKey?: {
            data: string; // Base64 encoded access key data
            dataVersion: number;
            createdAt: number; // Unix timestamp
            updatedAt: number; // Unix timestamp
        } | null;
    }
    ```

### `artifactUpdateHandler(userId: string, socket: Socket)`
Manages the lifecycle of artifacts, including reading, creating, updating, and deleting.

#### Events
- **`artifact-read`**
  - **Description:** Fetches the full content (header and body) of a specific artifact.
  - **Parameters (data):**
    - `artifactId: string`: The ID of the artifact to read.
  - **Callback Response:**
    ```typescript
    interface ArtifactReadResponse {
        result: 'success' | 'error';
        message?: string;
        artifact?: {
            id: string;
            header: string; // Base64 encoded
            headerVersion: number;
            body: string;   // Base64 encoded
            bodyVersion: number;
            seq: number;
            createdAt: number; // Unix timestamp
            updatedAt: number; // Unix timestamp
        };
    }
    ```
- **`artifact-update`**
  - **Description:** Updates the header and/or body of an artifact using optimistic concurrency control.
  - **Parameters (data):**
    - `artifactId: string`: The ID of the artifact to update.
    - `header?: { data: string; expectedVersion: number; }`: Optional. New header data (Base64 encoded) and its expected version.
    - `body?: { data: string; expectedVersion: number; }`: Optional. New body data (Base64 encoded) and its expected version.
  - **Callback Response:**
    ```typescript
    interface ArtifactUpdateResponse {
        result: 'success' | 'error' | 'version-mismatch';
        message?: string;
        header?: {
            version: number;
            data: string; // Base64 encoded
            currentVersion?: number; // Present on version-mismatch
            currentData?: string;    // Present on version-mismatch (Base64 encoded)
        };
        body?: {
            version: number;
            data: string;   // Base64 encoded
            currentVersion?: number; // Present on version-mismatch
            currentData?: string;    // Present on version-mismatch (Base64 encoded)
        };
    }
    ```
- **`artifact-create`**
  - **Description:** Creates a new artifact. If an artifact with the given ID already exists for the same user, it returns the existing artifact (idempotent).
  - **Parameters (data):**
    - `id: string`: The desired ID for the new artifact.
    - `header: string`: Initial header data (Base64 encoded).
    - `body: string`: Initial body data (Base64 encoded).
    - `dataEncryptionKey: string`: The encryption key for the artifact data (Base64 encoded).
  - **Callback Response:**
    ```typescript
    interface ArtifactCreateResponse {
        result: 'success' | 'error';
        message?: string;
        artifact?: {
            id: string;
            header: string; // Base64 encoded
            headerVersion: number;
            body: string;   // Base64 encoded
            bodyVersion: number;
            seq: number;
            createdAt: number; // Unix timestamp
            updatedAt: number; // Unix timestamp
        };
    }
    ```
- **`artifact-delete`**
  - **Description:** Deletes a specific artifact.
  - **Parameters (data):**
    - `artifactId: string`: The ID of the artifact to delete.
  - **Callback Response:**
    ```typescript
    interface ArtifactDeleteResponse {
        result: 'success' | 'error';
        message?: string;
    }
    ```

### `machineUpdateHandler(userId: string, socket: Socket)`
Handles updates and status reporting for user-associated machines.

#### Events
- **`machine-alive`**
  - **Description:** Receives periodic "keep-alive" signals from a machine, updating its last active time.
  - **Parameters (data):**
    - `machineId: string`: The ID of the machine reporting activity.
    - `time: number`: The current Unix timestamp from the machine.
  - **No direct callback response.** Emits ephemeral updates.
- **`machine-update-metadata`**
  - **Description:** Updates the metadata of a specific machine using optimistic concurrency control.
  - **Parameters (data):**
    - `machineId: string`: The ID of the machine to update.
    - `metadata: string`: The new metadata string.
    - `expectedVersion: number`: The expected current version of the metadata for optimistic locking.
  - **Callback Response:**
    ```typescript
    interface MachineUpdateMetadataResponse {
        result: 'success' | 'error' | 'version-mismatch';
        message?: string;
        version?: number;     // New version on success, current version on mismatch
        metadata?: string;    // New metadata on success, current metadata on mismatch
    }
    ```
- **`machine-update-state`**
  - **Description:** Updates the daemon state of a specific machine using optimistic concurrency control.
  - **Parameters (data):**
    - `machineId: string`: The ID of the machine to update.
    - `daemonState: string`: The new daemon state string.
    - `expectedVersion: number`: The expected current version of the daemon state for optimistic locking.
  - **Callback Response:**
    ```typescript
    interface MachineUpdateStateResponse {
        result: 'success' | 'error' | 'version-mismatch';
        message?: string;
        version?: number;     // New version on success, current version on mismatch
        daemonState?: string; // New daemon state on success, current state on mismatch
    }
    ```

### `pingHandler(socket: Socket)`
Provides a simple ping-pong mechanism to check socket connectivity.

#### Events
- **`ping`**
  - **Description:** Responds to a client's ping request.
  - **Parameters:** None.
  - **Callback Response:** An empty object `{}`.

### `rpcHandler(userId: string, socket: Socket, rpcListeners: Map<string, Socket>)`
Enables Remote Procedure Call (RPC) functionality between different client sockets belonging to the same user.

#### Events
- **`rpc-register`**
  - **Description:** Registers the current socket as a listener for a specific RPC method.
  - **Parameters (data):**
    - `method: string`: The name of the RPC method to register.
  - **Emits:**
    - `rpc-registered`: On success, with `{ method: string }`.
    - `rpc-error`: On failure, with `{ type: 'register', error: string }`.
- **`rpc-unregister`**
  - **Description:** Unregisters the current socket as a listener for a specific RPC method.
  - **Parameters (data):**
    - `method: string`: The name of the RPC method to unregister.
  - **Emits:**
    - `rpc-unregistered`: On success, with `{ method: string }`.
    - `rpc-error`: On failure, with `{ type: 'unregister', error: string }`.
- **`rpc-call`**
  - **Description:** Initiates an RPC call to another registered socket for the same user.
  - **Parameters (data):**
    - `method: string`: The name of the RPC method to call.
    - `params: any`: Parameters to pass to the RPC method.
  - **Callback Response:**
    ```typescript
    interface RpcCallResponse {
        ok: boolean;
        error?: string;
        result?: any; // The result from the RPC method execution
    }
    ```
  - **Internal:** The target socket will receive an `rpc-request` event:
    ```typescript
    interface RpcRequestEvent {
        method: string;
        params: any;
    }
    ```
    The target socket is expected to respond to this event for the `rpc-call` callback to resolve.

### `sessionUpdateHandler(userId: string, socket: Socket, connection: ClientConnection)`
Manages real-time updates and state for user sessions.

#### Events
- **`update-metadata`**
  - **Description:** Updates the metadata of a specific session using optimistic concurrency control.
  - **Parameters (data):**
    - `sid: string`: The ID of the session to update.
    - `metadata: string`: The new metadata string.
    - `expectedVersion: number`: The expected current version of the metadata for optimistic locking.
  - **Callback Response:**
    ```typescript
    interface SessionUpdateMetadataResponse {
        result: 'success' | 'error' | 'version-mismatch';
        version?: number;    // New version on success, current version on mismatch
        metadata?: string;   // New metadata on success, current metadata on mismatch
    }
    ```
- **`update-state`**
  - **Description:** Updates the agent state of a specific session using optimistic concurrency control.
  - **Parameters (data):**
    - `sid: string`: The ID of the session to update.
    - `agentState: string | null`: The new agent state string (or null to clear).
    - `expectedVersion: number`: The expected current version of the agent state for optimistic locking.
  - **Callback Response:**
    ```typescript
    interface SessionUpdateStateResponse {
        result: 'success' | 'error' | 'version-mismatch';
        version?: number;    // New version on success, current version on mismatch
        agentState?: string; // New agent state on success, current state on mismatch
    }
    ```
- **`session-alive`**
  - **Description:** Receives periodic "keep-alive" signals from a session, updating its last active time and thinking status.
  - **Parameters (data):**
    - `sid: string`: The ID of the session reporting activity.
    - `time: number`: The current Unix timestamp from the session.
    - `thinking?: boolean`: Optional. Indicates if the session is currently "thinking" (defaults to false).
  - **No direct callback response.** Emits ephemeral updates.
- **`message`**
  - **Description:** Handles incoming encrypted messages for a session, creating a new message entry in the database and emitting updates to interested clients.
  - **Parameters (data):**
    - `sid: string`: The ID of the session the message belongs to.
    - `message: string`: The encrypted message content.
    - `localId?: string`: Optional. A client-generated local ID for idempotency.
  - **No direct callback response.** Emits updates via `eventRouter`.
- **`session-end`**
  - **Description:** Marks a session as inactive and updates its last active time upon client disconnect or explicit end signal.
  - **Parameters (data):**
    - `sid: string`: The ID of the session ending.
    - `time: number`: The Unix timestamp when the session ended.
  - **No direct callback response.** Emits ephemeral updates.

### `usageHandler(userId: string, socket: Socket)`
Processes and stores usage reports from clients.

#### Events
- **`usage-report`**
  - **Description:** Receives a usage report containing token and cost information for a specific key and optional session.
  - **Parameters (data):**
    - `key: string`: The usage key (e.g., feature name).
    - `sessionId?: string`: Optional. The ID of the session associated with the usage.
    - `tokens: { total: number; [key: string]: number }`: Object containing token usage details (must include `total`).
    - `cost: { total: number; [key: string]: number }`: Object containing cost details (must include `total`).
  - **Callback Response:**
    ```typescript
    interface UsageReportResponse {
        success: boolean;
        error?: string;
        reportId?: string;
        createdAt?: number; // Unix timestamp
        updatedAt?: number; // Unix timestamp
    }
    ```