# Monitoring Module

This module (`app/monitoring`) is responsible for collecting and exposing application metrics using `prom-client`, a Prometheus client for Node.js. It tracks various aspects of the application, including WebSocket connections, session and machine activity, database operations, and HTTP request performance.

## Features

- **WebSocket Connection Tracking**: Monitors the number of active WebSocket connections, categorized by their scope (user-scoped, session-scoped, machine-scoped).
- **Event Counters**: Tracks significant application events such as session alive events, machine alive events, session cache operations, and WebSocket events.
- **HTTP Metrics**: Records the total number of HTTP requests and their durations, providing insights into API performance.
- **Database Metrics**: Periodically updates gauges for the total record count in key database tables (accounts, sessions, messages, machines).
- **Debounce Tracking**: Monitors database updates skipped due to debouncing.

## Usage

### Initializing and Exposing Metrics

Metrics are registered with the default `prom-client` registry. To expose these metrics, you would typically set up an HTTP endpoint that serves the metrics from the `register` object.

```typescript
import { register } from './metrics2';

// Example: Expose metrics on an HTTP endpoint
// In an Express.js application, this might look like:
// app.get('/metrics', async (req, res) => {
//   res.set('Content-Type', register.contentType);
//   res.end(await register.metrics());
// });
```

### Updating WebSocket Connection Counts

Use the provided functions to manage WebSocket connection metrics:

```typescript
import { incrementWebSocketConnection, decrementWebSocketConnection } from './metrics2';

// When a user-scoped WebSocket connection is established
incrementWebSocketConnection('user-scoped');

// When a user-scoped WebSocket connection is closed
decrementWebSocketConnection('user-scoped');
```

### Starting Database Metrics Updater

The `startDatabaseMetricsUpdater` function initiates a background process to keep database record counts up-to-date.

```typescript
import { startDatabaseMetricsUpdater } from './metrics2';

// Call this once during application startup
startDatabaseMetricsUpdater();
```

For details on individual metrics and their labels, refer to the `API.md` documentation.