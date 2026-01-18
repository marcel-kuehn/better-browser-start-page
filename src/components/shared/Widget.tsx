import { Card } from '@/components/ui/card';
import type { Widget as WidgetType } from '@/types';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WidgetProps extends WidgetType {
  children?: React.ReactNode;
  className?: string;
}

export function Widget({ children, className, gridArea, id }: WidgetProps) {
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
    >
      {isInEditMode && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 z-50 h-5 w-5"
          onClick={() => removeElementById(id)}
        >
          <X className="h-2 w-2" />
        </Button>
      )}
      {children}
    </Card>
  );
}
