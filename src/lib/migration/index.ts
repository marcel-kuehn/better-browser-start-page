import { CONFIG_VERSION_MIGRATIONS, CONFIG_VERSION_ORDER } from "./constants";
import { MigrationFunction } from "./types";

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

export const migrateConfig: MigrationFunction = (oldConfig) => {
  const configVersion = oldConfig["_v"] || "0.0.0";
  console.log(oldConfig, configVersion);

  if (isLatestConfigVersion(configVersion as string)) {
    return oldConfig;
  }

  const nextVersion = getNextConfigVersion(configVersion as string);
  if (!nextVersion) {
    return oldConfig;
  }

  const nextVersionMigration = CONFIG_VERSION_MIGRATIONS[nextVersion];
  if (!nextVersionMigration) {
    return oldConfig;
  }

  return nextVersionMigration(oldConfig, migrateConfig);
};
