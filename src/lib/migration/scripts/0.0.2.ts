/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const elements = Array.isArray(oldConfig.elements) ? addIdsToBlocks(oldConfig.elements) : [];

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
