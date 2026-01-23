import { migrateToVersion_0_0_1 } from './scripts/0.0.1';
import { migrateToVersion_0_0_2 } from './scripts/0.0.2';
import { migrateToVersion_0_0_3 } from './scripts/0.0.3';
import { migrateToVersion_0_0_4 } from './scripts/0.0.4';
import { MigrationFunction } from './types';

export const CONFIG_VERSION_ORDER = ['0.0.0', '0.0.1', '0.0.2', '0.0.3', '0.0.4'];
export const STARTER_CONFIG_VERSION = CONFIG_VERSION_ORDER[0];

export const CONFIG_VERSION_MIGRATIONS: Record<string, MigrationFunction> = {
  '0.0.1': migrateToVersion_0_0_1,
  '0.0.2': migrateToVersion_0_0_2,
  '0.0.3': migrateToVersion_0_0_3,
  '0.0.4': migrateToVersion_0_0_4,
};
