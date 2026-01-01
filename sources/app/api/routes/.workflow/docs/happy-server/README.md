# API Routes Module

This module defines all the HTTP API routes for the Happy Server application. It is responsible for handling incoming requests, authenticating users, validating input, interacting with the database, and returning appropriate responses.

## Structure

Each file in this directory typically corresponds to a specific resource or domain, grouping related API endpoints. For example, `userRoutes.ts` handles user-related operations, `sessionRoutes.ts` manages user sessions, and so on.

## Key Features

-   **Authentication**: Most routes are protected by an authentication middleware (`app.authenticate`) that verifies the user's identity.
-   **Schema Validation**: Utilizes `zod` for robust request (params, querystring, body) and response schema validation, ensuring data integrity and predictable API contracts.
-   **Database Interaction**: Integrates with the application's database layer (`@/storage/db`) to perform CRUD operations.
-   **Event Emission**: Many routes interact with the `eventRouter` to emit real-time updates to connected clients.
-   **Error Handling**: Provides consistent error responses for various scenarios, including validation failures, resource not found, and internal server errors.

## API Documentation

For detailed information on each API endpoint, including methods, paths, request parameters, and response structures, please refer to the [API.md](API.md) document.
