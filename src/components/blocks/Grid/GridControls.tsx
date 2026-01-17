import { Button } from '@/components/ui/button'
import { MinusCircle, PlusCircle } from 'lucide-react'
import clsx from 'clsx'

type Direction = 'top' | 'bottom' | 'left' | 'right'

interface GridControlsProps {
  onExpand: (d: Direction) => void
  onContract: (d: Direction) => void
  canContract: Record<Direction, boolean>
}

const DIRECTIONS: { id: Direction; class: string }[] = [
  { id: 'top', class: '-top-1 left-0 right-0 flex-row justify-center' },
  { id: 'bottom', class: '-bottom-1 left-0 right-0 flex-row justify-center' },
  { id: 'left', class: '-left-1 top-0 bottom-0 flex-col justify-center' },
  { id: 'right', class: '-right-1 top-0 bottom-0 flex-col justify-center' },
]

export function GridControls({ onExpand, onContract, canContract }: GridControlsProps) {
  return (
    <>
      {DIRECTIONS.map(({ id, class: positionClass }) => (
        <div key={id} className={clsx('absolute flex gap-1 items-center z-20', positionClass)}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onExpand(id)}
            aria-label={`Add ${id === 'top' || id === 'bottom' ? 'row' : 'column'} ${id}`}
          >
            <PlusCircle className="text-foreground" />
          </Button>

          {canContract[id] && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onContract(id)}
              aria-label={`Remove ${id === 'top' || id === 'bottom' ? 'row' : 'column'} ${id}`}
            >
              <MinusCircle className="text-foreground" />
            </Button>
          )}
        </div>
      ))}
    </>
  )
}
