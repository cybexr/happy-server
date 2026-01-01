# `enableMonitoring` Code API Documentation

## Module Overview

The `enableMonitoring` function is a utility designed to integrate comprehensive monitoring capabilities into a Fastify application. It sets up request/response hooks to capture HTTP request metrics (count and duration) using Prometheus, and exposes a `/health` endpoint for service status checks, including database connectivity.

## Function: `enableMonitoring`

Integrates monitoring features into a Fastify application instance.

### Signature

```typescript
function enableMonitoring(app: Fastify): void;
```

### Parameters

*   `app: Fastify` (required)
    *   The Fastify application instance to which monitoring features will be added.

### Behavior

This function performs the following actions on the provided `Fastify` application instance:

1.  **Request Timing Hook (`onRequest`)**: Attaches a hook that records the start time of each incoming HTTP request. This timestamp is stored on the `request` object.
2.  **Response Metrics Hook (`onResponse`)**: Attaches a hook that executes after a response is sent. It calculates the duration of the request, extracts the HTTP method, route (using `request.routeOptions?.url` or `request.url`), and status code. These metrics are then used to:
    *   Increment `httpRequestsCounter` with labels for `method`, `route`, and `status`.
    *   Record the request `duration` in `httpRequestDurationHistogram` with the same labels.
3.  **Health Check Endpoint (`GET /health`)**: Registers a GET route at `/health`.
    *   Upon request, it attempts to query the database (`SELECT 1`) to verify connectivity.
    *   If the database query is successful, it responds with a `200 OK` status and a JSON object indicating `status: 'ok'`.
    *   If database connectivity fails, it responds with a `503 Service Unavailable` status and a JSON object indicating `status: 'error'` and details about the database connectivity failure.

### Dependencies

*   `@/storage/db`: For database connectivity checks in the health endpoint.
*   `../types`: For the `Fastify` type definition.
*   `@/app/monitoring/metrics2`: Provides `httpRequestsCounter` and `httpRequestDurationHistogram` for Prometheus metrics.
*   `@/utils/log`: For logging errors in the health check.

## Usage Example

```typescript
import Fastify from 'fastify';
import { enableMonitoring } from './utils/enableMonitoring'; // Adjust path as needed

const app = Fastify({ logger: true });

enableMonitoring(app);

// ... register other routes and plugins ...

const start = async () => {
    try {
        await app.listen({ port: 3000 });
        console.log(`Server listening on ${app.server.address().port}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
