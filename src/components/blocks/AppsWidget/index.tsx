import { Widget } from '@/components/shared/Widget';
import type { AppsWidget } from './types';
import AppLink from './AppLink';

export function AppsWidget({ elements, ...props }: AppsWidget) {
  const hasElements = elements.length > 0;

  if (!hasElements) return null;

  return (
    <Widget className="flex max-w-full items-center" {...props}>
      <div className="flex w-full flex-wrap items-center justify-center gap-4">
        {elements.map(element => (
          <AppLink key={element.url} {...element} />
        ))}
      </div>
    </Widget>
  );
}
