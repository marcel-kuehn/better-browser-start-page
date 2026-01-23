import { Button } from '@/components/ui/button';
import type { WidgetOptionCardProps } from './types';
import WidgetVariantButtons from './WidgetVariantButtons';

export default function WidgetOptionCard({
  option,
  onSelectWidget,
  isVariantDisabled,
}: WidgetOptionCardProps) {
  const Icon = option.icon;
  const hasMultiple = option.variants.length > 1;
  const singleVariant = option.variants[0];

  if (!hasMultiple) {
    const isDisabled = isVariantDisabled(singleVariant);
    return (
      <Button
        key={option.type}
        variant="outline"
        className="bg-muted/50 flex h-auto items-center justify-start gap-4 p-4"
        onClick={() => onSelectWidget(option.type, singleVariant)}
        disabled={isDisabled}
      >
        <div className="bg-primary rounded-lg p-2 transition-transform">
          <Icon className="text-primary-foreground h-5 w-5" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-foreground mb-1 text-sm leading-none font-bold">
            {option.label}
          </span>
          <span className="text-muted-foreground text-xs">{option.description}</span>
        </div>
      </Button>
    );
  }

  return (
    <div className="border-input bg-muted/50 flex flex-col gap-3 rounded-xl border p-4">
      <div className="flex items-center gap-4">
        <div className="bg-primary rounded-lg p-2">
          <Icon className="text-primary-foreground h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-foreground mb-1 text-sm leading-none font-bold">
            {option.label}
          </span>
          <span className="text-muted-foreground line-clamp-1 text-xs">{option.description}</span>
        </div>
      </div>
      <WidgetVariantButtons
        type={option.type}
        variants={option.variants}
        onSelectWidget={onSelectWidget}
        isVariantDisabled={isVariantDisabled}
      />
    </div>
  );
}
