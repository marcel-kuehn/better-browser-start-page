import BlockRenderer from "@/components/shared/BlockRenderer";
import type { Grid as GridProps } from "./types";
import clsx from "clsx";
import { useAppConfig } from "@/contexts/AppConfig/useAppConfig";
import { GridControls } from "./GridControls";
import { AddWidgetButton } from "./AddWidgetButton";
import { useGridEditor } from "./useGridEditor";

export default function Grid({ columns, rows, elements, id }: GridProps) {
  const { isInEditMode, updateElementById } = useAppConfig();

  const { expandGrid, contractGrid } = useGridEditor(
    id,
    rows,
    columns,
    elements,
    updateElementById
  );

  // Logic to check if a boundary track is empty
  const canContract = {
    top: !elements.some((el) => el.gridArea.rowStart === 1),
    bottom: !elements.some((el) => el.gridArea.rowEnd === rows + 1),
    left: !elements.some((el) => el.gridArea.columnStart === 1),
    right: !elements.some((el) => el.gridArea.columnEnd === columns + 1),
  };

  const addWidget = (row: number, col: number) => {
    console.log(`Adding widget at Row: ${row}, Column: ${col}`);
  };

  const isCellOccupied = (r: number, c: number) => {
    return elements.some((el) => {
      const { rowStart, rowEnd, columnStart, columnEnd } = el.gridArea;
      return r >= rowStart && r < rowEnd && c >= columnStart && c < columnEnd;
    });
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
    </div>
  );
}
