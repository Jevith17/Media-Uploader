// src/index.js (Updated)

const express = require('express');
const uploadController = require('./controllers/uploadController');
const { setupMediaEventListeners } = require('./listeners/media.listener'); // Import the listener setup

const app = express();
const port = process.env.PORT || 3000;

// --- Start Event Listeners ---
setupMediaEventListeners(); // Call the function here

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).send('Server is up and running!');
});

app.post('/upload', uploadController.handleUpload);

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});

module.exports = app;