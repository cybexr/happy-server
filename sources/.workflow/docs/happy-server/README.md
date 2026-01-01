# Happy Server - Core Sources

This directory contains the core source code for the Happy Server application. It includes the main application entry point, fundamental types, context management, and versioning information.

## Modules

- **`main.ts`**: The primary entry point for the Happy Server application, responsible for initializing services, connecting to storage, and handling process-level events.
- **`context.ts`**: Defines the `Context` class, which provides a scoped context for operations within the application.
- **`types.ts`**: Contains common TypeScript type definitions used across the server, such as `AccountProfile` and `Artifact` structures.
- **`versions.ts`**: Stores version constants for client applications, like `IOS_UP_TO_DATE` and `ANDROID_UP_TO_DATE`.
