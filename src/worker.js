// src/worker.js

const { Worker } = require('bullmq');
const path = require('path');

// Define the connection to Redis
// It's the same connection info we used for the queue
const redisConnection = {
    host: 'localhost',
    port: 6379
};

// This is the core processing function.
// It will be called for every job in the queue.
const processMediaJob = async (job) => {
    const { filePath, originalName } = job.data;
    console.log(`[Worker] Started processing job ${job.id}: ${originalName} at ${filePath}`);

    // --- SIMULATE HEAVY PROCESSING ---
    // In a real application, this is where you would do the actual work:
    // - Compress the image (e.g., using 'sharp')
    // - Generate thumbnails
    // - Add watermarks
    // - Transcode video (e.g., using 'ffmpeg')

    // We'll simulate this with a 5-second delay to represent a long task.
    await new Promise(resolve => setTimeout(resolve, 5000));

    // --- FAKE RESULT ---
    const processedFileName = `processed-${path.basename(filePath)}`;
    const processedFilePath = path.join(path.dirname(filePath), processedFileName);

    // Let's pretend we created a new file.
    console.log(`[Worker] Finished processing job ${job.id}. Output -> ${processedFilePath}`);

    // You can return a result, which gets stored in the job object.
    return { newPath: processedFilePath, status: 'Completed' };
};

// --- Initialize the Worker ---
const worker = new Worker('media-processing', processMediaJob, {
    connection: redisConnection,
    concurrency: 5 // Process up to 5 jobs concurrently
});

// --- Event Listeners for Logging ---
// It's very useful to log events for monitoring and debugging.
worker.on('completed', (job, result) => {
    console.log(`[Worker] Job ${job.id} completed successfully. Result:`, result);
});

worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job.id} failed with error:`, err.message);
});

worker.on('error', err => {
    // An error occurred that is not related to a specific job.
    console.error('[Worker] A worker error occurred:', err);
});

console.log("Worker is up and listening for jobs on the 'media-processing' queue...");