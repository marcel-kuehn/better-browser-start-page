import BlockRenderer from "@/components/shared/BlockRenderer";
import type { Grid } from "./types";

export default function Grid({ elements }: Grid) {
  console.log(elements);
  return (
    <div className="grid grid-cols-4 gap-4">
      <BlockRenderer blocks={elements} />
    </div>
  );
}
