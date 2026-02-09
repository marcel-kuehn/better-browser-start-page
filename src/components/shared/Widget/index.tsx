import { Card } from '@/components/ui/card';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { WidgetProps } from './types';
import { CopyWidgetButton } from './CopyWidgetButton';

export function Widget({ children, className, gridArea, id, type, ...props }: WidgetProps) {
  const { isInEditMode, removeElementById } = useAppConfig();

  return (
    <Card
      className={cn(
        'bg-card/70 border-border/30 group relative w-full px-4 py-6 backdrop-blur-xl',
        className
      )}
      style={{
        gridArea: `${gridArea.rowStart} / ${gridArea.columnStart} / ${gridArea.rowEnd} / ${gridArea.columnEnd}`,
      }}
      data-testid={`widget-${type}-${gridArea.rowStart}-${gridArea.columnStart}`}
    >
      {isInEditMode && (
        <div className="absolute top-1 right-1 z-50 flex gap-1">
          <CopyWidgetButton widget={{ id, type, gridArea, ...props }} />
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => removeElementById(id)}
            data-testid="remove-widget-button"
          >
            <X className="h-2 w-2" />
          </Button>
        </div>
      )}
      {children}
    </Card>
  );
}
