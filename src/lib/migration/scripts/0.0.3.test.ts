import { describe, it, expect, vi } from 'vitest';
import { migrateToVersion_0_0_3 } from './0.0.3';
import { DEFAULT_THEME } from '@/constants/themes';

describe('migrateToVersion_0_0_3', () => {
  it('should add customBackgroundImage field to settings when missing', () => {
    const oldConfig = {
      _v: '0.0.2',
      settings: {
        theme: DEFAULT_THEME,
      },
      elements: [],
    };

    const result: any = migrateToVersion_0_0_3(oldConfig);

    expect(result._v).toBe('0.0.3');
    expect(result.settings).toHaveProperty('customBackgroundImage');
    expect(result.settings.customBackgroundImage).toBeNull();
    expect(result.settings.theme).toBe(DEFAULT_THEME);
  });

  it('should preserve existing customBackgroundImage if already set', () => {
    const existingImage = 'data:image/png;base64,test123';
    const oldConfig = {
      _v: '0.0.2',
      settings: {
        theme: DEFAULT_THEME,
        customBackgroundImage: existingImage,
      },
      elements: [],
    };

    const result: any = migrateToVersion_0_0_3(oldConfig);

    expect(result._v).toBe('0.0.3');
    expect(result.settings.customBackgroundImage).toBe(existingImage);
    expect(result.settings.theme).toBe(DEFAULT_THEME);
  });

  it('should set customBackgroundImage to null when it is explicitly null', () => {
    const oldConfig = {
      _v: '0.0.2',
      settings: {
        theme: DEFAULT_THEME,
        customBackgroundImage: null,
      },
      elements: [],
    };

    const result: any = migrateToVersion_0_0_3(oldConfig);

    expect(result._v).toBe('0.0.3');
    expect(result.settings.customBackgroundImage).toBeNull();
  });

  it('should preserve all other settings fields', () => {
    const oldConfig = {
      _v: '0.0.2',
      settings: {
        theme: 'glassmorphism-dark',
      },
      elements: [],
    };

    const result: any = migrateToVersion_0_0_3(oldConfig);

    expect(result._v).toBe('0.0.3');
    expect(result.settings.theme).toBe('glassmorphism-dark');
    expect(result.settings.customBackgroundImage).toBeNull();
  });

  it('should handle config without settings object', () => {
    const oldConfig = {
      _v: '0.0.2',
      elements: [],
    };

    const result: any = migrateToVersion_0_0_3(oldConfig);

    expect(result._v).toBe('0.0.3');
    expect(result.settings).toHaveProperty('customBackgroundImage');
    expect(result.settings.customBackgroundImage).toBeNull();
  });

  it('should preserve all other config properties', () => {
    const oldConfig = {
      _v: '0.0.2',
      settings: {
        theme: DEFAULT_THEME,
      },
      elements: [{ id: 'test', type: 'grid' }],
      someOtherProperty: 'should be preserved',
    };

    const result: any = migrateToVersion_0_0_3(oldConfig);

    expect(result._v).toBe('0.0.3');
    expect(result.elements).toEqual([{ id: 'test', type: 'grid' }]);
    expect(result.someOtherProperty).toBe('should be preserved');
    expect(result.settings.customBackgroundImage).toBeNull();
  });

  it('should chain with callback migration', () => {
    const oldConfig = {
      _v: '0.0.2',
      settings: {
        theme: DEFAULT_THEME,
      },
      elements: [],
    };

    const callback = vi.fn(config => ({ ...config, migrated: true }));
    const result = migrateToVersion_0_0_3(oldConfig, callback);

    expect(callback).toHaveBeenCalled();
    expect(result.migrated).toBe(true);
    expect((result as any)._v).toBe('0.0.3');
    expect((result as any).settings.customBackgroundImage).toBeNull();
  });
});
