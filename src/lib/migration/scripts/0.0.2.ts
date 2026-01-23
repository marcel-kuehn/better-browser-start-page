/* eslint-disable @typescript-eslint/no-explicit-any */
import { WIDGET_TYPE_GRID } from '@/constants/widgetTypes';
import { MigrationFunction } from '../types';
import { DEFAULT_THEME } from '@/constants/themes';

/**
 * Recursively adds a unique ID to a block and all its nested elements.
 */
const addIdsToBlocks = (blocks: any[]): any[] => {
  return blocks.map(block => {
    const updatedBlock = {
      ...block,
      // Generate a simple unique ID if one doesn't exist
      id: block.id ?? crypto.randomUUID(),
    };

    // If the block has an 'elements' array, migrate those children too
    if (updatedBlock.elements && Array.isArray(updatedBlock.elements)) {
      updatedBlock.elements = addIdsToBlocks(updatedBlock.elements);
    }

    return updatedBlock;
  });
};

export const migrateToVersion_0_0_2: MigrationFunction = (
  oldConfig: Record<string, unknown>,
  cb?: MigrationFunction
): Record<string, unknown> => {
  // 1. Prepare the new config structure
  let elements = Array.isArray(oldConfig.elements) ? addIdsToBlocks(oldConfig.elements) : [];

  elements = elements.map(element => {
    if (element.type === WIDGET_TYPE_GRID) {
      const grid = {
        ...element,
        span: {
          rowSpan: element.rows,
          columnSpan: element.columns,
        },
      };

      delete grid.rows;
      delete grid.columns;

      return grid;
    }
    return element;
  });

  const newConfig = {
    ...oldConfig,
    _v: '0.0.2',
    elements, // Now contains IDs at every level
    settings: {
      theme: (oldConfig.settings as any)?.theme ?? DEFAULT_THEME,
    },
  };

  return cb ? cb(newConfig) : newConfig;
};
