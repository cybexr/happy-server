# Happy Server Application Modules

## Overview
This directory serves as the core of the Happy Server application, organizing various functionalities into distinct modules. Each module is designed to handle a specific domain, ensuring a clear separation of concerns and maintainability.

## Directory Structure

```
app/
├── api/             # Handles all API routes, request processing, and WebSocket communications.
├── auth/            # Manages user authentication, including login, logout, and session validation.
├── events/          # Centralizes application event handling and routing.
├── feed/            # Manages user-specific content feeds and related operations.
├── github/          # Integrates with GitHub for various functionalities.
├── kv/              # Provides key-value store operations for dynamic data management.
├── monitoring/      # Implements application health checks, metrics collection, and monitoring.
├── presence/        # Manages user online/offline status and session presence.
├── session/         # Handles user session creation, management, and termination.
└── social/          # Manages social interactions, user relationships, and notifications.
```

## Module Quick Reference

| Module    | Purpose & Key Features                                           | Documentation Link                             |
| :-------- | :--------------------------------------------------------------- | :--------------------------------------------- |
| `api`     | API routing, request handling, WebSocket communication.          | [api/README.md](api/README.md)                 |
| `auth`    | User authentication, session management.                         | [auth/README.md](auth/README.md)               |
| `events`  | Application event handling, dispatching.                         | [events/README.md](events/README.md)           |
| `feed`    | User content feeds, content delivery.                            | [feed/README.md](feed/README.md)               |
| `github`  | GitHub integration, repository interactions.                     | [github/README.md](github/README.md)           |
| `kv`      | Key-value storage operations, data persistence.                  | [kv/README.md](kv/README.md)                   |
| `monitoring` | Application health, metrics, performance monitoring.             | [monitoring/README.md](monitoring/README.md)   |
| `presence` | User online status, session tracking.                            | [presence/README.md](presence/README.md)       |
| `session` | User session lifecycle management.                               | [session/README.md](session/README.md)         |
| `social`  | Social interactions, friendships, user relationships.            | [social/README.md](social/README.md)           |

## How to Navigate
*   **For API-related concerns (routes, websockets):** Refer to the `api` module.
*   **For user authentication and access:** Explore the `auth` module.
*   **To understand application-wide events:** Check the `events` module.
*   **For managing user content feeds:** See the `feed` module.
*   **To work with GitHub integrations:** Look into the `github` module.
*   **For key-value store operations:** The `kv` module is your go-to.
*   **For monitoring application health and metrics:** Consult the `monitoring` module.
*   **To manage user online presence:** Investigate the `presence` module.
*   **For user session management:** Refer to the `session` module.
*   **For social features like friendships and relationships:** Dive into the `social` module.