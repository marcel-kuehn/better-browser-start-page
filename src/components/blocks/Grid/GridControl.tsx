import { Button } from '@/components/ui/button';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Direction, GridControlProps } from './types';

const DIRECTIONS: { id: Direction; class: string }[] = [
  { id: 'top', class: '-top-1 left-0 right-0 flex-row justify-center' },
  { id: 'bottom', class: '-bottom-1 left-0 right-0 flex-row justify-center' },
  { id: 'left', class: '-left-1 top-0 bottom-0 flex-col justify-center' },
  { id: 'right', class: '-right-1 top-0 bottom-0 flex-col justify-center' },
];

export function GridControl({ onExpand, direction, onContract, canContract }: GridControlProps) {
  const directionData = DIRECTIONS.find(d => d.id === direction);
  if (!directionData) return null;

  const { class: positionClass, id } = directionData;
  const isRow = id === 'top' || id === 'bottom';
  const label = isRow ? 'row' : 'column';
  const addButtonAriaLabel = `Add ${label} to the ${id}`;
  const removeButtonAriaLabel = `Remove ${label} from the ${id}`;

  return (
    <>
      <div className={cn('absolute z-20 flex items-center gap-1', positionClass)}>
        <Button variant="ghost" size="icon" onClick={onExpand} aria-label={addButtonAriaLabel}>
          <PlusCircle className="text-foreground" />
        </Button>

        {canContract && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onContract}
            aria-label={removeButtonAriaLabel}
          >
            <MinusCircle className="text-foreground" />
          </Button>
        )}
      </div>
    </>
  );
}
