// src/processing/image.processor.js

const sharp = require('sharp');
const path = require('path');

/**
 * Compresses an image file, resizing it and converting to webp format.
 * @param {string} filePath - The absolute path to the image file.
 * @returns {Promise<object>} A promise that resolves with information about the processed file.
 */
const compressImage = async (filePath) => {
    const { dir, name } = path.parse(filePath);
    const processedFileName = `processed-${name}.webp`;
    const outputPath = path.join(dir, processedFileName);

    try {
        await sharp(filePath)
            .resize(800) // Resize width to 800px, maintaining aspect ratio
            .toFormat('webp', { quality: 80 }) // Convert to WebP format with 80% quality
            .toFile(outputPath);

        return {
            message: 'Image compressed successfully',
            originalPath: filePath,
            newPath: outputPath,
            status: 'Completed'
        };
    } catch (error) {
        console.error(`Error compressing image ${filePath}:`, error);
        // Rethrow the error to be caught by the worker
        throw new Error(`Failed to process image: ${error.message}`);
    }
};

module.exports = { compressImage };