import { describe, it, expect } from 'vitest';
import { getNextConfigVersion, isLatestConfigVersion, migrateConfig } from './index';
import { CONFIG_VERSION_ORDER } from './constants';

describe('Migration utilities', () => {
  describe('getNextConfigVersion', () => {
    it('should return next version for valid version', () => {
      expect(getNextConfigVersion('0.0.0')).toBe('0.0.1');
      expect(getNextConfigVersion('0.0.1')).toBe('0.0.2');
    });

    it('should return null for latest version', () => {
      const latestVersion = CONFIG_VERSION_ORDER[CONFIG_VERSION_ORDER.length - 1];
      expect(getNextConfigVersion(latestVersion)).toBeNull();
    });

    it('should return null for invalid version', () => {
      expect(getNextConfigVersion('invalid')).toBeNull();
      expect(getNextConfigVersion('9.9.9')).toBeNull();
    });
  });

  describe('isLatestConfigVersion', () => {
    it('should return true for latest version', () => {
      const latestVersion = CONFIG_VERSION_ORDER[CONFIG_VERSION_ORDER.length - 1];
      expect(isLatestConfigVersion(latestVersion)).toBe(true);
    });

    it('should return false for non-latest version', () => {
      expect(isLatestConfigVersion('0.0.0')).toBe(false);
      expect(isLatestConfigVersion('0.0.1')).toBe(false);
    });
  });

  describe('migrateConfig', () => {
    it('should return config unchanged if already latest version', () => {
      const latestVersion = CONFIG_VERSION_ORDER[CONFIG_VERSION_ORDER.length - 1];
      const config = { _v: latestVersion, elements: [] };
      const result = migrateConfig(config);
      expect(result).toEqual(config);
    });

    it('should migrate from 0.0.0 to latest', () => {
      const oldConfig = {
        widgets: [
          {
            id: '1',
            type: 'search',
            gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
          },
        ],
      };
      const result = migrateConfig(oldConfig);
      expect(result._v).toBe(CONFIG_VERSION_ORDER[CONFIG_VERSION_ORDER.length - 1]);
      expect(result).toHaveProperty('elements');
    });

    it('should migrate from 0.0.1 to latest', () => {
      const oldConfig = {
        _v: '0.0.1',
        elements: [
          {
            type: 'grid',
            columns: 4,
            rows: 4,
            elements: [{ id: '1', type: 'search' }],
          },
        ],
      };
      const result = migrateConfig(oldConfig);
      expect(result._v).toBe(CONFIG_VERSION_ORDER[CONFIG_VERSION_ORDER.length - 1]);
    });

    it('should handle config without version (defaults to 0.0.0)', () => {
      const config = { widgets: [] };
      const result = migrateConfig(config);
      expect(result._v).toBe(CONFIG_VERSION_ORDER[CONFIG_VERSION_ORDER.length - 1]);
    });

    it('should handle invalid version gracefully', () => {
      const config = { _v: 'invalid-version', elements: [] };
      const result = migrateConfig(config);
      // Should return unchanged if version is invalid
      expect(result).toEqual(config);
    });
  });
});
