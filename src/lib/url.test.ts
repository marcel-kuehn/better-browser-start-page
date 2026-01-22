import { describe, it, expect } from 'vitest';
import { normalizeUrl, getDomain, getFaviconUrl } from './url';

describe('URL utilities', () => {
  describe('normalizeUrl', () => {
    it('should return origin for valid HTTP URL', () => {
      expect(normalizeUrl('https://example.com/path?query=1')).toBe('https://example.com');
      expect(normalizeUrl('http://example.com:8080/path')).toBe('http://example.com:8080');
    });

    it('should return origin for valid HTTPS URL', () => {
      expect(normalizeUrl('https://www.google.com/search')).toBe('https://www.google.com');
    });

    it('should return empty string for invalid URL', () => {
      expect(normalizeUrl('not-a-url')).toBe('');
      expect(normalizeUrl('://invalid')).toBe('');
    });

    it('should return empty string for undefined input', () => {
      expect(normalizeUrl(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(normalizeUrl('')).toBe('');
    });
  });

  describe('getDomain', () => {
    it('should return hostname for valid URL', () => {
      expect(getDomain('https://example.com/path')).toBe('example.com');
      expect(getDomain('http://www.google.com/search?q=test')).toBe('www.google.com');
    });

    it('should return hostname with port', () => {
      expect(getDomain('http://localhost:3000/path')).toBe('localhost');
    });

    it('should return empty string for invalid URL', () => {
      expect(getDomain('not-a-url')).toBe('');
      expect(getDomain('://invalid')).toBe('');
    });

    it('should return empty string for undefined input', () => {
      expect(getDomain(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(getDomain('')).toBe('');
    });
  });

  describe('getFaviconUrl', () => {
    it('should return favicon URL for valid URL', () => {
      expect(getFaviconUrl('https://example.com/path')).toBe('https://example.com/favicon.ico');
      expect(getFaviconUrl('http://www.google.com')).toBe('http://www.google.com/favicon.ico');
    });

    it('should return favicon URL with port', () => {
      expect(getFaviconUrl('http://localhost:3000')).toBe('http://localhost:3000/favicon.ico');
    });

    it('should return /favicon.ico for invalid URL', () => {
      expect(getFaviconUrl('not-a-url')).toBe('/favicon.ico');
    });

    it('should return /favicon.ico for undefined input', () => {
      expect(getFaviconUrl(undefined)).toBe('/favicon.ico');
    });

    it('should return /favicon.ico for empty string', () => {
      expect(getFaviconUrl('')).toBe('/favicon.ico');
    });
  });
});
