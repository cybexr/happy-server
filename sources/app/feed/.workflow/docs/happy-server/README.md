# Feed Module

This module manages the user feed functionality within the Happy Server application. It provides capabilities for fetching a user's personalized feed and adding new posts to it.

## Overview

The feed module is responsible for:

*   **Retrieving User Feeds:** Efficiently fetches feed items for a given user, supporting cursor-based pagination for large datasets.
*   **Posting Feed Items:** Allows for the creation of new feed entries, including different types of content like friend requests, friend acceptances, and generic text posts.
*   **Repeat Key Handling:** Supports updating existing feed items in-place using a `repeatKey`, which is useful for notifications or statuses that can be superseded.
*   **Event Emission:** Integrates with an event router to emit real-time updates when new feed items are posted, enabling dynamic client-side experiences.

## Key Components

*   `feedGet.ts`: Contains the `feedGet` function for retrieving feed items.
*   `feedPost.ts`: Contains the `feedPost` function for adding new feed items.
*   `types.ts`: Defines the TypeScript interfaces and Zod schemas for feed-related data structures, such as `FeedBody`, `UserFeedItem`, `FeedOptions`, and `FeedResult`.

## Usage

Refer to `API.md` for detailed documentation on function signatures, parameters, and data structures.
