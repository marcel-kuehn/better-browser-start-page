import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BlockRenderer from '@/components/shared/BlockRenderer';
import type { Grid as GridProps } from './types';
import { cn } from '@/lib/utils';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { GridControls } from './GridControls';
import { AddWidgetButton } from './AddWidgetButton';
import { useGridEditor } from './useGridEditor';
import { createDefaultWidgetConfigs, getWidgetOptions } from '@/constants/widgets';
import { GRID_ROW_MIN_HEIGHT } from '@/constants/grid';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GridArea } from '@/types';

export default function Grid({ columns, rows, elements, id }: GridProps) {
  const { t } = useTranslation();
  const { isInEditMode, updateElementById } = useAppConfig();
  const [selectedCell, setSelectedCell] = useState<{
    r: number;
    c: number;
  } | null>(null);

  const DEFAULT_WIDGET_CONFIGS = createDefaultWidgetConfigs(t);
  const WIDGET_OPTIONS = getWidgetOptions(t);

  const { expandGrid, contractGrid } = useGridEditor(
    id,
    rows,
    columns,
    elements,
    updateElementById
  );

  const canContract = {
    top: !elements.some(el => el.gridArea.rowStart === 1),
    bottom: !elements.some(el => el.gridArea.rowEnd === rows + 1),
    left: !elements.some(el => el.gridArea.columnStart === 1),
    right: !elements.some(el => el.gridArea.columnEnd === columns + 1),
  };

  const checkCollision = (areaA: GridArea, areaB: GridArea) => {
    return (
      areaA.columnStart < areaB.columnEnd &&
      areaA.columnEnd > areaB.columnStart &&
      areaA.rowStart < areaB.rowEnd &&
      areaA.rowEnd > areaB.rowStart
    );
  };

  const isCellOccupied = (r: number, c: number) => {
    return elements.some(el => {
      const { rowStart, rowEnd, columnStart, columnEnd } = el.gridArea;
      return r >= rowStart && r < rowEnd && c >= columnStart && c < columnEnd;
    });
  };

  const handleSelectWidget = (type: string, w: number, h: number) => {
    if (!selectedCell) return;
    const baseConfig = DEFAULT_WIDGET_CONFIGS[type] || {};

    const targetArea: GridArea = {
      rowStart: selectedCell.r,
      rowEnd: selectedCell.r + h,
      columnStart: selectedCell.c,
      columnEnd: selectedCell.c + w,
    };

    if (targetArea.columnEnd > columns + 1 || targetArea.rowEnd > rows + 1) {
      alert(t('errors.notEnoughSpace'));
      return;
    }

    if (elements.some(el => checkCollision(targetArea, el.gridArea))) {
      alert(t('errors.overlapError'));
      return;
    }

    updateElementById(id, {
      elements: [
        ...elements,
        { ...baseConfig, id: crypto.randomUUID(), type, gridArea: targetArea },
      ],
    });
    setSelectedCell(null);
  };

  return (
    <div className="relative p-10">
      {isInEditMode && (
        <GridControls onExpand={expandGrid} onContract={contractGrid} canContract={canContract} />
      )}

      <div
        className={cn(
          'grid gap-4 transition-all',
          isInEditMode && 'outline-foreground/60 outline-1 outline-offset-4 outline-dashed'
        )}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(${GRID_ROW_MIN_HEIGHT}, auto))`,
        }}
      >
        {isInEditMode &&
          Array.from({ length: rows }).map((_, rIdx) => {
            const r = rIdx + 1;
            return Array.from({ length: columns }).map((_, cIdx) => {
              const c = cIdx + 1;
              if (isCellOccupied(r, c)) return null;
              return (
                <AddWidgetButton
                  key={`cell-${r}-${c}`}
                  row={r}
                  col={c}
                  onClick={(row, col) => setSelectedCell({ r: row, c: col })}
                />
              );
            });
          })}
        <BlockRenderer blocks={elements} />
      </div>

      <Dialog open={!!selectedCell} onOpenChange={open => !open && setSelectedCell(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t('ui.addWidget')}</DialogTitle>
            <DialogDescription>{t('ui.pickWidget')}</DialogDescription>
          </DialogHeader>

          <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-1">
            {WIDGET_OPTIONS.map(option => {
              const Icon = option.icon;
              const hasMultiple = option.variants.length > 1;
              const singleVariant = option.variants[0];

              const isFit = (w: number, h: number) =>
                selectedCell && selectedCell.c + w <= columns + 1 && selectedCell.r + h <= rows + 1;

              if (!hasMultiple) {
                const canFit = isFit(singleVariant.w, singleVariant.h);
                return (
                  <Button
                    key={option.type}
                    variant="outline"
                    disabled={!canFit}
                    className="bg-muted/50 flex h-auto items-center justify-start gap-4 p-4"
                    onClick={() =>
                      handleSelectWidget(option.type, singleVariant.w, singleVariant.h)
                    }
                  >
                    <div className="bg-primary rounded-lg p-2 transition-transform">
                      <Icon className="text-primary-foreground h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-foreground mb-1 text-sm leading-none font-bold">
                        {option.label}
                      </span>
                      <span className="text-muted-foreground text-xs">{option.description}</span>
                    </div>
                  </Button>
                );
              }

              return (
                <div
                  key={option.type}
                  className="border-input bg-muted/50 flex flex-col gap-3 rounded-xl border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary rounded-lg p-2">
                      <Icon className="text-primary-foreground h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-foreground mb-1 text-sm leading-none font-bold">
                        {option.label}
                      </span>
                      <span className="text-muted-foreground line-clamp-1 text-xs">
                        {option.description}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 pt-1">
                    {option.variants.map(v => {
                      const canFit = isFit(v.w, v.h);
                      const sizeLabel = `${v.w}x${v.h}`;
                      return (
                        <Button
                          key={sizeLabel}
                          variant="outline"
                          size="sm"
                          disabled={!canFit}
                          className="h-8 px-3"
                          onClick={() => handleSelectWidget(option.type, v.w, v.h)}
                        >
                          {sizeLabel}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
