# Session API Documentation

## `sessionDelete(ctx: Context, sessionId: string): Promise<boolean>`

Deletes a session and all its related data.

This function handles the comprehensive deletion of a user session, including:
- All messages associated with the session.
- All usage reports linked to the session.
- All access keys granted for the session.
- The session record itself.
- Emits a socket notification to all connected clients informing them of the session's deletion.

**Parameters:**

-   `ctx`: `Context` - An object containing user and request-specific information.
-   `sessionId`: `string` - The unique identifier of the session to be deleted.

**Returns:**

-   `Promise<boolean>` - Returns `true` if the session was successfully deleted. Returns `false` if the session was not found or if the requesting user does not own the session.

**Usage Example:**

```typescript
import { Context } from "@/context";
import { sessionDelete } from "@/app/session/sessionDelete";

// Assuming 'context' and 'sessionIdToDelete' are available
const context: Context = { /* ... populate with user info ... */ };
const sessionIdToDelete: string = "some-session-id-123";

sessionDelete(context, sessionIdToDelete)
    .then(success => {
        if (success) {
            console.log(`Session ${sessionIdToDelete} deleted successfully.`);
        } else {
            console.log(`Failed to delete session ${sessionIdToDelete}. It might not exist or the user might not own it.`);
        }
    })
    .catch(error => {
        console.error(`An error occurred during session deletion: ${error.message}`);
    });
```
