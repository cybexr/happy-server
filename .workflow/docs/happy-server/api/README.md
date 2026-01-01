# API Endpoints

This document describes the HTTP API endpoints for the `happy-server` application.

## Endpoints

### POST /v1/voice/token

**Description**: Issues a voice token for a user. Checks for RevenueCat subscription in production and 11Labs API key.

**Request Body**:

```json
{
  "agentId": "string",
  "revenueCatPublicKey": "string"
}
```

**Responses**:

*   **200 OK**:
    ```json
    {
      "allowed": true,
      "token": "string",
      "agentId": "string"
    }
    ```
*   **400 Bad Request**:
    ```json
    {
      "allowed": false,
      "error": "string"
    }
    ```

---

### GET /health

**Description**: Health check endpoint. Tests database connectivity.

**Request Body**: None

**Responses**:

*   **200 OK**:
    ```json
    {
      "status": "ok",
      "timestamp": "ISO datetime",
      "service": "happy-server"
    }
    ```
*   **503 Service Unavailable**:
    ```json
    {
      "status": "error",
      "timestamp": "ISO datetime",
      "service": "happy-server",
      "error": "Database connectivity failed"
    }
    ```
