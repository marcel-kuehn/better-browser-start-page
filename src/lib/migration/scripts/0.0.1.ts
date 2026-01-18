import { MigrationFunction } from '../types';
import { WIDGET_TYPE_GRID } from '@/constants/widgetTypes';

export const migrateToVersion_0_0_1: MigrationFunction = (
  oldConfig: Record<string, unknown>,
  cb?: MigrationFunction
): Record<string, unknown> => {
  const newConfig = {
    _v: '0.0.1',
    elements: [
      {
        type: WIDGET_TYPE_GRID,
        columns: 4,
        rows:
          Math.max(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...((oldConfig.widgets as any[]) ?? []).map(w => w.gridArea?.rowEnd ?? 1)
          ) - 1,

        elements: oldConfig.widgets,
      },
    ],
  };

  return cb ? cb(newConfig) : newConfig;
};
