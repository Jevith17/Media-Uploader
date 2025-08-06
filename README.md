# Media Uploader with Async Processing

This project is a robust media uploading service built with Node.js. It features an asynchronous processing pipeline using BullMQ and Redis, designed for reliability and scalability.

When a user uploads a media file (e.g., an image), the server accepts it immediately and queues a background job for processing. A separate worker process picks up this job to perform heavy tasks like image compression, resizing, and format conversion without blocking the main server.

## Core Concepts Demonstrated

*   **Asynchronous Job Queues:** Using BullMQ to manage background tasks.
*   **Decoupled Architecture:** Separate processes for handling web requests and for performing intensive work.
*   **Reliability & Retries:** Built-in job retry mechanism with exponential backoff to handle transient failures.
*   **Event Dispatching:** Notifying the main application when a background job is complete using `QueueEvents`.
*   **Testable Pipelines:** Code is structured to allow for unit testing of core business logic (image processing) in isolation.

## Tech Stack

*   **Backend:** Node.js, Express.js
*   **Job Queue:** BullMQ
*   **In-Memory Store / Message Broker:** Redis
*   **File Uploads:** Multer
*   **Image Processing:** Sharp
*   **Testing:** Jest, Supertest

---

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or later recommended)
*   [Redis](https://redis.io/docs/getting-started/installation/)
*   An API client like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) for testing the upload endpoint.

---

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd media-uploader
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Ensure Redis is running:**
    Make sure your Redis server is active. By default, the application connects to `localhost:6379`.
    ```bash
    # (Example command for Homebrew on macOS)
    redis-cli ping
    # Should return PONG
    ```

4.  **Run the application:**
    You need to run two processes in separate terminal windows.

    *   **Terminal 1: Start the Web Server**
        ```bash
        node src/index.js
        ```
        *Output: `Server is listening on http://localhost:3000`*

    *   **Terminal 2: Start the Background Worker**
        ```bash
        node src/worker.js
        ```
        *Output: `Worker is up and listening for jobs on the 'media-processing' queue...`*

5.  **Run the tests:**
    To run the unit tests for the image processor:
    ```bash
    npm test
    ```

---

## How to Use

1.  Use an API client to send a `POST` request to the upload endpoint.
2.  **Endpoint:** `http://localhost:3000/upload`
3.  **Method:** `POST`
4.  **Body Type:** `form-data`
5.  **Key:**
    *   Set the key to `media`.
    *   Change the type of the key from `Text` to `File`.
    *   Select an image file (e.g., a `.jpg` or `.png`) as the value.

The server will respond with a `202 Accepted` status and a `jobId`. The uploaded image will be saved in the `uploads/` directory, and a compressed, resized `.webp` version will be generated alongside it after a short delay.