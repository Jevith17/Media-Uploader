// src/index.js

const express = require('express');

const uploadController = require('./controllers/uploadController');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// A simple root route to check if the server is running
app.get('/', (req, res) => {
    res.status(200).send('Server is up and running!');
});

// Define the route for handling file uploads
app.post('/upload', uploadController.handleUpload);

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});

module.exports = app; // Export for future testing