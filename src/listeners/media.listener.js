// src/listeners/media.listener.js

const { QueueEvents } = require('bullmq');

// Same Redis connection info
const redisConnection = {
    host: 'localhost',
    port: 6379
};

const setupMediaEventListeners = () => {
    // Initialize QueueEvents for the 'media-processing' queue
    const queueEvents = new QueueEvents('media-processing', {
        connection: redisConnection
    });

    // Listener for when a job is successfully completed
    queueEvents.on('completed', ({ jobId, returnvalue }) => {
        console.log(`[EVENT] Job ${jobId} completed successfully.`);
        // In a real application, we would do something with the result here:
        // 1. Update a database record with the 'returnvalue' (e.g., the new file path).
        // 2. Notify the user via WebSockets that their file is ready.
        // 3. Trigger another job in a different queue.
        console.log(`[EVENT] Processed file info:`, returnvalue);
    });

    // Listener for when a job fails
    queueEvents.on('failed', ({ jobId, failedReason }) => {
        console.error(`[EVENT] Job ${jobId} has failed. Reason: ${failedReason}`);
        // Handle the failure:
        // 1. Log the error for investigation.
        // 2. Notify the user that the processing failed.
        // 3. Update the job's status in the database to 'failed'.
    });

    console.log('Event listeners for media queue are set up.');

    // It's good practice to close connections when the app shuts down
    process.on('exit', () => {
        queueEvents.close();
    });
};

module.exports = { setupMediaEventListeners };