import axios from 'axios';
import sharp from 'sharp';
import { logger } from '../utils/logger.js';
import config from '../config/environment.js';
import { DesignInput } from '../types/index.js';

export class ImageProcessor {
  /**
   * Processes image file or URL into base64 format
   */
  async processDesignInput(designInput: DesignInput): Promise<DesignInput> {
    if (designInput.type === 'screenshot') {
      return this.validateScreenshot(designInput);
    }

    if (designInput.type === 'url') {
      return this.validateUrl(designInput);
    }

    throw new Error('Invalid design input type');
  }

  /**
   * Validates and processes screenshot (base64)
   */
  private validateScreenshot(designInput: DesignInput): DesignInput {
    if (!designInput.data) {
      throw new Error('Screenshot data is empty');
    }

    // Check if valid base64
    if (!this.isValidBase64(designInput.data)) {
      throw new Error('Invalid base64 format for screenshot');
    }

    // Extract file size from base64
    const size = Buffer.byteLength(designInput.data, 'base64');

    if (size > config.maxImageSize) {
      throw new Error(
        `Image size (${this.formatBytes(size)}) exceeds maximum of ${this.formatBytes(config.maxImageSize)}`
      );
    }

    logger.info('Screenshot validated', { size: this.formatBytes(size) });

    return designInput;
  }

  /**
   * Validates and processes URL
   */
  private validateUrl(designInput: DesignInput): DesignInput {
    if (!designInput.data) {
      throw new Error('URL is empty');
    }

    // Validate URL format
    try {
      const url = new URL(designInput.data);

      // Only allow http/https
      if (!url.protocol.match(/^https?:$/)) {
        throw new Error('Only HTTP and HTTPS URLs are supported');
      }

      logger.info('URL validated', { url: designInput.data });

      return designInput;
    } catch (error) {
      throw new Error(`Invalid URL format: ${designInput.data}`);
    }
  }

  /**
   * Converts image file buffer to base64
   */
  async bufferToBase64(buffer: Buffer): Promise<string> {
    const size = buffer.length;

    if (size > config.maxImageSize) {
      throw new Error(
        `File size (${this.formatBytes(size)}) exceeds maximum of ${this.formatBytes(config.maxImageSize)}`
      );
    }

    // Optimize image with sharp
    const optimized = await sharp(buffer)
      .resize(config.maxImageWidth, config.maxImageHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80, progressive: true })
      .toBuffer();

    const base64 = optimized.toString('base64');

    logger.info('Image optimized and converted to base64', {
      originalSize: this.formatBytes(size),
      optimizedSize: this.formatBytes(optimized.length),
      compression: ((1 - optimized.length / size) * 100).toFixed(2) + '%',
    });

    return `data:image/jpeg;base64,${base64}`;
  }

  /**
   * Downloads image from URL and converts to base64
   */
  async fetchImageFromUrl(url: string): Promise<string> {
    try {
      logger.info('Fetching image from URL', { url });

      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      const contentType = response.headers['content-type'];

      if (!contentType?.includes('image/')) {
        throw new Error(`Invalid content type: ${contentType}. Expected image.`);
      }

      const buffer = Buffer.from(response.data, 'binary');

      return this.bufferToBase64(buffer);
    } catch (error: any) {
      if (error?.code === 'ECONNABORTED') {
        throw new Error('Image download timeout. URL may be invalid or too slow.');
      }

      if (error?.code === 'ENOTFOUND') {
        throw new Error('URL not reachable. Check the domain.');
      }

      if (error?.response?.status === 404) {
        throw new Error('Image not found (404).');
      }

      throw new Error(`Failed to fetch image: ${error?.message}`);
    }
  }

  /**
   * Validates base64 string
   */
  private isValidBase64(str: string): boolean {
    try {
      // Handle data URL format
      const base64 = str.includes(',') ? str.split(',')[1] : str;

      // Check if valid base64
      return /^[A-Za-z0-9+/=]*$/.test(base64) && base64.length % 4 === 0;
    } catch {
      return false;
    }
  }

  /**
   * Formats bytes to human-readable format
   */
  private formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Estimates dimensions from base64 image (basic)
   */
  async estimateDimensions(base64: string): Promise<{ width: number; height: number }> {
    try {
      // Remove data URL prefix if present
      const imageBuffer = Buffer.from(
        base64.includes(',') ? base64.split(',')[1] : base64,
        'base64'
      );

      const metadata = await sharp(imageBuffer).metadata();

      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
      };
    } catch {
      // Return default if can't determine
      return { width: 1920, height: 1080 };
    }
  }
}

export const imageProcessor = new ImageProcessor();
export default imageProcessor;
