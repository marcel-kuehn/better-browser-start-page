import { useState } from 'react';
import BlockRenderer from '@/components/shared/BlockRenderer';
import type { Grid as GridProps } from './types';
import { cn } from '@/lib/utils';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { GridControls } from './GridControls';
import { AddWidgetButton } from './AddWidgetButton';
import { useGridEditor } from './useGridEditor';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClockIcon, LayoutGridIcon, LinkIcon, SearchIcon, TimerIcon } from 'lucide-react';
import { GridArea } from '@/types';

const DEFAULT_WIDGET_CONFIGS: Record<string, unknown> = {
  'search-widget': {
    elements: [
      {
        id: crypto.randomUUID(),
        url: 'https://www.google.com/search?q={query}',
      },
    ],
  },
  'apps-widget': {
    elements: [{ id: crypto.randomUUID(), url: 'https://example.com/' }],
  },
  'links-widget': {
    title: 'New Category',
    elements: [
      {
        id: crypto.randomUUID(),
        label: 'Example Link',
        url: 'https://example.com',
      },
    ],
  },
  'clock-widget': {},
  'stopwatch-widget': {},
};

const WIDGET_OPTIONS = [
  {
    type: 'search-widget',
    label: 'Search Bar',
    description: 'Multi-engine search interface.',
    icon: SearchIcon,
    variants: [
      { w: 2, h: 1 },
      { w: 3, h: 1 },
      { w: 4, h: 1 },
    ],
  },
  {
    type: 'apps-widget',
    label: 'Apps Grid',
    description: 'Pinned shortcuts and bookmarks.',
    icon: LayoutGridIcon,
    variants: [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 1, h: 3 },
      { w: 1, h: 4 },
      { w: 2, h: 1 },
      { w: 2, h: 2 },
      { w: 2, h: 3 },
      { w: 2, h: 4 },
      { w: 3, h: 1 },
      { w: 3, h: 2 },
      { w: 3, h: 3 },
      { w: 3, h: 4 },
      { w: 4, h: 1 },
      { w: 4, h: 2 },
      { w: 4, h: 3 },
      { w: 4, h: 4 },
    ],
  },
  {
    type: 'links-widget',
    label: 'Link List',
    description: 'Grouped vertical lists.',
    icon: LinkIcon,
    variants: [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 1, h: 3 },
      { w: 1, h: 4 },
    ],
  },
  {
    type: 'clock-widget',
    label: 'Clock',
    description: 'Time and date display.',
    icon: ClockIcon,
    variants: [{ w: 1, h: 1 }],
  },
  {
    type: 'stopwatch-widget',
    label: 'Stopwatch',
    description: 'Productivity timer.',
    icon: TimerIcon,
    variants: [{ w: 1, h: 1 }],
  },
];

export default function Grid({ columns, rows, elements, id }: GridProps) {
  const { isInEditMode, updateElementById } = useAppConfig();
  const [selectedCell, setSelectedCell] = useState<{
    r: number;
    c: number;
  } | null>(null);

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
      alert('Not enough space to the right or bottom!');
      return;
    }

    if (elements.some(el => checkCollision(targetArea, el.gridArea))) {
      alert('This area overlaps with an existing widget.');
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
          gridTemplateRows: `repeat(${rows}, minmax(80px, auto))`,
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
            <DialogTitle className="text-foreground">Add Widget</DialogTitle>
            <DialogDescription>Pick a widget to add to your grid.</DialogDescription>
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
