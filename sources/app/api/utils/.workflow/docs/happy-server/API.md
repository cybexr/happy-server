# `utils` Code API Documentation

This document provides API-level documentation for the `utils` module, detailing its public functions and their usage.

## Functions

### `enableMonitoring(app: Fastify)`

Configures application monitoring and a health check endpoint for a Fastify application instance.

**Description:**
This function adds request and response hooks to the Fastify application to collect HTTP request metrics (count and duration) using Prometheus. It also sets up a `/health` GET endpoint that checks database connectivity and returns the service status.

**Parameters:**
-   `app`: The Fastify application instance to which monitoring and health check functionalities will be added.

**Returns:**
`void`