import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BlockRenderer from '@/components/shared/BlockRenderer';
import type { CellPosition, Direction, Grid as GridProps, GridSpan } from './types';
import { cn } from '@/lib/utils';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { GridControl } from './GridControl';
import { AddWidgetButton } from './AddWidgetButton';
import { useGridEditor } from './useGridEditor';
import { createDefaultWidgetConfigs } from '@/components/shared/WidgetSelectionDialog/helpers';
import { GRID_ROW_MIN_HEIGHT } from '@/constants/grid';

import { canGridBeContracted, getTargetArea, isCollidingWithOtherWidgets } from './helpers';
import WidgetSelectionDialog from '@/components/shared/WidgetSelectionDialog';
import { Widget } from '@/types';

export default function Grid({ span, elements, id }: GridProps) {
  const { rowSpan, columnSpan } = span;
  const { t } = useTranslation();
  const { isInEditMode, updateElementById } = useAppConfig();
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);

  const DEFAULT_WIDGET_CONFIGS = createDefaultWidgetConfigs(t);

  const { expandGrid, contractGrid } = useGridEditor(id, span, elements, updateElementById);

  const handleSelectWidget = (type: string, widgetSpan: GridSpan) => {
    if (!selectedCell) return;

    const baseConfig = DEFAULT_WIDGET_CONFIGS[type] || {};
    const targetArea = getTargetArea(selectedCell, widgetSpan);
    if (!targetArea) return;

    updateElementById(id, {
      elements: [
        ...elements,
        { ...baseConfig, id: crypto.randomUUID(), type, gridArea: targetArea },
      ],
    });
    setSelectedCell(null);
  };

  const getGridControls = (span: GridSpan, elements: Widget[]) => {
    return (['top', 'left', 'bottom', 'right'] as Direction[]).map((direction: Direction) => {
      return (
        <GridControl
          key={direction}
          onExpand={() => expandGrid(direction)}
          onContract={() => contractGrid(direction)}
          canContract={canGridBeContracted(direction, elements, span)}
          direction={direction}
        />
      );
    });
  };

  const getAddWidgetButtons = (span: GridSpan, elements: Widget[]) => {
    const { rowSpan, columnSpan } = span;
    return Array.from({ length: rowSpan }).map((_, rowIndex) => {
      const row = rowIndex + 1;
      return Array.from({ length: columnSpan }).map((_, columnIndex) => {
        const column = columnIndex + 1;
        if (
          isCollidingWithOtherWidgets(
            elements,
            getTargetArea({ row, column }, { rowSpan: 1, columnSpan: 1 })
          )
        )
          return null;

        return (
          <AddWidgetButton
            key={`cell-${row}-${column}`}
            position={{ row, column }}
            onClick={() => setSelectedCell({ row, column })}
          />
        );
      });
    });
  };

  return (
    <div className="relative p-10">
      <div
        className={cn(
          'grid gap-4 transition-all',
          isInEditMode && 'outline-foreground/60 outline-1 outline-offset-4 outline-dashed'
        )}
        style={{
          gridTemplateColumns: `repeat(${columnSpan}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rowSpan}, minmax(${GRID_ROW_MIN_HEIGHT}, auto))`,
        }}
      >
        {isInEditMode && (
          <>
            <WidgetSelectionDialog
              isOpen={!!selectedCell}
              onOpenChange={open => !open && setSelectedCell(null)}
              handleSelectWidget={handleSelectWidget}
              selectedCell={selectedCell}
              elements={elements}
              gridSpan={span}
            />
            {getGridControls(span, elements)}

            {getAddWidgetButtons(span, elements)}
          </>
        )}

        <BlockRenderer blocks={elements} />
      </div>
    </div>
  );
}
