import { MigrationFunction } from '../types';
import { DEFAULT_LANGUAGE } from '@/constants/languages';

/**
 * Migration from 0.0.3 to 0.0.4
 * Adds language field to settings (defaults to 'en')
 */
export const migrateToVersion_0_0_4: MigrationFunction = (
  oldConfig: Record<string, unknown>,
  cb?: MigrationFunction
): Record<string, unknown> => {
  const settings = oldConfig.settings as Record<string, unknown> | undefined;

  const newConfig = {
    ...oldConfig,
    _v: '0.0.4',
    settings: {
      ...settings,
      language: settings?.language ?? DEFAULT_LANGUAGE,
    },
  };

  return cb ? cb(newConfig) : newConfig;
};
