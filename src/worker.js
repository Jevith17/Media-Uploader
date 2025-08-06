// src/worker.js (Updated)

const { Worker } = require('bullmq');
const { compressImage } = require('./processing/image.processor'); // Import our new function

const redisConnection = { host: 'localhost', port: 6379 };

// The processor function is now just a wrapper around our testable logic
const processMediaJob = async (job) => {
    const { filePath } = job.data;
    console.log(`[Worker] Started processing job ${job.id} for file: ${filePath}`);

    // Call the actual, isolated processing logic
    return compressImage(filePath);
};

const worker = new Worker('media-processing', processMediaJob, {
    connection: redisConnection,
    concurrency: 5
});

worker.on('completed', (job, result) => {
    console.log(`[Worker] Job ${job.id} completed successfully. Result:`, result);
});

worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job.id} failed with error:`, err.message);
});

console.log("Worker is up and listening for jobs on the 'media-processing' queue...");