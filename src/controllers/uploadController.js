// src/controllers/uploadController.js

const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // The 'uploads/' directory is where files will be saved
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Create a unique filename to avoid overwriting files
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Initialize multer with the storage configuration
// '.single('media')' means we expect a single file in a field named 'media'
const upload = multer({ storage: storage }).single('media');

// The function to handle the upload request
exports.handleUpload = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            // Handle potential errors, like network issues
            return res.status(500).json({ message: 'Error during file upload.', error: err.message });
        }
        if (!req.file) {
            // If no file is provided in the request
            return res.status(400).json({ message: 'No file was uploaded.' });
        }


        res.status(200).json({
            message: 'File uploaded successfully. Queued for processing.',
            file: {
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size
            }
        });
    });
};