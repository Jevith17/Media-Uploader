// src/listeners/media.listener.js (Updated)

// ... (imports and connection info)

const setupMediaEventListeners = () => {
    const queueEvents = new QueueEvents('media-processing', { connection: redisConnection });

    queueEvents.on('completed', ({ jobId, returnvalue }) => {
        console.log(`[EVENT] Job ${jobId} completed successfully.`);
        console.log(`[EVENT] Processed file info:`, returnvalue);
    });

    // The 'failed' event fires only after all retry attempts have been exhausted.
    queueEvents.on('failed', ({ jobId, failedReason, prev }) => {
        // 'prev' will contain the previous state, which for a failed job is 'active'.
        console.error(`[EVENT] Job ${jobId} has permanently failed after all retries.`);
        console.error(`[EVENT] Failure reason: ${failedReason}`);
    });

    // NEW: Listen for when a job is retried
    queueEvents.on('retrying', ({ jobId, prev }) => {
        console.warn(`[EVENT] Job ${jobId} is being retried.`);
    });

    console.log('Event listeners (with retry tracking) for media queue are set up.');
    // ... (process.on('exit', ...))
};

module.exports = { setupMediaEventListeners };