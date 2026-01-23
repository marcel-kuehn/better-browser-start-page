import { describe, it, expect } from 'vitest';
import { convertFileToBase64, isValidImageFile, isFileSizeValid } from './helpers';
import { MAX_FILE_SIZE_BYTES } from './constants';

describe('BackgroundSettings helpers', () => {
  describe('isValidImageFile', () => {
    it('should return true for JPEG files', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      expect(isValidImageFile(file)).toBe(true);
    });

    it('should return true for PNG files', () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      expect(isValidImageFile(file)).toBe(true);
    });

    it('should return true for GIF files', () => {
      const file = new File([''], 'test.gif', { type: 'image/gif' });
      expect(isValidImageFile(file)).toBe(true);
    });

    it('should return true for WebP files', () => {
      const file = new File([''], 'test.webp', { type: 'image/webp' });
      expect(isValidImageFile(file)).toBe(true);
    });

    it('should return false for non-image files', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' });
      expect(isValidImageFile(file)).toBe(false);
    });

    it('should return false for unsupported image types', () => {
      const file = new File([''], 'test.bmp', { type: 'image/bmp' });
      expect(isValidImageFile(file)).toBe(false);
    });
  });

  describe('isFileSizeValid', () => {
    it('should return true for files under the size limit', () => {
      const content = new Array(1024).fill('a').join(''); // 1KB
      const file = new File([content], 'test.jpg', { type: 'image/jpeg' });
      expect(isFileSizeValid(file)).toBe(true);
    });

    it('should return true for files exactly at the size limit', () => {
      const content = new Array(MAX_FILE_SIZE_BYTES).fill('a').join('');
      const file = new File([content], 'test.jpg', { type: 'image/jpeg' });
      expect(isFileSizeValid(file)).toBe(true);
    });

    it('should return false for files over the size limit', () => {
      const content = new Array(MAX_FILE_SIZE_BYTES + 1).fill('a').join('');
      const file = new File([content], 'test.jpg', { type: 'image/jpeg' });
      expect(isFileSizeValid(file)).toBe(false);
    });
  });

  describe('convertFileToBase64', () => {
    it('should resolve with base64 string on successful read', async () => {
      const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });

      const result = await convertFileToBase64(file);

      expect(result).toContain('data:image/jpeg;base64,');
    });

    it('should handle different image types', async () => {
      const pngFile = new File(['png content'], 'test.png', { type: 'image/png' });

      const result = await convertFileToBase64(pngFile);

      expect(result).toContain('data:image/png;base64,');
    });
  });
});
