# Social Media API

[docker-workflow](https://github.com/sm0483/social-media-api/actions/workflows/docker-image.yml/badge.svg)

[node-workflow](https://github.com/sm0483/social-media-api/actions/workflows/node.js.yml/badge.svg)

## Overview

Welcome to the Social Media Server API! This API allows developers to access and integrate the functionality of our social media platform with other applications. With this API, you can:

-   Create and manage user accounts
-   Post and retrieve content, including text and image
-   Follow and interact with other users

Get started by reading our Getting Started guide and exploring available endpoints.

## Getting Started

This guide provides instructions for setting up a development environment for the Social Media Server API. Follow these steps to configure the necessary prerequisites and start using the API.

### Prerequisites

The following prerequisites are required to use the API:

-   **S3 Bucket**: An S3 bucket is used for image storage. Ensure that an S3 bucket is available and that the necessary credentials are provided.
-   **MongoDB**: MongoDB is used as the main database. Ensure that a MongoDB instance is available and that the necessary credentials are provided.

After setting up the prerequisites, follow these common setup steps:

1. Clone the repository and navigate to the project directory.
2. Copy the `.env.example` file to `.env` and provide the necessary values.
3. Install dependencies by running `npm install`.

### Option 1: Run with Docker

To run the server using Docker, follow these steps:

1. Build the Docker image by running

```
   docker build -t s-media . && docker run -p 5000:5000 s-media
```

2. Start the server by running

```
    docker-compose up
```

### Option 2: Run with npm

To run the server using `npm`, follow these steps:

Run this command to install dependencies and start the server in development mode:

```
    npm i && npm run dev
```

After completing these steps, the development environment will be configured and ready to use. The available endpoints can now be explored and integrations can be built.

## Endpoints

This API provides several endpoints for managing users and posts. All endpoints are prefixed with `/api/v1`.

### Index Endpoints

-   `GET /api/v1/`: This is an index route used to test if the API is live or not.

### Auth Endpoints

-   `GET /api/v1/auth/google`: Auth2 google
-   `GET /api/v1/auth/access-token`: Returns a access token

### User Endpoints

-   `PATCH /api/v1/users/`: Updates information about a authenticated user.
-   `GET /api/v1/users/`: Returns information about a authenticated user.
-   `GET /api/v1/users/all/`: Returns a list of all users.
-   `GET /api/v1/users/:id`: Returns information about a user with the specified ID.

### Post Endpoints

-   `POST /api/v1/posts`: Creates a new post.
-   `GET /api/v1/posts?page=1&pageSize=5`: Returns a paginated list of posts.
-   `DELETE /api/v1/posts/:id`: Deletes a post with the specified ID.
-   `GET /api/v1/posts/:id?page=1&pageSize=1`: Returns a paginated list of posts by a user with the specified ID.

### Follow Endpoints

-   `PATCH /api/v1/follows/follow/:id`: Follows a user with the specified ID.
-   `PATCH /api/v1/follows/remove-follow/:id`: Unfollows a user with the specified ID.
-   `GET /api/v1/follows/followers`: Returns a list of followers for the authenticated user.
-   `GET /api/v1/follows/following`: Returns a list of users that the authenticated user is following.

### Feed Endpoints

-   `GET /api/v1/feeds?page=1&pageSize=5`: Returns a paginated list of feed items.

### Like Endpoints

-   `PATCH /api/v1/likes/like/:id`: Likes a post with the specified ID.
-   `PATCH /api/v1/likes/remove-like/:id`: Removes a like from a post with the specified ID.

For more detailed information on the available endpoints, including their parameters and responses, please refer to our [Postman documentation](https://documenter.getpostman.com/view/21080448/2s93Y2Sgkf).

## Error Codes

-   **400 Bad Request**: The request was invalid or cannot be served. The exact error should be explained in the error payload.
-   **401 Unauthorized**: The request requires user authentication.
-   **403 Forbidden**: The server understood the request but refuses to authorize it.
-   **404 Not Found**: The requested resource could not be found. This error can be due to a temporary or permanent condition.
-   **500 Internal Server Error**: An unexpected condition was encountered and no more specific message is suitable.

## Technology Stack

This API is built using a robust and scalable technology stack, including:

-   **Amazon S3**: A highly scalable and durable object storage service used for image storage.
-   **MongoDB**: A document-based database used for storing and retrieving data.
-   **Express**: A fast and minimalist web framework for Node.js used to build the backend.

## API Testing

This API is tested using the following tools and frameworks:

-   **Postman**: Used to manually test the API endpoints.
-   **Jest**: A testing framework used to write and run automated tests.
-   **Supertest**: A library used in conjunction with Jest to test HTTP endpoints.

To run the tests, use the following command: 

```
npm test
```
