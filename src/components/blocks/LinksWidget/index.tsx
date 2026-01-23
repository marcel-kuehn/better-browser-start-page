import { Widget } from '@/components/shared/Widget';
import type { LinksWidget } from './types';
import Link from './Link';

export function LinksWidget({ title, elements, ...props }: LinksWidget) {
  return (
    <Widget
      className="flex w-full flex-1 flex-col gap-4 px-4 py-6"
      {...props}
      title={title}
      elements={elements}
    >
      <h3 className="text-foreground text-2xl leading-none font-semibold tracking-tight">
        {title}
      </h3>
      <ul className="-mx-2 flex flex-col">
        {elements.map(element => (
          <li key={element.id}>
            <Link {...element} />
          </li>
        ))}
      </ul>
    </Widget>
  );
}
