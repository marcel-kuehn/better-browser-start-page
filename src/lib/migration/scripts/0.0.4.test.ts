import { describe, it, expect, vi } from 'vitest';
import { migrateToVersion_0_0_4 } from './0.0.4';
import { DEFAULT_THEME } from '@/constants/themes';
import { DEFAULT_LANGUAGE, LANGUAGE_GERMAN } from '@/constants/languages';

describe('migrateToVersion_0_0_4', () => {
  it('should add language field to settings when missing', () => {
    const oldConfig = {
      _v: '0.0.3',
      settings: {
        theme: DEFAULT_THEME,
        customBackgroundImage: null,
      },
      elements: [],
    };

    const result: any = migrateToVersion_0_0_4(oldConfig);

    expect(result._v).toBe('0.0.4');
    expect(result.settings).toHaveProperty('language');
    expect(result.settings.language).toBe(DEFAULT_LANGUAGE);
    expect(result.settings.theme).toBe(DEFAULT_THEME);
    expect(result.settings.customBackgroundImage).toBeNull();
  });

  it('should preserve existing language if already set', () => {
    const oldConfig = {
      _v: '0.0.3',
      settings: {
        theme: DEFAULT_THEME,
        customBackgroundImage: null,
        language: LANGUAGE_GERMAN,
      },
      elements: [],
    };

    const result: any = migrateToVersion_0_0_4(oldConfig);

    expect(result._v).toBe('0.0.4');
    expect(result.settings.language).toBe(LANGUAGE_GERMAN);
    expect(result.settings.theme).toBe(DEFAULT_THEME);
  });

  it('should preserve all other settings fields', () => {
    const oldConfig = {
      _v: '0.0.3',
      settings: {
        theme: 'glassmorphism-dark',
        customBackgroundImage: 'data:image/png;base64,test123',
      },
      elements: [],
    };

    const result: any = migrateToVersion_0_0_4(oldConfig);

    expect(result._v).toBe('0.0.4');
    expect(result.settings.theme).toBe('glassmorphism-dark');
    expect(result.settings.customBackgroundImage).toBe('data:image/png;base64,test123');
    expect(result.settings.language).toBe(DEFAULT_LANGUAGE);
  });

  it('should handle config without settings object', () => {
    const oldConfig = {
      _v: '0.0.3',
      elements: [],
    };

    const result: any = migrateToVersion_0_0_4(oldConfig);

    expect(result._v).toBe('0.0.4');
    expect(result.settings).toHaveProperty('language');
    expect(result.settings.language).toBe(DEFAULT_LANGUAGE);
  });

  it('should preserve all other config properties', () => {
    const oldConfig = {
      _v: '0.0.3',
      settings: {
        theme: DEFAULT_THEME,
        customBackgroundImage: null,
      },
      elements: [{ id: 'test', type: 'grid' }],
      someOtherProperty: 'should be preserved',
    };

    const result: any = migrateToVersion_0_0_4(oldConfig);

    expect(result._v).toBe('0.0.4');
    expect(result.elements).toEqual([{ id: 'test', type: 'grid' }]);
    expect(result.someOtherProperty).toBe('should be preserved');
    expect(result.settings.language).toBe(DEFAULT_LANGUAGE);
  });

  it('should chain with callback migration', () => {
    const oldConfig = {
      _v: '0.0.3',
      settings: {
        theme: DEFAULT_THEME,
        customBackgroundImage: null,
      },
      elements: [],
    };

    const callback = vi.fn(config => ({ ...config, migrated: true }));
    const result = migrateToVersion_0_0_4(oldConfig, callback);

    expect(callback).toHaveBeenCalled();
    expect(result.migrated).toBe(true);
    expect((result as any)._v).toBe('0.0.4');
    expect((result as any).settings.language).toBe(DEFAULT_LANGUAGE);
  });
});
