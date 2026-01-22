import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddWidgetButtonProps } from './types';

export function AddWidgetButton({ position, onClick }: AddWidgetButtonProps) {
  const { row, column } = position;
  return (
    <Button
      variant="ghost"
      onClick={() => onClick(row, column)}
      aria-label={`Add widget at row ${row}, column ${column}`}
      className="bg-background/40 border-foreground/50 h-full border border-dashed transition-colors"
      style={{ gridArea: `${row} / ${column} / ${row + 1} / ${column + 1}` }}
    >
      <Plus className="text-foreground" />
    </Button>
  );
}
