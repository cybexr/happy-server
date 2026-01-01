# Happy Server Architecture Documentation

## 1. System Overview

The Happy Server is the backend application powering the Happy client experience, providing core functionalities like user authentication, session management, data storage, social interactions, and external service integrations. Its primary purpose is to deliver a robust, scalable, and secure backend foundation for the Happy application, managing all server-side logic and data persistence.

### Architectural Style
The server adopts a **domain-driven, service-oriented approach**, grouping functionalities into logical domains (e.g., `auth`, `session`, `social`) each with clear responsibilities. This approach supports independent development and scaling.

### Core Principles
*   **Modularity**: Code is organized into independent, loosely coupled modules.
*   **API-First**: Emphasis on well-defined and consistent API interfaces.
*   **Scalability**: Designed to handle increasing load through stateless services and efficient data access.
*   **Observability**: Integrated monitoring and logging for operational insights.
*   **Security**: Adherence to security best practices for data protection and access control.

### Technology Stack
*   **Language**: TypeScript
*   **Runtime**: Node.js
*   **Web Framework**: Express.js
*   **Database**: PostgreSQL (managed with Prisma ORM)
*   **Caching/Sessions**: Redis
*   **Testing**: Vitest
*   **Containerization**: Docker

## 2. System Structure

The Happy Server follows a layered architecture, with clear separation of concerns:

```
+---------------------+
|     Client Apps     |
+----------+----------+
           | (REST/WebSockets)
+----------V----------+
|      API Layer      |
| (sources/app/api)   |
+----------+----------+
           |
+----------V----------+
|   Domain Services   |
| (sources/app/*)     |
| (Auth, Feed, GitHub,|
|  KV, Presence, etc.)|
+----------+----------+
           |
+----------V----------+
|    Shared Modules   |
| (sources/modules)   |
| (Encryption, GitHub |
|   Client, etc.)     |
+----------+----------+
           |
+----------V----------+
|    Storage Layer    |
| (sources/storage,   |
|       Prisma)       |
| (PostgreSQL, Redis, |
|   File Storage)     |
+----------+----------+
           |
+----------V----------+
|       Utilities     |
| (sources/utils)     |
| (Logging, Caching,  |
|    Helpers, etc.)   |
+---------------------+
```

## 3. Module Map

| Module Path               | Layer             | Responsibility                                          | Key Dependencies                                    |
| :------------------------ | :---------------- | :------------------------------------------------------ | :-------------------------------------------------- |
| `sources/app/api`         | API Layer         | Exposes RESTful and WebSocket APIs; handles request/response. | `sources/app/*` (Domain Services), `sources/context`, `sources/types` |
| `sources/app/auth`        | Domain Service    | Manages user authentication and authorization.          | `sources/storage/db` (Prisma), `sources/modules/encrypt` |
| `sources/app/events`      | Domain Service    | Handles application-wide events.                        | N/A (likely internal event bus)                     |
| `sources/app/feed`        | Domain Service    | Manages user activity feeds.                            | `sources/storage/db` (Prisma)                       |
| `sources/app/github`      | Domain Service    | Integrates with GitHub services.                        | `sources/modules/github`, `sources/storage/db` (Prisma) |
| `sources/app/kv`          | Domain Service    | Provides key-value store operations.                    | `sources/storage/db` (Prisma)                       |
| `sources/app/monitoring`  | Domain Service    | Handles application metrics and health reporting.       | N/A                                                 |
| `sources/app/presence`    | Domain Service    | Manages user presence and session caching.              | `sources/storage/redis`                             |
| `sources/app/session`     | Domain Service    | Manages user sessions.                                  | `sources/storage/db` (Prisma)                       |
| `sources/app/social`      | Domain Service    | Manages social features (friends, relationships, profiles). | `sources/storage/db` (Prisma)                       |
| `sources/modules`         | Shared Modules    | Generic, reusable functionalities.                      | External libraries, `sources/utils`                 |
| `sources/modules/encrypt` | Shared Module     | Provides encryption utilities.                          | N/A (cryptographic libraries)                       |
| `sources/modules/github`  | Shared Module     | GitHub API client and helpers.                          | External GitHub API                                 |
| `sources/storage`         | Storage Layer     | Handles all data persistence and caching interactions.  | PostgreSQL (via Prisma), Redis, File System         |
| `sources/storage/db`      | Storage Layer     | Database (Prisma) interactions.                         | PostgreSQL                                          |
| `sources/storage/redis`   | Storage Layer     | Redis cache interactions.                               | Redis                                               |
| `sources/storage/files`   | Storage Layer     | File storage operations.                                | File System                                         |
| `sources/utils`           | Utility Layer     | Common helper functions and cross-cutting concerns.     | N/A (basic utilities, OS functions)                 |
| `sources/context.ts`      | Core               | Provides operational context (e.g., user ID).           | N/A                                                 |
| `sources/types.ts`        | Core               | Defines shared TypeScript types.                        | N/A                                                 |
| `prisma/schema.prisma`    | Database Schema   | Defines the database schema for Prisma ORM.             | N/A (database definition)                           |

## 4. Module Interactions

The interaction primarily flows from the API layer down to the domain services and then to the storage layer, often utilizing shared modules and utilities.

*   **Client Request**: A client initiates a request (HTTP or WebSocket) to the `API Layer` (`sources/app/api`).
*   **API Processing**: The API layer parses the request, performs initial validation, and extracts relevant `Context` information (e.g., `uid`).
*   **Domain Logic**: The API layer delegates the request to the appropriate `Domain Service` (`sources/app/*`) which contains the core business logic.
*   **Shared Functionality**: Domain services may leverage `Shared Modules` (`sources/modules`) for common tasks like encryption or interacting with external APIs (e.g., GitHub).
*   **Data Persistence/Retrieval**: Domain services interact with the `Storage Layer` (`sources/storage`) to perform database operations (via `sources/storage/db` using Prisma) or cache operations (via `sources/storage/redis`).
*   **Utility Support**: `Utilities` (`sources/utils`) are used across all layers for common tasks such as logging, error handling, and data manipulation.
*   **Response**: The result flows back through the layers to the API layer, which then formats and sends the response back to the client.

**Dependency Graph (Simplified):**

```
Client
  ↓ (HTTP/WS)
API Layer (sources/app/api)
  ↓ (Delegation)
Domain Services (sources/app/*)
  ↓ (Usage)
Shared Modules (sources/modules)
  ↓ (Data Access)
Storage Layer (sources/storage, Prisma)
  ↓ (Helpers)
Utilities (sources/utils)
```

## 5. Design Patterns

The Happy Server employs several key design patterns:

*   **Layered Architecture**: Clearly defined layers (API, Domain, Storage, Utility) ensure separation of concerns and maintainability.
*   **Domain-Driven Design (DDD) Principles**: Functionalities are organized around business domains, leading to cohesive and focused modules.
*   **Service-Oriented Architecture (SOA) Principles**: Domain services are self-contained and expose well-defined interfaces.
*   **Repository Pattern**: Implicitly used by the Prisma ORM within the `sources/storage/db` module, abstracting database interactions.
*   **Dependency Injection (Implicit)**: Context (`sources/context`) or other dependencies are often passed explicitly to functions or constructed, rather than relying on global state.

## 6. Aggregated API Overview

The Happy Server exposes a set of core APIs for various functionalities, primarily through HTTP and WebSockets.

### Core Types & Models

*   **`Context`**: Represents an operational context, typically with a `uid` (user ID). Used to scope operations.
    *   `static create(uid: string): Context`
    *   `readonly uid: string`
*   **`AccountProfile`**: User profile information.
    ```typescript
    type AccountProfile = {
        firstName: string | null;
        lastName: string | null;
        username: string | null;
        avatar: ImageRef | null;
        github: GitHubProfile | null;
        settings: {
            value: string | null;
            version: number;
        } | null;
        connectedServices: string[];
    }
    ```
*   **`ArtifactInfo`**: Basic metadata for an application artifact.
    ```typescript
    type ArtifactInfo = {
        id: string;
        header: string;
        headerVersion: number;
        dataEncryptionKey: string;
        seq: number;
        createdAt: number;
        updatedAt: number;
    }
    ```
*   **`Artifact`**: A complete artifact, including `ArtifactInfo` and its `body` content.
    ```typescript
    type Artifact = ArtifactInfo & {
        body: string;
        bodyVersion: number;
    }
    ```

### API Endpoints (High-Level, Inferred)
Based on the module structure, the API generally supports:

*   **Authentication & User Management**: Login, registration, profile updates (`sources/app/auth`, `sources/app/social`).
*   **Session Management**: Creation, validation, termination of user sessions (`sources/app/session`, `sources/app/presence`).
*   **Data Access (KV Store)**: Operations to store and retrieve arbitrary key-value data for users (`sources/app/kv`).
*   **Social Features**: Adding/removing friends, managing relationships, user feeds (`sources/app/social`, `sources/app/feed`).
*   **GitHub Integration**: Connecting/disconnecting GitHub accounts, potentially fetching GitHub-related data (`sources/app/github`).
*   **File/Artifact Management**: Uploading, retrieving, processing artifacts (e.g., images) (`sources/storage/files`, `sources/storage/processImage`, `sources/storage/uploadImage`, `sources/app/api`).
*   **Monitoring**: Health checks and metrics endpoints (`sources/app/monitoring`).

### Constants
*   `IOS_UP_TO_DATE: string`: Minimum iOS client version.
*   `ANDROID_UP_TO_DATE: string`: Minimum Android client version.

## 7. Data Flow

A typical request lifecycle in the Happy Server:

1.  **Client Request**: A client (e.g., mobile app, web frontend) sends an HTTP request or establishes a WebSocket connection to the Happy Server.
2.  **API Gateway/Load Balancer (External)**: (Assumed) Routes the request to an available Happy Server instance.
3.  **API Layer (`sources/app/api`)**:
    *   Receives the raw request.
    *   Parses request headers, body, and query parameters.
    *   Authenticates the request (e.g., JWT validation) and creates a `Context` object with the user's `uid`.
    *   Routes the request to the appropriate handler within a domain service.
4.  **Domain Service (`sources/app/*`)**:
    *   Receives the `Context` and request payload.
    *   Executes business logic specific to its domain (e.g., `sources/app/social/friendAdd.ts` to add a friend).
    *   May interact with `Shared Modules` (e.g., `sources/modules/github.ts` for GitHub API calls).
5.  **Storage Layer (`sources/storage`)**:
    *   Domain services interact with `sources/storage/db` (Prisma) for PostgreSQL operations (CRUD on `Account`, `Session`, `Artifact`, etc.).
    *   Domain services interact with `sources/storage/redis` for caching (e.g., session presence) or temporary data storage.
    *   `sources/storage/files` handles interactions with file storage.
6.  **Utility Layer (`sources/utils`)**: Provides common functions like logging (`sources/utils/log.ts`), error handling, and data manipulation, used across all layers.
7.  **Response Generation**:
    *   The domain service returns data or status to the API layer.
    *   The API layer formats the response (e.g., JSON) and sends it back to the client.
8.  **Event Handling (`sources/app/events`)**: Asynchronous operations or side effects might be triggered via an internal event system after core logic completes.

## 8. Security and Scalability

### Security
*   **Authentication & Authorization**: Handled by `sources/app/auth`, ensuring only authenticated and authorized users can access resources.
*   **Data Encryption**: `sources/modules/encrypt` and `Artifact` structure suggest data-at-rest encryption. Communication is assumed to be over HTTPS/WSS.
*   **Prisma ORM**: Provides protection against SQL injection vulnerabilities.
*   **Environment Variables**: Sensitive configurations are managed via `.env.dev` and environment variables, not hardcoded.

### Scalability
*   **Stateless Services**: The architectural style promotes stateless services, allowing easy horizontal scaling of server instances.
*   **Database (PostgreSQL)**: Scalable relational database, with Prisma for efficient query generation and connection pooling.
*   **Caching (Redis)**: `sources/storage/redis` and `sources/app/presence/sessionCache.ts` leverage Redis for high-speed data access and reducing database load.
*   **Containerization (Docker)**: Enables efficient deployment and orchestration in environments like Kubernetes (indicated by `deploy/` manifests).
*   **Modular Design**: Allows independent scaling and development of different functional domains.
*   **Monitoring**: `sources/app/monitoring` provides metrics for identifying performance bottlenecks and scaling needs.
