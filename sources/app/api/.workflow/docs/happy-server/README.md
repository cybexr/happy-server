# Monitoring Module for Happy Server API

## Overview

This module provides essential monitoring capabilities for the Happy Server API, built with Fastify. It integrates Prometheus metrics for tracking HTTP request performance and includes a robust health check endpoint to monitor service and database status.

## Features

- **HTTP Request Metrics**: Automatically collects and exposes metrics for HTTP request count and duration, categorized by method, route, and status code.
- **Prometheus Integration**: Metrics are exposed in a format compatible with Prometheus for easy scraping and visualization.
- **Health Check Endpoint (`/health`)**: Provides a dedicated endpoint to verify the application's operational status, including database connectivity. Responds with `200 OK` if healthy and `503 Service Unavailable` with error details if issues are detected.

## Usage

To enable monitoring in your Fastify application, import the `enableMonitoring` function and pass your Fastify instance to it:

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
```

### Health Check

Access the health check endpoint by making a GET request to `/health`:

```
GET /health
```

**Successful Response (200 OK):**
```json
{
    "status": "ok",
    "timestamp": "2023-10-27T10:00:00.000Z",
    "service": "happy-server"
}
```

**Error Response (503 Service Unavailable):**
```json
{
    "status": "error",
    "timestamp": "2023-10-27T10:00:00.000Z",
    "service": "happy-server",
    "error": "Database connectivity failed"
}
```
