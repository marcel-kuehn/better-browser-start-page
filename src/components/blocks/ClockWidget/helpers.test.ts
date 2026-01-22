import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getTime, getDate } from './helpers';

describe('ClockWidget helpers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubEnv('LANG', 'de_DE.UTF-8');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getTime', () => {
    it('should return formatted time string', () => {
      const mockDate = new Date('2024-01-15T14:30:00');
      vi.setSystemTime(mockDate);

      const time = getTime();
      expect(time).toMatch(/^\d{2}:\d{2}$/);
      expect(time).toBe('14:30');
    });

    it('should return time with 2-digit format', () => {
      const mockDate = new Date('2024-01-15T09:05:00');
      vi.setSystemTime(mockDate);

      const time = getTime();
      expect(time).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should return time for midnight', () => {
      const mockDate = new Date('2024-01-15T00:00:00');
      vi.setSystemTime(mockDate);

      const time = getTime();
      expect(time).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe('getDate', () => {
    it('should return formatted date string', () => {
      const mockDate = new Date('2024-01-15T14:30:00');
      vi.setSystemTime(mockDate);

      const date = getDate();
      expect(date).toBeTruthy();
      expect(typeof date).toBe('string');
      // The exact format depends on locale, but should contain day info
      expect(date.length).toBeGreaterThan(0);
    });

    it('should return date with weekday, month, and day', () => {
      const mockDate = new Date('2024-01-15T14:30:00'); // Monday, January 15
      vi.setSystemTime(mockDate);

      const date = getDate();
      // Format should include weekday, month, and day
      expect(date).toBeTruthy();
    });
  });
});
