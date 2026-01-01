# Happy Server Socket API Module

This module provides the core Socket.IO event handlers for the `happy-server` application, enabling real-time, bidirectional communication between connected clients and the server. It handles a variety of functionalities, including user session management, machine status updates, artifact lifecycle operations, remote procedure calls (RPC), access key distribution, and usage reporting.

## Purpose

The primary purpose of this module is to establish and manage a robust real-time communication layer. It allows clients (such as web interfaces, desktop applications, or background daemons) to:

- **Interact with Sessions:** Update session metadata and state, send messages, and report activity.
- **Manage Machines:** Report machine presence and update machine-specific metadata and daemon states.
- **Handle Artifacts:** Perform CRUD (Create, Read, Update, Delete) operations on encrypted artifacts with optimistic concurrency control.
- **Facilitate RPC:** Enable inter-client communication via a simple RPC mechanism, allowing one client to invoke methods on another client connected to the same user account.
- **Control Access:** Securely retrieve access keys for machine-session pairings.
- **Report Usage:** Submit detailed usage metrics for various operations and resources.

## Architecture

The module is structured around individual handler functions, each responsible for a specific domain of Socket.IO events. These handlers encapsulate the business logic for processing incoming messages, interacting with the database (`@/storage/db`), dispatching internal events (`@/app/events/eventRouter`), and managing concurrency (`@/utils/lock`).

Each handler function typically takes `userId`, the `socket` instance, and sometimes additional context (like `ClientConnection` or `rpcListeners` map) as parameters. Events are registered using `socket.on('event-name', async (data, callback) => { ... })`.

## Getting Started

This module is an internal component of the `happy-server` and is not intended for direct consumption as a standalone library. It integrates with the server's main Socket.IO setup to provide real-time capabilities to authenticated users.

Developers working on client applications that interact with the `happy-server` real-time API should refer to the `API.md` for a detailed breakdown of available Socket.IO events, their parameters, and expected responses.

## Key Features

- **Real-time Session Management:** Keep-alive signals, metadata/state updates, and message passing for active user sessions.
- **Machine Presence & State:** Tracking and updating the status of connected machines.
- **Optimistic Concurrency Control:** Ensures data integrity for concurrent updates to artifacts, sessions, and machines using versioning.
- **Inter-Client RPC:** A mechanism for clients under the same user to communicate directly.
- **Secure Access Key Distribution:** On-demand retrieval of access keys.
- **Comprehensive Usage Reporting:** Capturing and storing detailed usage metrics.
- **Robust Error Handling & Logging:** Consistent error reporting via callbacks and server-side logging (`@/utils/log`).

## Related Files

- `accessKeyHandler.ts`: Handles operations related to access keys.
- `artifactUpdateHandler.ts`: Manages artifact CRUD and updates.
- `machineUpdateHandler.ts`: Deals with machine activity and state synchronization.
- `pingHandler.ts`: Provides basic connectivity testing.
- `rpcHandler.ts`: Implements the inter-client RPC mechanism.
- `sessionUpdateHandler.ts`: Manages user session metadata, state, and messages.
- `usageHandler.ts`: Processes and persists usage reports.

For detailed API specifications, including event parameters and responses, please refer to the [API Documentation](API.md).