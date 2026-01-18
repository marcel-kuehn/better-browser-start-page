import { CONFIG_VERSION_ORDER } from '@/lib/migration/constants';

export const DEFAULT_CONFIG_VERSION = CONFIG_VERSION_ORDER[
  CONFIG_VERSION_ORDER.length - 1
] as '0.0.2';
