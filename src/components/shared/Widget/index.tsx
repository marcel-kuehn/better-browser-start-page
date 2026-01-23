import { Card } from '@/components/ui/card';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { X, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { WidgetProps } from './types';
import { useTranslation } from 'react-i18next';

export function Widget({ children, className, gridArea, id, type, ...props }: WidgetProps) {
  const { isInEditMode, removeElementById, copyWidget } = useAppConfig();
  const { t } = useTranslation();

  const handleCopy = () => {
    // Include all widget properties: id, type, gridArea, and any additional props (like elements)
    copyWidget({ id, type, gridArea, ...props });
  };

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
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={handleCopy}
            aria-label={t('ui.copyWidget')}
            data-testid="copy-widget-button"
          >
            <Copy className="h-2 w-2" />
          </Button>
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
