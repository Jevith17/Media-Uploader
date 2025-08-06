// tests/processing/image.processor.test.js

const { compressImage } = require('../../src/processing/image.processor');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

describe('Image Processor', () => {
    const FIXTURE_IMAGE = path.resolve(__dirname, '../fixtures/test-image.jpg');
    const TEMP_DIR = path.resolve(__dirname, '../temp');
    let tempImagePath;

    // Before each test, create a fresh temp directory and copy the fixture image into it
    beforeEach(() => {
        if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);
        tempImagePath = path.join(TEMP_DIR, `test-${Date.now()}.jpg`);
        fs.copyFileSync(FIXTURE_IMAGE, tempImagePath);
    });

    // After each test, clean up the temp directory
    afterEach(() => {
        if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    });

    it('should compress the image and save it as a .webp file', async () => {
        const result = await compressImage(tempImagePath);

        // 1. Check that the function returns the correct new path
        const expectedNewPath = tempImagePath.replace('.jpg', '.webp').replace('test-', 'processed-test-');
        expect(result.newPath).toBe(expectedNewPath);

        // 2. Check that the new file actually exists
        expect(fs.existsSync(result.newPath)).toBe(true);
    });

    it('should resize the image to a width of 800px', async () => {
        const result = await compressImage(tempImagePath);
        const metadata = await sharp(result.newPath).metadata();

        // 3. Check if the image was resized correctly
        expect(metadata.width).toBe(800);
        expect(metadata.format).toBe('webp');
    });

    it('should throw an error if the file path is invalid', async () => {
        const invalidPath = '/path/to/nonexistent/image.jpg';

        // 4. Check error handling
        await expect(compressImage(invalidPath)).rejects.toThrow();
    });
});