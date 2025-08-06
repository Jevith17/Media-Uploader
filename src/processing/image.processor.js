// src/processing/image.processor.js (Updated to be failable)

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');


const attemptTracker = {};

const compressImage = async (filePath) => {
    // --- Start of failure simulation ---
    if (!fs.existsSync(filePath)) {
        throw new Error(`Input file not found at ${filePath}`);
    }

    // Track the attempt number for this specific file path
    attemptTracker[filePath] = (attemptTracker[filePath] || 0) + 1;

    if (attemptTracker[filePath] <= 1) {
        console.log(`[Processor] Simulating failure on attempt #${attemptTracker[filePath]} for ${filePath}`);
        // Clean up the tracker for this file on final failure to allow re-runs
        // In a real scenario, you wouldn't do this, the job would just be marked failed.
        setTimeout(() => delete attemptTracker[filePath], 20000); // Cleanup after 20s
        throw new Error('Simulated processing failure');
    }
    console.log(`[Processor] Attempt #${attemptTracker[filePath]} for ${filePath}. This time it will succeed.`);
    // --- End of failure simulation ---

    const { dir, name } = path.parse(filePath);
    const processedFileName = `processed-${name}.webp`;
    const outputPath = path.join(dir, processedFileName);

    try {
        await sharp(filePath)
            .resize(800)
            .toFormat('webp', { quality: 80 })
            .toFile(outputPath);

        // Success! Clean up the tracker.
        delete attemptTracker[filePath];

        return {
            message: 'Image compressed successfully',
            newPath: outputPath,
            status: 'Completed'
        };
    } catch (error) {
        console.error(`Error compressing image ${filePath}:`, error);
        throw new Error(`Failed to process image: ${error.message}`);
    }
};

module.exports = { compressImage };