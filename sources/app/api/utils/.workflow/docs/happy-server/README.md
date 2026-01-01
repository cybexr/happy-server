# utils Module

This module provides utility functions for configuring core functionalities of the Happy Server application, built on Fastify. It includes features for authentication, error handling, and application monitoring.

## Overview

The `utils` module is responsible for initializing cross-cutting concerns within the Fastify application instance. Each utility function takes the Fastify application instance as an argument and enhances it with specific behaviors:

-   **Authentication (`enableAuthentication`):** Sets up a decorator for route-level authentication using JWT Bearer tokens.
-   **Error Handling (`enableErrorHandlers`):** Configures robust global error handling, including 404s, internal server errors, and error logging.
-   **Monitoring (`enableMonitoring`):** Integrates Prometheus metrics for HTTP requests and provides a `/health` endpoint for service status checks.

## Usage

To use these utilities, import them into your main Fastify application setup file and pass your Fastify instance to each function.

```typescript
import Fastify from 'fastify';
import { enableAuthentication } from './utils/enableAuthentication';
import { enableErrorHandlers } from './utils/enableErrorHandlers';
import { enableMonitoring } from './utils/enableMonitoring';

const app = Fastify({ logger: true });

// Enable authentication middleware
enableAuthentication(app);

// Enable global error handlers
enableErrorHandlers(app);

// Enable monitoring and health check endpoint
enableMonitoring(app);

// Register your routes and other plugins here
// app.register(myRoutes);

const start = async () => {
    try {
        await app.listen({ port: 3000 });
        app.log.info(`Server listening on ${app.server.address().port}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
```

Each function is designed to be called once during application initialization to ensure the respective features are active globally or through decorators on the `app` instance.