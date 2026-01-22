import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { replacePlaceholder, openUrl } from './helpers';

describe('SearchWidget helpers', () => {
  describe('replacePlaceholder', () => {
    it('should replace placeholder with value', () => {
      expect(replacePlaceholder('https://example.com/search?q={query}', 'query', 'test')).toBe(
        'https://example.com/search?q=test'
      );
    });

    it('should replace placeholder in middle of string', () => {
      expect(replacePlaceholder('https://example.com/{query}/results', 'query', 'search')).toBe(
        'https://example.com/search/results'
      );
    });

    it('should replace placeholder at start of string', () => {
      expect(replacePlaceholder('{query}?param=value', 'query', 'test')).toBe('test?param=value');
    });

    it('should replace placeholder at end of string', () => {
      expect(replacePlaceholder('https://example.com/{query}', 'query', 'test')).toBe(
        'https://example.com/test'
      );
    });

    it('should not replace if placeholder does not exist', () => {
      const text = 'https://example.com/search';
      expect(replacePlaceholder(text, 'query', 'test')).toBe(text);
    });

    it('should handle empty value', () => {
      expect(replacePlaceholder('https://example.com/search?q={query}', 'query', '')).toBe(
        'https://example.com/search?q='
      );
    });

    it('should handle special characters in value', () => {
      expect(
        replacePlaceholder('https://example.com/search?q={query}', 'query', 'test+query')
      ).toBe('https://example.com/search?q=test+query');
    });
  });

  describe('openUrl', () => {
    let originalOpen: typeof window.open;

    beforeEach(() => {
      originalOpen = window.open;
      window.open = vi.fn();
    });

    afterEach(() => {
      window.open = originalOpen;
    });

    it('should open valid URL', () => {
      openUrl('https://example.com');
      expect(window.open).toHaveBeenCalledWith(
        'https://example.com',
        '_self',
        'noopener,noreferrer'
      );
    });

    it('should not open undefined URL', () => {
      openUrl(undefined);
      expect(window.open).not.toHaveBeenCalled();
    });

    it('should not open empty string', () => {
      openUrl('');
      expect(window.open).not.toHaveBeenCalled();
    });

    it('should open URL with query parameters', () => {
      openUrl('https://example.com/search?q=test');
      expect(window.open).toHaveBeenCalledWith(
        'https://example.com/search?q=test',
        '_self',
        'noopener,noreferrer'
      );
    });
  });
});
