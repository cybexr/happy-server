# Session Management Module

This module provides core functionalities for managing user sessions within the Happy Server application. It includes operations for creating, retrieving, and deleting user sessions, along with their associated data.

## Features

-   **Session Deletion**: Securely deletes a session and all related data (messages, usage reports, access keys).
-   **Event Integration**: Integrates with the event router to notify connected clients about session changes.

## Key Functionalities

### `sessionDelete`

The `sessionDelete` function is responsible for the complete removal of a specified user session. It ensures data integrity by deleting all linked records (messages, usage reports, and access keys) before removing the session itself. It also broadcasts a real-time update to relevant clients.

For detailed API documentation, including parameters, return types, and usage examples, please refer to [API.md](API.md).
