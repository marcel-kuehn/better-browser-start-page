import { MigrationFunction } from '../types';

/**
 * Migration from 0.0.2 to 0.0.3
 * Adds customBackgroundImage field to settings (defaults to null)
 */
export const migrateToVersion_0_0_3: MigrationFunction = (
  oldConfig: Record<string, unknown>,
  cb?: MigrationFunction
): Record<string, unknown> => {
  const settings = oldConfig.settings as Record<string, unknown> | undefined;

  const newConfig = {
    ...oldConfig,
    _v: '0.0.3',
    settings: {
      ...settings,
      customBackgroundImage: settings?.customBackgroundImage ?? null,
    },
  };

  return cb ? cb(newConfig) : newConfig;
};
