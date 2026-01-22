import { describe, it, expect } from 'vitest';
import { formatElapsedTime } from './helpers';

describe('StopWatchWidget helpers', () => {
  describe('formatElapsedTime', () => {
    it('should format zero milliseconds', () => {
      expect(formatElapsedTime(0)).toBe('00:00');
    });

    it('should format seconds only', () => {
      expect(formatElapsedTime(5000)).toBe('00:05');
      expect(formatElapsedTime(30000)).toBe('00:30');
      expect(formatElapsedTime(59000)).toBe('00:59');
    });

    it('should format minutes and seconds', () => {
      expect(formatElapsedTime(60000)).toBe('01:00');
      expect(formatElapsedTime(125000)).toBe('02:05');
      expect(formatElapsedTime(3599000)).toBe('59:59');
    });

    it('should format hours, minutes and seconds', () => {
      expect(formatElapsedTime(3600000)).toBe('01:00:00');
      expect(formatElapsedTime(3661000)).toBe('01:01:01');
      expect(formatElapsedTime(7323000)).toBe('02:02:03');
    });

    it('should handle exactly 1 hour', () => {
      expect(formatElapsedTime(3600000)).toBe('01:00:00');
    });

    it('should handle exactly 1 minute', () => {
      expect(formatElapsedTime(60000)).toBe('01:00');
    });

    it('should pad single digit values with zeros', () => {
      expect(formatElapsedTime(61000)).toBe('01:01');
      expect(formatElapsedTime(3661000)).toBe('01:01:01');
    });

    it('should handle large values', () => {
      expect(formatElapsedTime(36610000)).toBe('10:10:10');
      expect(formatElapsedTime(86400000)).toBe('24:00:00');
    });

    it('should handle milliseconds less than a second', () => {
      expect(formatElapsedTime(500)).toBe('00:00');
      expect(formatElapsedTime(999)).toBe('00:00');
    });
  });
});
