# Code API Documentation

This document describes the public-facing APIs of the `github` module.

---

## `githubDisconnect` Function

```typescript
export async function githubDisconnect(ctx: Context): Promise<void>
```

**Description:** Disconnects a GitHub account from a user profile.

**Flow:**
1. Check if user has GitHub connected - early exit if not
2. In transaction: clear GitHub link and username from account (keeps avatar) and delete GitHub user record
3. Send socket update after transaction completes

**Parameters:**

*   `ctx`: Request context containing user ID
