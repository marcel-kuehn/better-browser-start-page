import type { WidgetOptionsListProps } from './types';
import WidgetOptionCard from './WidgetOptionCard';

export default function WidgetOptionsList({
  options,
  onSelectWidget,
  isVariantDisabled,
}: WidgetOptionsListProps) {
  return (
    <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-1">
      {options.map(option => (
        <WidgetOptionCard
          key={option.type}
          option={option}
          onSelectWidget={onSelectWidget}
          isVariantDisabled={isVariantDisabled}
        />
      ))}
    </div>
  );
}
