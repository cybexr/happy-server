# GitHub Module

This module provides functionality for integrating with GitHub using a GitHub App. It handles the initialization of the GitHub App and sets up webhook handlers for various GitHub events such as `push`, `pull_request`, `issues`, `star` (created/deleted), and `repository` events.

## Configuration

To use this module, the following environment variables must be set:

- `GITHUB_APP_ID`: The ID of your GitHub App.
- `GITHUB_PRIVATE_KEY`: The private key for your GitHub App.
- `GITHUB_CLIENT_ID`: The client ID of your GitHub App.
- `GITHUB_CLIENT_SECRET`: The client secret of your GitHub App.
- `GITHUB_REDIRECT_URI`: The redirect URI configured for your GitHub App.
- `GITHUB_WEBHOOK_SECRET`: The webhook secret used to secure webhook payloads.

## Usage

To initialize the GitHub integration, call the `initGithub` function at the start of your application:

```typescript
import { initGithub } from './github';

async function startServer() {
    await initGithub();
    // ... rest of your application setup
}

startServer();
```

You can retrieve the `Webhooks` and `App` instances using `getWebhooks()` and `getApp()` respectively, to extend functionality or interact directly with the Octokit instances.

## Webhook Events Handled

This module registers handlers for the following GitHub webhook events:

- `push`: Triggered when code is pushed to a repository.
- `pull_request`: Triggered for various pull request activities (e.g., opened, closed, synchronized).
- `issues`: Triggered for various issue activities (e.g., opened, closed, assigned).
- `star.created`, `star.deleted`: Triggered when a repository is starred or unstarred.
- `repository`: Triggered for various repository activities (e.g., created, deleted, archived).

Unhandled events are logged via a catch-all handler.