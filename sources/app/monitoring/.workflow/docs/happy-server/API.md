# Code API Documentation: Monitoring Module

This document details the public API of the `monitoring` module, specifically focusing on `metrics2.ts`.

## `metrics2.ts`

This file provides a comprehensive set of Prometheus metrics for monitoring the application's health and performance, including WebSocket connections, session and machine alive events, database operations, and HTTP requests. It also includes functions to update and manage these metrics.

### Exported Metrics (Prometheus Client)

#### `websocketConnectionsGauge`
- **Type**: `Gauge`
- **Description**: Number of active WebSocket connections.
- **Labels**: `type` (`user-scoped`, `session-scoped`, `machine-scoped`)

#### `sessionAliveEventsCounter`
- **Type**: `Counter`
- **Description**: Total number of session-alive events.

#### `machineAliveEventsCounter`
- **Type**: `Counter`
- **Description**: Total number of machine-alive events.

#### `sessionCacheCounter`
- **Type**: `Counter`
- **Description**: Total session cache operations.
- **Labels**: `operation`, `result`

#### `databaseUpdatesSkippedCounter`
- **Type**: `Counter`
- **Description**: Number of database updates skipped due to debouncing.
- **Labels**: `type`

#### `websocketEventsCounter`
- **Type**: `Counter`
- **Description**: Total WebSocket events received by type.
- **Labels**: `event_type`

#### `httpRequestsCounter`
- **Type**: `Counter`
- **Description**: Total number of HTTP requests.
- **Labels**: `method`, `route`, `status`

#### `httpRequestDurationHistogram`
- **Type**: `Histogram`
- **Description**: HTTP request duration in seconds.
- **Labels**: `method`, `route`, `status`
- **Buckets**: `[0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5, 10]`

#### `databaseRecordCountGauge`
- **Type**: `Gauge`
- **Description**: Total number of records in database tables.
- **Labels**: `table` (`accounts`, `sessions`, `messages`, `machines`)

### Exported Functions

#### `incrementWebSocketConnection(type: 'user-scoped' | 'session-scoped' | 'machine-scoped'): void`
- **Description**: Increments the count of active WebSocket connections for a given type.
- **Parameters**:
    - `type`: The type of WebSocket connection to increment.

#### `decrementWebSocketConnection(type: 'user-scoped' | 'session-scoped' | 'machine-scoped'): void`
- **Description**: Decrements the count of active WebSocket connections for a given type, ensuring the count does not go below zero.
- **Parameters**:
    - `type`: The type of WebSocket connection to decrement.

#### `updateDatabaseMetrics(): Promise<void>`
- **Description**: Queries the database for record counts in key tables (accounts, sessions, messages, machines) and updates the `databaseRecordCountGauge` accordingly.

#### `startDatabaseMetricsUpdater(): void`
- **Description**: Starts a background process that continuously calls `updateDatabaseMetrics` at a 60-second interval. This process runs indefinitely until a shutdown signal is received.

#### `register`
- **Type**: `prom-client's Registry`
- **Description**: The default Prometheus client registry used to collect and expose metrics. This is typically used to expose metrics via an HTTP endpoint.
