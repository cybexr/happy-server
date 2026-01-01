# Feed Module API Documentation

This document describes the API for the Feed module, covering both functions and data structures.

## Functions

### `feedGet`

Fetches a user's feed with pagination, returning items in reverse chronological order (newest first). Supports cursor-based pagination.

```typescript
async function feedGet(
    tx: Tx,
    ctx: Context,
    options?: FeedOptions
): Promise<FeedResult>
```

**Parameters:**

*   `tx`: Transaction object for database operations.
*   `ctx`: Context object containing user information (e.g., `ctx.uid`).
*   `options`: Optional `FeedOptions` object for pagination (limit, cursor).

**Returns:**

*   `Promise<FeedResult>`: A promise that resolves to a `FeedResult` object containing feed items and pagination information.

### `feedPost`

Adds a post to a user's feed. If a `repeatKey` is provided and an item with that key already exists, the existing post will be updated in-place (deleted and re-created). Otherwise, a new post is created.

```typescript
async function feedPost(
    tx: Tx,
    ctx: Context,
    body: FeedBody,
    repeatKey?: string | null
): Promise<UserFeedItem>
```

**Parameters:**

*   `tx`: Transaction object for database operations.
*   `ctx`: Context object containing user information (e.g., `ctx.uid`).
*   `body`: The content of the feed item, conforming to the `FeedBody` type.
*   `repeatKey`: Optional string. If provided, used to update an existing item instead of creating a new one.

**Returns:**

*   `Promise<UserFeedItem>`: A promise that resolves to the newly created or updated `UserFeedItem`.

## Data Structures

### `FeedBodySchema` (Zod Schema)

A discriminated union Zod schema defining the possible structures for a feed item's body.

```typescript
export const FeedBodySchema = z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('friend_request'), uid: z.string() }),
    z.object({ kind: z.literal('friend_accepted'), uid: z.string() }),
    z.object({ kind: z.literal('text'), text: z.string() })
]);
```

### `FeedBody`

Inferred type from `FeedBodySchema`, representing the content of a feed item.

```typescript
type FeedBody =
  | { kind: "friend_request"; uid: string }
  | { kind: "friend_accepted"; uid: string }
  | { kind: "text"; text: string };
```

### `UserFeedItem`

Represents a single item in a user's feed.

```typescript
interface UserFeedItem {
    id: string;
    userId: string;
    repeatKey: string | null;
    body: FeedBody;
    createdAt: number;
    cursor: string;
}
```

**Properties:**

*   `id`: Unique identifier for the feed item.
*   `userId`: The ID of the user to whom this feed item belongs.
*   `repeatKey`: A key used to identify and potentially update recurring feed items. Can be `null`.
*   `body`: The content of the feed item, typed as `FeedBody`.
*   `createdAt`: Timestamp (number) indicating when the item was created.
*   `cursor`: A string used for cursor-based pagination.

### `FeedCursor`

Defines the cursor for pagination, allowing fetching items before or after a specific point.

```typescript
interface FeedCursor {
    before?: string;
    after?: string;
}
```

**Properties:**

*   `before`: Optional cursor string to fetch items older than this point.
*   `after`: Optional cursor string to fetch items newer than this point.

### `FeedOptions`

Defines options for fetching a user's feed, including pagination parameters.

```typescript
interface FeedOptions {
    limit?: number;
    cursor?: FeedCursor;
}
```

**Properties:**

*   `limit`: Optional maximum number of feed items to retrieve.
*   `cursor`: Optional `FeedCursor` object for pagination.

### `FeedResult`

The structure of the response when fetching a user's feed.

```typescript
interface FeedResult {
    items: UserFeedItem[];
    hasMore: boolean;
}
```

**Properties:**

*   `items`: An array of `UserFeedItem` objects.
*   `hasMore`: A boolean indicating whether there are more items available beyond the current `limit`.
