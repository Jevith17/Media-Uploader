// src/queues/media.queue.js

const { Queue } = require('bullmq');

// Define the connection options for Redis
const redisConnection = {
    host: 'localhost',
    port: 6379
};

// Create a new queue named 'media-processing'
const mediaQueue = new Queue('media-processing', {
    connection: redisConnection
});

console.log("Media processing queue initialized.");

module.exports = mediaQueue;