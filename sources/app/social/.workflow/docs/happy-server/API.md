# Social Module API Documentation

## `usernameUpdate` Function

**Description:** Updates a user's username after checking for availability and emits an account update event.

**Signature:**
```typescript
export async function usernameUpdate(ctx: Context, username: string): Promise<void>
```

**Parameters:**
*   `ctx`: (`Context`) The context object containing user information (e.g., `ctx.uid`).
*   `username`: (`string`) The new username to be set for the user.

**Returns:**
*   `Promise<void>`: A Promise that resolves once the username is successfully updated and the update event is emitted.

**Errors/Exceptions:**
*   `Error('Username is already taken')`: Thrown if the provided `username` is already in use by another user.