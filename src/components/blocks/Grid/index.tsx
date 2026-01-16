import { useState } from "react";
import BlockRenderer from "@/components/shared/BlockRenderer";
import type { Grid as GridProps } from "./types";
import clsx from "clsx";
import { useAppConfig } from "@/contexts/AppConfig/useAppConfig";
import { GridControls } from "./GridControls";
import { AddWidgetButton } from "./AddWidgetButton";
import { useGridEditor } from "./useGridEditor";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ClockIcon,
  LayoutGridIcon,
  LinkIcon,
  SearchIcon,
  TimerIcon,
} from "lucide-react";
import { GridArea } from "@/types";

const DEFAULT_WIDGET_CONFIGS: Record<string, unknown> = {
  "search-widget": {
    elements: [
      {
        id: crypto.randomUUID(),
        url: "https://www.google.com/search?q={query}",
      },
    ],
  },
  "apps-widget": {
    elements: [{ id: crypto.randomUUID(), url: "https://example.com/" }],
  },
  "links-widget": {
    title: "New Category",
    elements: [
      {
        id: crypto.randomUUID(),
        label: "Example Link",
        url: "https://example.com",
      },
    ],
  },
  "clock-widget": {},
  "stopwatch-widget": {},
};

const WIDGET_OPTIONS = [
  {
    type: "search-widget",
    label: "Search Bar",
    description: "Search Google, YouTube, and more.",
    icon: SearchIcon,
  },
  {
    type: "clock-widget",
    label: "Clock",
    description: "Display current time and date.",
    icon: ClockIcon,
  },
  {
    type: "apps-widget",
    label: "Apps",
    description: "Pinned shortcuts to your favorite apps.",
    icon: LayoutGridIcon,
  },
  {
    type: "links-widget",
    label: "Links",
    description: "Grouped list of links.",
    icon: LinkIcon,
  },
  {
    type: "stopwatch-widget",
    label: "Stopwatch",
    description: "Track time for tasks and productivity.",
    icon: TimerIcon,
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
    top: !elements.some((el) => el.gridArea.rowStart === 1),
    bottom: !elements.some((el) => el.gridArea.rowEnd === rows + 1),
    left: !elements.some((el) => el.gridArea.columnStart === 1),
    right: !elements.some((el) => el.gridArea.columnEnd === columns + 1),
  };

  /**
   * Checks if two grid areas overlap.
   */
  const checkCollision = (areaA: GridArea, areaB: GridArea) => {
    return (
      areaA.columnStart < areaB.columnEnd &&
      areaA.columnEnd > areaB.columnStart &&
      areaA.rowStart < areaB.rowEnd &&
      areaA.rowEnd > areaB.rowStart
    );
  };

  /**
   * Defines the static default width and height for widget types.
   */
  const getWidgetSize = (type: string) => {
    let w = 1;
    let h = 1;

    if (type === "search-widget") w = 2;
    if (type === "apps-widget") w = 4;
    if (type === "links-widget") h = 2;

    return { w, h };
  };

  const addWidget = (row: number, col: number) => {
    setSelectedCell({ r: row, c: col });
  };

  const isCellOccupied = (r: number, c: number) => {
    return elements.some((el) => {
      const { rowStart, rowEnd, columnStart, columnEnd } = el.gridArea;
      return r >= rowStart && r < rowEnd && c >= columnStart && c < columnEnd;
    });
  };

  const handleSelectWidget = (type: string) => {
    if (!selectedCell) return;
    const baseConfig = DEFAULT_WIDGET_CONFIGS[type] || {};
    const size = getWidgetSize(type);

    const targetArea: GridArea = {
      rowStart: selectedCell.r,
      rowEnd: selectedCell.r + size.h,
      columnStart: selectedCell.c,
      columnEnd: selectedCell.c + size.w,
    };

    // 1. Out of Bounds Check
    const isOutOfBounds =
      targetArea.columnEnd > columns + 1 || targetArea.rowEnd > rows + 1;

    if (isOutOfBounds) {
      alert("This widget is too large to fit here (out of bounds).");
      return;
    }

    // 2. Collision Check
    const isAreaBlocked = elements.some((el) =>
      checkCollision(targetArea, el.gridArea)
    );

    if (isAreaBlocked) {
      alert("This space is too crowded for this widget.");
      return;
    }

    // 3. Success: Add the widget
    const newWidget = {
      ...baseConfig,
      id: crypto.randomUUID(),
      type,
      gridArea: targetArea,
    };

    updateElementById(id, { elements: [...elements, newWidget] });
    setSelectedCell(null);
  };

  return (
    <div className="relative p-10">
      {isInEditMode && (
        <GridControls
          onExpand={expandGrid}
          onContract={contractGrid}
          canContract={canContract}
        />
      )}

      <div
        className={clsx(
          "grid gap-4 transition-all",
          isInEditMode &&
            "outline-1 outline-dashed outline-foreground/60 outline-offset-4"
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
                  onClick={addWidget}
                />
              );
            });
          })}

        <BlockRenderer blocks={elements} />
      </div>

      <Dialog
        open={!!selectedCell}
        onOpenChange={(open) => !open && setSelectedCell(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Widgets</DialogTitle>
            <DialogDescription>Please select a widget.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 py-2">
            {WIDGET_OPTIONS.map((option) => {
              const Icon = option.icon;
              const widgetSize = getWidgetSize(option.type);
              const sizeLabel = `${widgetSize.w}x${widgetSize.h}`;

              return (
                <Button
                  key={option.type}
                  variant="outline"
                  className="text-start flex items-center justify-start gap-4 h-auto py-3 px-4 hover:bg-accent transition-colors group relative"
                  onClick={() => handleSelectWidget(option.type)}
                >
                  <div className="flex-shrink-0 p-2 bg-primary rounded-md">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col items-start overflow-hidden flex-1">
                    <div className="flex items-center gap-2 w-full">
                      <span className="font-semibold text-sm">
                        {option.label}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 h-4 ml-auto"
                      >
                        {sizeLabel}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {option.description}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
