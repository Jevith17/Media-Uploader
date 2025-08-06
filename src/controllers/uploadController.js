// src/controllers/uploadController.js (Updated)

const multer = require('multer');
const path = require('path');
const mediaQueue = require('../queues/media.queue'); // Import the queue

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('media');

exports.handleUpload = (req, res) => {
    upload(req, res, async (err) => { // Make the function async
        if (err) {
            return res.status(500).json({ message: 'Error during file upload.', error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file was uploaded.' });
        }

        try {
            // Add a job to the queue
            // The job contains the data our worker will need to process the file
            const job = await mediaQueue.add('process-media', {
                filePath: req.file.path,
                originalName: req.file.originalname
            });

            console.log(`Job with ID ${job.id} added to the queue.`);

            res.status(202).json({ // 202 Accepted is a good status code here
                message: 'File uploaded and accepted for processing.',
                jobId: job.id
            });
        } catch (queueError) {
            console.error('Failed to add job to the queue:', queueError);
            res.status(500).json({ message: 'Failed to queue the file for processing.' });
        }
    });
};