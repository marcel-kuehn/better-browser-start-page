import { CONFIG_VERSION_MIGRATIONS, CONFIG_VERSION_ORDER } from './constants';
import { MigrationFunction } from './types';

export const getNextConfigVersion = (currentVersion: string): string | null => {
  const currentIndex = CONFIG_VERSION_ORDER.indexOf(currentVersion);
  if (currentIndex === -1 || currentIndex === CONFIG_VERSION_ORDER.length - 1) {
    return null;
  }
  return CONFIG_VERSION_ORDER[currentIndex + 1];
};

export const isLatestConfigVersion = (version: string): boolean => {
  return version === CONFIG_VERSION_ORDER[CONFIG_VERSION_ORDER.length - 1];
};

export const migrateConfig: MigrationFunction = oldConfig => {
  const configVersion = oldConfig['_v'] || '0.0.0';
  console.log(oldConfig, configVersion);

  if (isLatestConfigVersion(configVersion as string)) {
    console.log('isLatest');
    return oldConfig;
  }

  const nextVersion = getNextConfigVersion(configVersion as string);
  if (!nextVersion) {
    console.log('hasNoNextVersion');
    return oldConfig;
  }

  const nextVersionMigration = CONFIG_VERSION_MIGRATIONS[nextVersion];
  if (!nextVersionMigration) {
    console.log('hasNotNextVersionMigration');
    return oldConfig;
  }

  console.log('migrating to', nextVersion, nextVersionMigration);

  return nextVersionMigration(oldConfig, migrateConfig);
};
