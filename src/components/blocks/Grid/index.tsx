import BlockRenderer from "@/components/shared/BlockRenderer";
import type { Grid } from "./types";

export default function Grid({ columns, rows, elements }: Grid) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, auto)`,
      }}
    >
      <BlockRenderer blocks={elements} />
    </div>
  );
}
