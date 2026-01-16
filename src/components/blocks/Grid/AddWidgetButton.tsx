import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddWidgetButtonProps {
  row: number;
  col: number;
  onClick: (row: number, col: number) => void;
}

export function AddWidgetButton({ row, col, onClick }: AddWidgetButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={() => onClick(row, col)}
      aria-label={`Add widget at row ${row}, column ${col}`}
      className="h-full bg-background/40 border-dashed border-foreground/50 border transition-colors"
      style={{ gridArea: `${row} / ${col} / ${row + 1} / ${col + 1}` }}
    >
      <Plus className="text-foreground" />
    </Button>
  );
}
