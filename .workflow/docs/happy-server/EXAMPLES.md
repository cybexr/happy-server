# Happy Server Usage Examples

This document provides conceptual usage examples demonstrating how clients might interact with the Happy Server's core APIs.

## 1. User Authentication and Profile Management

### 1.1. User Login (Inferred)

**Description**: Authenticate a user with credentials (e.g., username/password or token) and receive a session token.

**Request (POST /api/auth/login)**:
```json
{
  "username": "testuser",
  "password": "securepassword123"
}
```

**Response (200 OK)**:
```json
{
  "sessionToken": "<GENERATED_SESSION_TOKEN>",
  "user": {
    "uid": "user123",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "avatar": { /* ImageRef object */ },
    "connectedServices": ["github"]
  }
}
```

### 1.2. Fetch User Profile (`AccountProfile`)

**Description**: Retrieve the profile information for the authenticated user.

**Request (GET /api/profile)**:
*(Requires `Authorization: Bearer <sessionToken>` header)*

**Response (200 OK)**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "avatar": {
    "id": "img_abc123",
    "url": "https://example.com/avatars/johndoe.jpg",
    "thumbhash": "<THUMBHASH_STRING>",
    "width": 100,
    "height": 100
  },
  "github": {
    "githubId": 12345,
    "username": "johndoe-gh",
    "avatarUrl": "https://github.com/avatars/johndoe.png"
  },
  "settings": {
    "value": "{}",
    "version": 1
  },
  "connectedServices": ["github"]
}
```

### 1.3. Update Username

**Description**: Update the authenticated user's username.

**Request (POST /api/social/usernameUpdate)**:
*(Requires `Authorization: Bearer <sessionToken>` header)*
```json
{
  "newUsername": "newjohndoe"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "oldUsername": "johndoe",
  "newUsername": "newjohndoe"
}
```

## 2. Social Features

### 2.1. Add a Friend (`friendAdd`)

**Description**: Send a friend request to another user.

**Request (POST /api/social/friendAdd)**:
*(Requires `Authorization: Bearer <sessionToken>` header)*
```json
{
  "targetUid": "anotheruser456"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "status": "pending"
}
```

### 2.2. List Friends (`friendList`)

**Description**: Retrieve a list of the authenticated user's friends and pending requests.

**Request (GET /api/social/friendList)**:
*(Requires `Authorization: Bearer <sessionToken>` header)*

**Response (200 OK)**:
```json
{
  "friends": [
    {
      "uid": "friend1",
      "username": "friendone",
      "status": "accepted"
    },
    {
      "uid": "friend2",
      "username": "friendtwo",
      "status": "pending_outbound"
    },
    {
      "uid": "friend3",
      "username": "friendthree",
      "status": "pending_inbound"
    }
  ]
}
```

### 2.3. Get Relationship Status (`relationshipGet`)

**Description**: Get the current relationship status between the authenticated user and another user.

**Request (GET /api/social/relationshipGet?targetUid=someuser)**:
*(Requires `Authorization: Bearer <sessionToken>` header)*

**Response (200 OK)**:
```json
{
  "relationship": "accepted" // or "pending_outbound", "pending_inbound", "none"
}
```

## 3. Key-Value Store (`kv`)

### 3.1. Set/Mutate Key-Value Data (`kvMutate`)

**Description**: Store or update a key-value pair for the authenticated user.

**Request (POST /api/kv/mutate)**:
*(Requires `Authorization: Bearer <sessionToken>` header)*
```json
{
  "key": "user_preferences",
  "value": "{\"theme\": \"dark\", \"notifications\": true}"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "key": "user_preferences",
  "version": 2 // New version of the KV entry
}
```

### 3.2. Get Key-Value Data (`kvGet`)

**Description**: Retrieve a specific key-value pair for the authenticated user.

**Request (GET /api/kv/get?key=user_preferences)**:
*(Requires `Authorization: Bearer <sessionToken>` header)*

**Response (200 OK)**:
```json
{
  "key": "user_preferences",
  "value": "{\"theme\": \"dark\", \"notifications\": true}",
  "version": 2,
  "updatedAt": 1678886400000 // Unix timestamp
}
```

## 4. Artifact Management (Inferred)

### 4.1. Upload an Image (Conceptual)

**Description**: Upload an image to the server, resulting in an `ImageRef`.

**Request (POST /api/upload/image)**:
*(Requires `Authorization: Bearer <sessionToken>` header and `Content-Type: multipart/form-data`)*

**Response (200 OK)**:
```json
{
  "id": "img_def456",
  "url": "https://example.com/uploads/image_def456.jpg",
  "thumbhash": "<GENERATED_THUMBHASH>",
  "width": 800,
  "height": 600
}
```

## 5. WebSocket Communication (Inferred)

**Description**: Establish a WebSocket connection for real-time updates (e.g., presence, notifications).

**Connection**: `wss://your-happy-server.com/socket`
*(Requires `Authorization: Bearer <sessionToken>` as a query parameter or header during handshake)*

**Example Inbound Message (Client to Server)**:
```json
{
  "type": "presence_update",
  "status": "online"
}
```

**Example Outbound Message (Server to Client)**:
```json
{
  "type": "friend_notification",
  "fromUid": "friend456",
  "message": "friend456 sent you a message!"
}
```
