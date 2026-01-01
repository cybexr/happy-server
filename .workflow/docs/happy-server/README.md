# Happy Server Project Documentation

## 1. Overview

The Happy Server is the backend application that powers the Happy client experience. It provides core functionalities such as user authentication, session management, data storage for various application artifacts, social interactions, and integrations with external services like GitHub.

### Purpose
To provide a robust, scalable, and secure backend foundation for the Happy application, handling all server-side logic and data persistence.

### Target Audience
This documentation is primarily aimed at developers contributing to the Happy Server codebase, DevOps engineers responsible for its deployment and maintenance, and client-side developers integrating with the Happy Server's APIs.

### Key Features
*   **User Management**: User authentication, profiles, and settings.
*   **Session Management**: Secure handling and persistence of user sessions.
*   **Data Storage**: Persistent storage and retrieval of various application artifacts and key-value data.
*   **Social Features**: Friendship management and user feeds.
*   **Integrations**: Seamless integration with third-party services like GitHub.
*   **Monitoring**: Metrics and health reporting for operational visibility.

## 2. System Architecture

The Happy Server is built with a modular and layered architectural style, emphasizing separation of concerns and maintainability. It utilizes a modern tech stack designed for performance and scalability.

### Architectural Style
The server adopts a domain-driven, service-oriented approach, where functionalities are grouped into logical domains (e.g., `auth`, `session`, `social`) each with clear responsibilities. This facilitates independent development and scaling of different parts of the application.

### Core Components
*   **API Layer (`sources/app/api`)**: Exposes RESTful and WebSocket APIs for client interaction.
*   **Authentication & Authorization (`sources/app/auth`)**: Manages user identity, login, and access control.
*   **Domain Services (`sources/app/*`)**: Business logic encapsulated within specific domains (e.g., `feed`, `github`, `kv`, `presence`, `social`).
*   **Storage Layer (`sources/storage`, `prisma`)**: Handles all interactions with the PostgreSQL database (via Prisma ORM) and Redis cache.
*   **Shared Modules (`sources/modules`)**: Generic, reusable functionalities like encryption and external API clients.
*   **Utilities (`sources/utils`)**: Common helper functions and cross-cutting concerns.

### Tech Stack
*   **Language**: TypeScript
*   **Runtime**: Node.js
*   **Web Framework**: Express.js (implied by API structure)
*   **Database**: PostgreSQL (managed with Prisma ORM)
*   **Caching/Sessions**: Redis
*   **Testing**: Vitest
*   **Containerization**: Docker

### Design Principles
*   **Modularity**: Code is organized into independent, loosely coupled modules.
*   **API-First**: Emphasis on well-defined and consistent API interfaces.
*   **Scalability**: Designed to handle increasing load through stateless services and efficient data access.
*   **Observability**: Integrated monitoring and logging for operational insights.
*   **Security**: Adherence to security best practices for data protection and access control.

## 3. Getting Started

To set up and run the Happy Server for development or local testing, follow these steps.

### Prerequisites
Before you begin, ensure you have the following installed:
*   **Node.js**: Version 18.x or later. Recommended to use a Node Version Manager (nvm).
*   **Yarn**: Package manager (installed globally via `npm install -g yarn`).
*   **Docker & Docker Compose**: For running local PostgreSQL and Redis instances.
*   **Git**: For cloning the repository.

### Installation
1.  **Clone the Repository**:
    ```bash
    git clone [repository-url]
    cd happy-server
    ```
2.  **Install Dependencies**:
    ```bash
    yarn install
    ```

### Configuration
1.  **Environment Variables**: Create a `.env.dev` file in the project root by copying `.env.dev.example` (if available, otherwise create one manually) and populate it with the necessary environment variables. Key variables include:
    *   `DATABASE_URL`: Connection string for your PostgreSQL database (e.g., `postgresql://user:password@localhost:5432/happydb`).
    *   `REDIS_URL`: Connection string for your Redis instance (e.g., `redis://localhost:6379`).
    *   Other service-specific keys (e.g., `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`).

2.  **Database Setup (Local)**:
    You can use Docker Compose to spin up local PostgreSQL and Redis instances. (Assuming `docker-compose.yaml` or similar files exist in `deploy/`)
    ```bash
    # Example (adjust based on actual deploy files)
    docker-compose -f deploy/happy-redis.yaml -f deploy/handy.yaml up -d
    ```

3.  **Run Prisma Migrations**:
    Ensure your database schema is up-to-date.
    ```bash
    yarn prisma migrate deploy
    ```
    or for development migrations:
    ```bash
    yarn prisma migrate dev
    ```

### Running the Project
*   **Development Mode**: Starts the server with hot-reloading for development.
    ```bash
    yarn dev
    ```
*   **Production Build & Start**: First build the project, then start the compiled JavaScript.
    ```bash
    yarn build
    yarn start
    ```

## 4. Development Workflow

### Branching Strategy
The project typically follows a Git Flow or similar branching strategy:
*   `main`: Represents the production-ready code.
*   `develop`: The latest integrated development branch.
*   `feature/<feature-name>`: Branches for new features, branched from `develop`.
*   `bugfix/<bug-description>`: Branches for bug fixes, branched from `develop` or `main` (for hotfixes).

### Coding Standards
*   **Language**: All new code should be written in TypeScript, strictly adhering to the `tsconfig.json` rules.
*   **Formatting**: Maintain consistency with existing code styles. Use automated formatters (e.g., Prettier, ESLint) if configured.
*   **Modularity**: Functions and classes should follow the Single Responsibility Principle.
*   **Comments**: Add comments to explain *why* complex logic is implemented, rather than *what* it does.

### Testing
*   **Unit Tests**: All new features and bug fixes should be accompanied by comprehensive unit tests using [Vitest](https://vitest.dev/). Test files are typically co-located with the source files and named `*.spec.ts`.
*   **Running Tests**:
    ```bash
    yarn test
    ```

### Build & Deployment
*   **Build Process**: The `yarn build` command compiles TypeScript sources into JavaScript.
*   **Deployment**: The server is designed for containerized deployment, typically using Docker. Kubernetes manifests are located in the `deploy/` directory for orchestration.

## 5. Project Structure

Here's a high-level overview of the main directories within the `happy-server` project:

```
happy-server/
├── .env.dev                  # Environment variables for development
├── Dockerfile                # Docker build instructions
├── package.json              # Project metadata and dependencies
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── sources/                  # Main application source code
│   ├── app/                  # Application-specific logic, by domain
│   │   ├── api/              # API routes and socket handlers
│   │   ├── auth/             # Authentication services
│   │   ├── events/           # Event handling
│   │   ├── feed/             # User feed logic
│   │   ├── github/           # GitHub integration logic
│   │   ├── kv/               # Key-Value store operations
│   │   ├── monitoring/       # Metrics and health checks
│   │   ├── presence/         # User presence and session management
│   │   ├── session/          # Session specific logic
│   │   └── social/           # Social features (friends, relationships)
│   ├── modules/              # Reusable, generic modules (e.g., encryption)
│   ├── storage/              # Database, Redis, file storage interactions
│   └── utils/                # General utility functions
├── vitest.config.ts          # Vitest testing configuration
└── .workflow/docs/happy-server/ # Project documentation
    └── README.md             # This document
    └── API.md                # Core API documentation
```

## 6. Navigation

*   **Core API Documentation**: For detailed information on the exposed API interfaces and types, refer to: 
    [sources/.workflow/docs/happy-server/API.md](API.md)

