import { MigrationFunction } from '../types';
import { WIDGET_TYPE_GRID } from '@/constants/widgetTypes';
import { DEFAULT_GRID_ROWS } from '@/constants/grid';

export const migrateToVersion_0_0_1: MigrationFunction = (
  oldConfig: Record<string, unknown>,
  cb?: MigrationFunction
): Record<string, unknown> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const widgets = (oldConfig.widgets as any[]) ?? [];
  const rowEnds = widgets.map(w => w.gridArea?.rowEnd ?? 1);

  // Handle empty widgets array - use default grid rows, otherwise calculate from max rowEnd
  let calculatedRows = rowEnds.length > 0 ? Math.max(...rowEnds) - 1 : DEFAULT_GRID_ROWS;

  if (calculatedRows < DEFAULT_GRID_ROWS) {
    calculatedRows = DEFAULT_GRID_ROWS;
  }

  const newConfig = {
    _v: '0.0.1',
    elements: [
      {
        type: WIDGET_TYPE_GRID,
        columns: 4,
        rows: calculatedRows,
        elements: widgets,
      },
    ],
  };

  return cb ? cb(newConfig) : newConfig;
};
