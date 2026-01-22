import { describe, it, expect, vi } from 'vitest';
import { migrateToVersion_0_0_1 } from './0.0.1';
import { WIDGET_TYPE_GRID } from '@/constants/widgetTypes';

describe('migrateToVersion_0_0_1', () => {
  it('should migrate widgets to elements structure', () => {
    const oldConfig = {
      widgets: [
        {
          id: '1',
          type: 'search',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
        {
          id: '2',
          type: 'clock',
          gridArea: { rowStart: 2, rowEnd: 3, columnStart: 1, columnEnd: 2 },
        },
      ],
    };

    const result = migrateToVersion_0_0_1(oldConfig);

    expect(result._v).toBe('0.0.1');
    expect(result).toHaveProperty('elements');
    expect(Array.isArray(result.elements)).toBe(true);
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0]).toHaveProperty('type', WIDGET_TYPE_GRID);
    expect(result.elements[0]).toHaveProperty('columns', 4);
    expect(result.elements[0]).toHaveProperty('elements');
    expect(result.elements[0].elements).toEqual(oldConfig.widgets);
  });

  it('should calculate rows based on max rowEnd', () => {
    const oldConfig = {
      widgets: [
        {
          id: '1',
          type: 'search',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
        {
          id: '2',
          type: 'clock',
          gridArea: { rowStart: 2, rowEnd: 5, columnStart: 1, columnEnd: 2 },
        },
      ],
    };

    const result = migrateToVersion_0_0_1(oldConfig);

    expect(result.elements[0].rows).toBe(4);
  });

  it('should handle empty widgets array', () => {
    const oldConfig = {
      widgets: [],
    };

    const result = migrateToVersion_0_0_1(oldConfig);

    expect(result._v).toBe('0.0.1');
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].elements).toEqual([]);
    expect(result.elements[0].rows).toBe(1);
  });

  it('should handle widgets without gridArea', () => {
    const oldConfig = {
      widgets: [
        {
          id: '1',
          type: 'search',
        },
      ],
    };

    const result = migrateToVersion_0_0_1(oldConfig);

    expect(result._v).toBe('0.0.1');
    expect(result.elements[0].rows).toBe(1);
  });

  it('should chain with callback migration', () => {
    const oldConfig = {
      widgets: [
        {
          id: '1',
          type: 'search',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ],
    };

    const callback = vi.fn(config => ({ ...config, migrated: true }));
    const result = migrateToVersion_0_0_1(oldConfig, callback);

    expect(callback).toHaveBeenCalled();
    expect(result.migrated).toBe(true);
  });

  it('should handle undefined widgets', () => {
    const oldConfig = {};

    const result = migrateToVersion_0_0_1(oldConfig);

    expect(result._v).toBe('0.0.1');
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].elements).toEqual([]);
    expect(result.elements[0].rows).toBe(1);
  });
});
