import { Button } from '@/components/ui/button';
import type { WidgetVariantButtonsProps } from './types';

export default function WidgetVariantButtons({
  type,
  variants,
  onSelectWidget,
  isVariantDisabled,
}: WidgetVariantButtonsProps) {
  return (
    <div className="mt-1 flex flex-wrap gap-2 pt-1">
      {variants.map(variant => {
        const sizeLabel = `${variant.rowSpan}x${variant.columnSpan}`;
        const isDisabled = isVariantDisabled(variant);
        return (
          <Button
            key={`${type}-${sizeLabel}`}
            variant="outline"
            size="sm"
            className="h-8 px-3"
            onClick={() => onSelectWidget(type, variant)}
            disabled={isDisabled}
            data-testid={`widget-variant-${type}-${sizeLabel}`}
          >
            {sizeLabel}
          </Button>
        );
      })}
    </div>
  );
}
