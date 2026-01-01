# Happy Server API Documentation

This document provides a comprehensive overview of all public-facing HTTP API endpoints exposed by the Happy Server.

## Authentication

Most endpoints require authentication. Clients must provide a valid authentication token in the request. Endpoints requiring authentication are explicitly marked.

---

## Access Keys API (`accessKeysRoutes.ts`)

### Get Access Key
**GET /v1/access-keys/:sessionId/:machineId**
*   **Authentication**: Required
*   **Description**: Retrieves an access key associated with a specific session and machine for the authenticated user.
*   **Parameters**:
    *   `sessionId` (string, Path): The ID of the session.
    *   `machineId` (string, Path): The ID of the machine.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "accessKey": {
                "data": "string",
                "dataVersion": "number",
                "createdAt": "number",
                "updatedAt": "number"
            } | null
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "Session or machine not found"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to get access key"
        }
        ```

### Create Access Key
**POST /v1/access-keys/:sessionId/:machineId**
*   **Authentication**: Required
*   **Description**: Creates a new access key for a given session and machine.
*   **Parameters**:
    *   `sessionId` (string, Path): The ID of the session.
    *   `machineId` (string, Path): The ID of the machine.
*   **Request Body**:
    ```json
    {
        "data": "string"
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "success": "boolean",
            "accessKey": {
                "data": "string",
                "dataVersion": "number",
                "createdAt": "number",
                "updatedAt": "number"
            } | undefined,
            "error": "string" | undefined
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "Session or machine not found"
        }
        ```
    *   `409 Conflict`:
        ```json
        {
            "error": "Access key already exists"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to create access key"
        }
        ```

### Update Access Key
**PUT /v1/access-keys/:sessionId/:machineId**
*   **Authentication**: Required
*   **Description**: Updates an existing access key with optimistic concurrency control.
*   **Parameters**:
    *   `sessionId` (string, Path): The ID of the session.
    *   `machineId` (string, Path): The ID of the machine.
*   **Request Body**:
    ```json
    {
        "data": "string",
        "expectedVersion": "number"
    }
    ```
*   **Responses**:
    *   `200 OK`: (Union Type)
        ```json
        {
            "success": true,
            "version": "number"
        }
        ```
        OR
        ```json
        {
            "success": false,
            "error": "version-mismatch",
            "currentVersion": "number",
            "currentData": "string"
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "Access key not found"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "success": false,
            "error": "Failed to update access key"
        }
        ```

---

## Account API (`accountRoutes.ts`)

### Get Account Profile
**GET /v1/account/profile**
*   **Authentication**: Required
*   **Description**: Retrieves the profile information for the authenticated user.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "id": "string",
            "timestamp": "number",
            "firstName": "string",
            "lastName": "string",
            "username": "string",
            "avatar": {
                "path": "string",
                "url": "string",
                "width": "number" | undefined,
                "height": "number" | undefined,
                "thumbhash": "string" | undefined
            } | null,
            "github": { ... } | null,
            "connectedServices": ["string"]
        }
        ```

### Get Account Settings
**GET /v1/account/settings**
*   **Authentication**: Required
*   **Description**: Retrieves the settings for the authenticated user.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "settings": "string" | null,
            "settingsVersion": "number"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to get account settings"
        }
        ```

### Update Account Settings
**POST /v1/account/settings**
*   **Authentication**: Required
*   **Description**: Updates the settings for the authenticated user with optimistic concurrency control.
*   **Request Body**:
    ```json
    {
        "settings": "string" | null,
        "expectedVersion": "number"
    }
    ```
*   **Responses**:
    *   `200 OK`: (Union Type)
        ```json
        {
            "success": true,
            "version": "number"
        }
        ```
        OR
        ```json
        {
            "success": false,
            "error": "version-mismatch",
            "currentVersion": "number",
            "currentSettings": "string" | null
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "success": false,
            "error": "Failed to update account settings"
        }
        ```

### Query Usage
**POST /v1/usage/query**
*   **Authentication**: Required
*   **Description**: Queries usage reports for the authenticated user, with optional filters and grouping.
*   **Request Body**:
    ```json
    {
        "sessionId": "string" | null,
        "startTime": "number" | null,
        "endTime": "number" | null,
        "groupBy": "hour" | "day" | null
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "usage": [
                {
                    "timestamp": "number",
                    "tokens": { "[key: string]": "number" },
                    "cost": { "[key: string]": "number" },
                    "reportCount": "number"
                }
            ],
            "groupBy": "string",
            "totalReports": "number"
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "Session not found"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to query usage reports"
        }
        ```

---

## Artifacts API (`artifactsRoutes.ts`)

### List All Artifacts
**GET /v1/artifacts**
*   **Authentication**: Required
*   **Description**: Lists all artifacts associated with the authenticated account.
*   **Responses**:
    *   `200 OK`:
        ```json
        [
            {
                "id": "string",
                "header": "string",
                "headerVersion": "number",
                "dataEncryptionKey": "string",
                "seq": "number",
                "createdAt": "number",
                "updatedAt": "number"
            }
        ]
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to get artifacts"
        }
        ```

### Get Single Artifact
**GET /v1/artifacts/:id**
*   **Authentication**: Required
*   **Description**: Retrieves a single artifact by its ID, including its full body.
*   **Parameters**:
    *   `id` (string, Path): The ID of the artifact.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "id": "string",
            "header": "string",
            "headerVersion": "number",
            "body": "string",
            "bodyVersion": "number",
            "dataEncryptionKey": "string",
            "seq": "number",
            "createdAt": "number",
            "updatedAt": "number"
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "Artifact not found"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to get artifact"
        }
        ```

### Create New Artifact
**POST /v1/artifacts**
*   **Authentication**: Required
*   **Description**: Creates a new artifact. If an artifact with the given ID already exists for the same account, it returns the existing one (idempotent).
*   **Request Body**:
    ```json
    {
        "id": "string (uuid)",
        "header": "string",
        "body": "string",
        "dataEncryptionKey": "string"
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "id": "string",
            "header": "string",
            "headerVersion": "number",
            "body": "string",
            "bodyVersion": "number",
            "dataEncryptionKey": "string",
            "seq": "number",
            "createdAt": "number",
            "updatedAt": "number"
        }
        ```
    *   `409 Conflict`:
        ```json
        {
            "error": "Artifact with this ID already exists for another account"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to create artifact"
        }
        ```

### Update Artifact
**POST /v1/artifacts/:id**
*   **Authentication**: Required
*   **Description**: Updates an existing artifact with version control for header and/or body.
*   **Parameters**:
    *   `id` (string, Path): The ID of the artifact to update.
*   **Request Body**:
    ```json
    {
        "header": "string" | undefined,
        "expectedHeaderVersion": "number (int, min 0)" | undefined,
        "body": "string" | undefined,
        "expectedBodyVersion": "number (int, min 0)" | undefined
    }
    ```
*   **Responses**:
    *   `200 OK`: (Union Type)
        ```json
        {
            "success": true,
            "headerVersion": "number" | undefined,
            "bodyVersion": "number" | undefined
        }
        ```
        OR
        ```json
        {
            "success": false,
            "error": "version-mismatch",
            "currentHeaderVersion": "number" | undefined,
            "currentBodyVersion": "number" | undefined,
            "currentHeader": "string" | undefined,
            "currentBody": "string" | undefined
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "Artifact not found"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to update artifact"
        }
        ```

### Delete Artifact
**DELETE /v1/artifacts/:id**
*   **Authentication**: Required
*   **Description**: Deletes an artifact by its ID.
*   **Parameters**:
    *   `id` (string, Path): The ID of the artifact to delete.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "success": true
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "Artifact not found"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to delete artifact"
        }
        ```

---

## Auth API (`authRoutes.ts`)

### Authenticate
**POST /v1/auth**
*   **Authentication**: Not explicitly stated as required, but performs authentication.
*   **Description**: Authenticates a user using a public key, challenge, and signature. Creates or updates the user in the database.
*   **Request Body**:
    ```json
    {
        "publicKey": "string",
        "challenge": "string",
        "signature": "string"
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "success": true,
            "token": "string"
        }
        ```
    *   `401 Unauthorized`:
        ```json
        {
            "error": "Invalid signature"
        }
        ```

### Request Terminal Authorization
**POST /v1/auth/request**
*   **Authentication**: Not Required
*   **Description**: Initiates a terminal authorization request, returning a 'requested' state or an 'authorized' state with a token if already approved.
*   **Request Body**:
    ```json
    {
        "publicKey": "string",
        "supportsV2": "boolean" | null
    }
    ```
*   **Responses**:
    *   `200 OK`: (Union Type)
        ```json
        {
            "state": "requested"
        }
        ```
        OR
        ```json
        {
            "state": "authorized",
            "token": "string",
            "response": "string"
        }
        ```
    *   `401 Unauthorized`:
        ```json
        {
            "error": "Invalid public key"
        }
        ```

### Get Terminal Authorization Request Status
**GET /v1/auth/request/status**
*   **Authentication**: Not Required
*   **Description**: Retrieves the status of a terminal authorization request.
*   **Query Parameters**:
    *   `publicKey` (string): The public key associated with the request.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "status": "not_found" | "pending" | "authorized",
            "supportsV2": "boolean"
        }
        ```

### Respond to Terminal Authorization Request
**POST /v1/auth/response**
*   **Authentication**: Required
*   **Description**: Approves or denies a terminal authorization request.
*   **Request Body**:
    ```json
    {
        "response": "string",
        "publicKey": "string"
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "success": true
        }
        ```
    *   `401 Unauthorized`:
        ```json
        {
            "error": "Invalid public key"
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "Request not found"
        }
        ```

### Request Account Authorization
**POST /v1/auth/account/request**
*   **Authentication**: Not Required
*   **Description**: Initiates an account authorization request, returning a 'requested' state or an 'authorized' state with a token if already approved.
*   **Request Body**:
    ```json
    {
        "publicKey": "string"
    }
    ```
*   **Responses**:
    *   `200 OK`: (Union Type)
        ```json
        {
            "state": "requested"
        }
        ```
        OR
        ```json
        {
            "state": "authorized",
            "token": "string",
            "response": "string"
        }
        ```
    *   `401 Unauthorized`:
        ```json
        {
            "error": "Invalid public key"
        }
        ```

### Respond to Account Authorization Request
**POST /v1/auth/account/response**
*   **Authentication**: Required
*   **Description**: Approves or denies an account authorization request.
*   **Request Body**:
    ```json
    {
        "response": "string",
        "publicKey": "string"
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "success": true
        }
        ```
    *   `401 Unauthorized`:
        ```json
        {
            "error": "Invalid public key"
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "Request not found"
        }
        ```

---

## Connect API (`connectRoutes.ts`)

### Get GitHub OAuth Parameters
**GET /v1/connect/github/params**
*   **Authentication**: Required
*   **Description**: Provides the URL for initiating the GitHub OAuth flow.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "url": "string"
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
            "error": "string"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "string"
        }
        ```

### GitHub OAuth Callback
**GET /v1/connect/github/callback**
*   **Authentication**: Not Required
*   **Description**: Callback endpoint for GitHub OAuth. Handles the authorization code exchange and user connection.
*   **Query Parameters**:
    *   `code` (string): The authorization code from GitHub.
    *   `state` (string): The state token for CSRF protection.
*   **Responses**: (Redirects to `https://app.happy.engineering` with `github=connected` or `error` query parameters)

### GitHub Webhook Handler
**POST /v1/connect/github/webhook**
*   **Authentication**: Not Required (uses `x-hub-signature-256` for verification)
*   **Description**: Endpoint for receiving GitHub webhook events.
*   **Headers**:
    *   `x-hub-signature-256` (string)
    *   `x-github-event` (string)
    *   `x-github-delivery` (string, optional)
*   **Request Body**: `any` (raw body is verified)
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "received": true
        }
        ```
    *   `401 Unauthorized`:
        ```json
        {
            "error": "string"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "string"
        }
        ```

### Disconnect GitHub Account
**DELETE /v1/connect/github**
*   **Authentication**: Required
*   **Description**: Disconnects the authenticated user's GitHub account.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "success": true
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "string"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "string"
        }
        ```

### Register Inference Vendor Token
**POST /v1/connect/:vendor/register**
*   **Authentication**: Required
*   **Description**: Registers an API token for a specified inference vendor (e.g., OpenAI, Anthropic, Gemini).
*   **Parameters**:
    *   `vendor` (string, Path): The vendor name (`openai`, `anthropic`, `gemini`).
*   **Request Body**:
    ```json
    {
        "token": "string"
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "success": true
        }
        ```

### Get Inference Vendor Token
**GET /v1/connect/:vendor/token**
*   **Authentication**: Required
*   **Description**: Retrieves the stored API token for a specified inference vendor.
*   **Parameters**:
    *   `vendor` (string, Path): The vendor name (`openai`, `anthropic`, `gemini`).
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "token": "string" | null
        }
        ```

### Delete Inference Vendor Token
**DELETE /v1/connect/:vendor**
*   **Authentication**: Required
*   **Description**: Deletes the stored API token for a specified inference vendor.
*   **Parameters**:
    *   `vendor` (string, Path): The vendor name (`openai`, `anthropic`, `gemini`).
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "success": true
        }
        ```

### Get All Inference Vendor Tokens
**GET /v1/connect/tokens**
*   **Authentication**: Required
*   **Description**: Retrieves all stored API tokens for all connected inference vendors.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "tokens": [
                {
                    "vendor": "string",
                    "token": "string"
                }
            ]
        }
        ```

---

## Development API (`devRoutes.ts`)

### Combined Logging Endpoint (Conditional)
**POST /logs-combined-from-cli-and-mobile-for-simple-ai-debugging**
*   **Authentication**: Not Required
*   **Description**: Endpoint for receiving combined logs from CLI and mobile clients for AI debugging. **Only active when `DANGEROUSLY_LOG_TO_SERVER_FOR_AI_AUTO_DEBUGGING` environment variable is set.**
*   **Request Body**:
    ```json
    {
        "timestamp": "string",
        "level": "string",
        "message": "string",
        "messageRawObject": "any" | undefined,
        "source": "mobile" | "cli",
        "platform": "string" | undefined
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "success": true
        }
        ```

---

## Feed API (`feedRoutes.ts`)

### Get User Feed
**GET /v1/feed**
*   **Authentication**: Required
*   **Description**: Retrieves a paginated feed of items for the authenticated user.
*   **Query Parameters**:
    *   `before` (string, optional): Cursor for pagination, get items before this ID.
    *   `after` (string, optional): Cursor for pagination, get items after this ID.
    *   `limit` (number, optional, default: 50, min: 1, max: 200): Maximum number of items to return.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "items": [
                {
                    "id": "string",
                    "body": { ... }, // Detailed Zod schema for FeedBodySchema in code
                    "repeatKey": "string" | null,
                    "cursor": "string",
                    "createdAt": "number"
                }
            ],
            "hasMore": "boolean"
        }
        ```

---

## Key-Value Store API (`kvRoutes.ts`)

### Get Single Key-Value Pair
**GET /v1/kv/:key**
*   **Authentication**: Required
*   **Description**: Retrieves a single key-value pair for the authenticated user.
*   **Parameters**:
    *   `key` (string, Path): The key to retrieve.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "key": "string",
            "value": "string",
            "version": "number"
        } | null
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "Key not found"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to get value"
        }
        ```

### List Key-Value Pairs
**GET /v1/kv**
*   **Authentication**: Required
*   **Description**: Lists key-value pairs for the authenticated user, with optional prefix filtering and limit.
*   **Query Parameters**:
    *   `prefix` (string, optional): Filter keys by this prefix.
    *   `limit` (number, optional, default: 100, min: 1, max: 1000): Maximum number of items to return.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "items": [
                {
                    "key": "string",
                    "value": "string",
                    "version": "number"
                }
            ]
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to list items"
        }
        ```

### Bulk Get Key-Value Pairs
**POST /v1/kv/bulk**
*   **Authentication**: Required
*   **Description**: Retrieves multiple key-value pairs by a list of keys for the authenticated user.
*   **Request Body**:
    ```json
    {
        "keys": ["string"] // Min 1, Max 100
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "values": [
                {
                    "key": "string",
                    "value": "string",
                    "version": "number"
                }
            ]
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to get values"
        }
        ```

### Atomic Batch Mutation for Key-Value Pairs
**POST /v1/kv**
*   **Authentication**: Required
*   **Description**: Performs a batch of atomic mutations (create, update, delete) on key-value pairs with optimistic concurrency control.
*   **Request Body**:
    ```json
    {
        "mutations": [
            {
                "key": "string",
                "value": "string" | null, // Set to null to delete
                "version": "number" // Required, use -1 for new keys
            }
        ] // Min 1, Max 100
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "success": true,
            "results": [
                {
                    "key": "string",
                    "version": "number"
                }
            ]
        }
        ```
    *   `409 Conflict`:
        ```json
        {
            "success": false,
            "errors": [
                {
                    "key": "string",
                    "error": "version-mismatch",
                    "version": "number",
                    "value": "string" | null
                }
            ]
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to mutate values"
        }
        ```

---

## Machines API (`machinesRoutes.ts`)

### Create or Get Machine
**POST /v1/machines**
*   **Authentication**: Required
*   **Description**: Creates a new machine or returns an existing one if the ID and user match.
*   **Request Body**:
    ```json
    {
        "id": "string",
        "metadata": "string", // Encrypted metadata
        "daemonState": "string" | undefined, // Encrypted daemon state
        "dataEncryptionKey": "string" | null // Base64 encoded key
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "machine": {
                "id": "string",
                "metadata": "string",
                "metadataVersion": "number",
                "daemonState": "string" | null,
                "daemonStateVersion": "number",
                "dataEncryptionKey": "string" | null,
                "active": "boolean",
                "activeAt": "number",
                "createdAt": "number",
                "updatedAt": "number"
            }
        }
        ```

### List All Machines
**GET /v1/machines**
*   **Authentication**: Required
*   **Description**: Lists all machines associated with the authenticated user.
*   **Responses**:
    *   `200 OK`:
        ```json
        [
            {
                "id": "string",
                "metadata": "string",
                "metadataVersion": "number",
                "daemonState": "string" | null,
                "daemonStateVersion": "number",
                "dataEncryptionKey": "string" | null,
                "seq": "number",
                "active": "boolean",
                "activeAt": "number",
                "createdAt": "number",
                "updatedAt": "number"
            }
        ]
        ```

### Get Single Machine by ID
**GET /v1/machines/:id**
*   **Authentication**: Required
*   **Description**: Retrieves a single machine by its ID for the authenticated user.
*   **Parameters**:
    *   `id` (string, Path): The ID of the machine.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "machine": {
                "id": "string",
                "metadata": "string",
                "metadataVersion": "number",
                "daemonState": "string" | null,
                "daemonStateVersion": "number",
                "dataEncryptionKey": "string" | null,
                "seq": "number",
                "active": "boolean",
                "activeAt": "number",
                "createdAt": "number",
                "updatedAt": "number"
            }
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "Machine not found"
        }
        ```

---

## Push Notifications API (`pushRoutes.ts`)

### Register Push Token
**POST /v1/push-tokens**
*   **Authentication**: Required
*   **Description**: Registers a push notification token for the authenticated user.
*   **Request Body**:
    ```json
    {
        "token": "string"
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "success": true
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to register push token"
        }
        ```

### Delete Push Token
**DELETE /v1/push-tokens/:token**
*   **Authentication**: Required
*   **Description**: Deletes a specific push notification token for the authenticated user.
*   **Parameters**:
    *   `token` (string, Path): The push token to delete.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "success": true
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to delete push token"
        }
        ```

### Get All Push Tokens
**GET /v1/push-tokens**
*   **Authentication**: Required
*   **Description**: Retrieves all registered push notification tokens for the authenticated user.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "tokens": [
                {
                    "id": "string",
                    "token": "string",
                    "createdAt": "number",
                    "updatedAt": "number"
                }
            ]
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
            "error": "Failed to get push tokens"
        }
        ```

---

## Session API (`sessionRoutes.ts`)

### List All Sessions (V1)
**GET /v1/sessions**
*   **Authentication**: Required
*   **Description**: Lists all sessions for the authenticated user (V1, retrieves up to 150 sessions).
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "sessions": [
                {
                    "id": "string",
                    "seq": "number",
                    "createdAt": "number",
                    "updatedAt": "number",
                    "active": "boolean",
                    "activeAt": "number",
                    "metadata": "string",
                    "metadataVersion": "number",
                    "agentState": "string" | null,
                    "agentStateVersion": "number",
                    "dataEncryptionKey": "string" | null,
                    "lastMessage": "null"
                }
            ]
        }
        ```

### List Active Sessions (V2)
**GET /v2/sessions/active**
*   **Authentication**: Required
*   **Description**: Lists active sessions for the authenticated user (V2, filters by last active in the last 15 minutes).
*   **Query Parameters**:
    *   `limit` (number, optional, default: 150, min: 1, max: 500): Maximum number of sessions to return.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "sessions": [
                {
                    "id": "string",
                    "seq": "number",
                    "createdAt": "number",
                    "updatedAt": "number",
                    "active": "boolean",
                    "activeAt": "number",
                    "metadata": "string",
                    "metadataVersion": "number",
                    "agentState": "string" | null,
                    "agentStateVersion": "number",
                    "dataEncryptionKey": "string" | null
                }
            ]
        }
        ```

### List Sessions with Cursor-based Pagination (V2)
**GET /v2/sessions**
*   **Authentication**: Required
*   **Description**: Lists sessions for the authenticated user with cursor-based pagination and optional `changedSince` filter.
*   **Query Parameters**:
    *   `cursor` (string, optional): A cursor string for pagination (`cursor_v1_<sessionId>`).
    *   `limit` (number, optional, default: 50, min: 1, max: 200): Maximum number of sessions to return.
    *   `changedSince` (number, optional): Unix timestamp to filter sessions updated since this time.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "sessions": [
                {
                    "id": "string",
                    "seq": "number",
                    "createdAt": "number",
                    "updatedAt": "number",
                    "active": "boolean",
                    "activeAt": "number",
                    "metadata": "string",
                    "metadataVersion": "number",
                    "agentState": "string" | null,
                    "agentStateVersion": "number",
                    "dataEncryptionKey": "string" | null
                }
            ],
            "nextCursor": "string" | null,
            "hasNext": "boolean"
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
            "error": "Invalid cursor format"
        }
        ```

### Create or Load Session by Tag
**POST /v1/sessions**
*   **Authentication**: Required
*   **Description**: Creates a new session with a given tag, or loads an existing session if a matching tag exists for the user.
*   **Request Body**:
    ```json
    {
        "tag": "string",
        "metadata": "string",
        "agentState": "string" | null,
        "dataEncryptionKey": "string" | null // Base64 encoded key
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "session": {
                "id": "string",
                "seq": "number",
                "metadata": "string",
                "metadataVersion": "number",
                "agentState": "string" | null,
                "agentStateVersion": "number",
                "dataEncryptionKey": "string" | null,
                "active": "boolean",
                "activeAt": "number",
                "createdAt": "number",
                "updatedAt": "number",
                "lastMessage": "null"
            }
        }
        ```

### Get Session Messages
**GET /v1/sessions/:sessionId/messages**
*   **Authentication**: Required
*   **Description**: Retrieves messages for a specific session.
*   **Parameters**:
    *   `sessionId` (string, Path): The ID of the session.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "messages": [
                {
                    "id": "string",
                    "seq": "number",
                    "content": "string",
                    "localId": "string",
                    "createdAt": "number",
                    "updatedAt": "number"
                }
            ]
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "Session not found"
        }
        ```

### Delete Session
**DELETE /v1/sessions/:sessionId**
*   **Authentication**: Required
*   **Description**: Deletes a session by its ID.
*   **Parameters**:
    *   `sessionId` (string, Path): The ID of the session to delete.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "success": true
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "Session not found or not owned by user"
        }
        ```

---

## User API (`userRoutes.ts`)

### Get User Profile
**GET /v1/user/:id**
*   **Authentication**: Required
*   **Description**: Retrieves the profile of a specific user.
*   **Parameters**:
    *   `id` (string, Path): The ID of the user.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "user": {
                "id": "string",
                "firstName": "string",
                "lastName": "string" | null,
                "avatar": {
                    "path": "string",
                    "url": "string",
                    "width": "number" | undefined,
                    "height": "number" | undefined,
                    "thumbhash": "string" | undefined
                } | null,
                "username": "string",
                "bio": "string" | null,
                "status": "none" | "requested" | "pending" | "friend" | "rejected"
            }
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "User not found"
        }
        ```

### Search for Users
**GET /v1/user/search**
*   **Authentication**: Required
*   **Description**: Searches for users by username.
*   **Query Parameters**:
    *   `query` (string): The search query for usernames.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "users": [
                {
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string" | null,
                    "avatar": { ... } | null,
                    "username": "string",
                    "bio": "string" | null,
                    "status": "none" | "requested" | "pending" | "friend" | "rejected"
                }
            ]
        }
        ```

### Add Friend
**POST /v1/friends/add**
*   **Authentication**: Required
*   **Description**: Sends a friend request to another user.
*   **Request Body**:
    ```json
    {
        "uid": "string" // The ID of the user to add as a friend
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "user": { ... } | null // UserProfileSchema
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "User not found"
        }
        ```

### Remove Friend
**POST /v1/friends/remove**
*   **Authentication**: Required
*   **Description**: Removes a user from the friend list.
*   **Request Body**:
    ```json
    {
        "uid": "string" // The ID of the user to remove
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "user": { ... } | null // UserProfileSchema
        }
        ```
    *   `404 Not Found`:
        ```json
        {
            "error": "User not found"
        }
        ```

### List Friends
**GET /v1/friends**
*   **Authentication**: Required
*   **Description**: Lists all friends of the authenticated user.
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "friends": [
                { ... } // UserProfileSchema
            ]
        }
        ```

---

## Version API (`versionRoutes.ts`)

### Check App Version
**POST /v1/version**
*   **Authentication**: Not Required
*   **Description**: Checks if a client application version is up-to-date and provides an update URL if not.
*   **Request Body**:
    ```json
    {
        "platform": "string", // e.g., "ios", "android"
        "version": "string", // Semantic version string
        "app_id": "string"
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "updateUrl": "string" | null
        }
        ```

---

## Voice API (`voiceRoutes.ts`)

### Get Voice Token
**POST /v1/voice/token**
*   **Authentication**: Required
*   **Description**: Retrieves a voice conversation token for a given agent ID, checking subscription status in production environments.
*   **Request Body**:
    ```json
    {
        "agentId": "string",
        "revenueCatPublicKey": "string" | undefined // Required in production
    }
    ```
*   **Responses**:
    *   `200 OK`:
        ```json
        {
            "allowed": "boolean",
            "token": "string" | undefined,
            "agentId": "string" | undefined
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
            "allowed": "boolean",
            "error": "string"
        }
        ```
