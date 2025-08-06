// src/controllers/uploadController.js (Updated)

// ... (imports remain the same)
const mediaQueue = require('../queues/media.queue');

// ... (storage config remains the same)
const upload = multer({ storage: storage }).single('media');

exports.handleUpload = (req, res) => {
    upload(req, res, async (err) => {
        if (err) { /* ... */ }
        if (!req.file) { /* ... */ }

        try {
            const job = await mediaQueue.add('process-media', {
                filePath: req.file.path,
                originalName: req.file.originalname
            }, {

                attempts: 3, // Try the job a total of 3 times
                backoff: {
                    type: 'exponential', // Use exponential backoff
                    delay: 5000,       // Start with a 5-second delay
                },
            });

            console.log(`Job with ID ${job.id} added to the queue with retry logic.`);

            res.status(202).json({
                message: 'File uploaded and accepted for processing.',
                jobId: job.id
            });
        } catch (queueError) { /* ... */ }
    });
};